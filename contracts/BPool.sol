//SPDX-License-Identifier: UNLICENSED

pragma solidity >= 0.4 .22 < 0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Bnb.sol";
import "./Blt.sol";

contract BPool {


    address public owner; // onwer of contract
    address token_; // Accepted token of this pool
    BNB token; // Not really BNB just an ERC20 with no name yet
    Blt bltUp; // ERC1155
    Blt bltDown;

    //Structure

    enum Status {COMPLETED,BETTING,PENDING}

    struct poolInfo {
        uint poolID;
        uint startTime;
        uint endTime;
        uint startPrice;
        uint endPrice;
        uint totalBetUp;
        uint totalBetDown;
        uint alpha;
        Status status;
    }

    mapping(uint => poolInfo) public poolRecords;
    mapping(address => uint[]) public claimableArray;
    

    //Parameters

    uint public currentPoolID = 1; // current round of pool
    uint public alpha;
    // alpha = (1 - burningRate - winningProbability)/winningProbability
    // alpha is a parameter that adjust the minting rewards in order to make sure that the token has a deflationary behavior
    // is a ratio ranging from 0 to 1
    // token minting of winning bet = bet*alpha
    // alpha will guarantee in long run that minting will be less than burning

    uint256 public burningRate; // Intended Burning rate of total betting per round 
    uint256 public treasuriesFee; // Portion of Burning that goes to treasuries
    uint256 public timeFrame; // Minimum secondes required to start a new round

    //Variables

    uint256 public totalBetUp; // amount of token bet up
    uint256 public totalBetDown;
    uint256 public totalWin; // amount of token bet up
    uint256 public totalLose;
    
 

    //EVENTS

    event Log(string log,uint value);
    event betEvent(string side, address indexed from, uint256 amount);
    event ClaimEvent(bool isUpWin,address account,uint poolID, uint256 amount);
    event Alpha(uint alpha);

    //Constructor

    constructor(address _token,address _bltUp,address _bltDown) {
        owner = msg.sender;
        token_ = _token;
        token = BNB(_token); // ERC20 token use for betting
        bltUp = Blt(_bltUp); // ERC1155 token use for representing betUp amount each round
        bltDown = Blt(_bltDown); // ERC1155 token use for representing betUp amount each round
        burningRate = 5; // 5 percent of total pot to be burn each round
        totalWin = 10000; // seeding posterior statistic to avoid initial skewed case or divide by zero  
        totalLose = 10000; 
        timeFrame = 1; // Timeframe for each round ,shoud be 60 secs/ 1 mins / 1 hour / 1 days etc..

    }

    //Update Parameter

    function updateBurningRate(uint _burningRate)  public  {
        burningRate = _burningRate;
    }

    function updateAlpha() internal  {
        
        emit Log("Total Win",totalWin);
        emit Log("Total Lose",totalLose);
       
       
        uint pWin = totalWin*100/(totalWin+totalLose);
        alpha = 100*(100-burningRate-pWin)/pWin;

        emit Alpha(alpha);

    }


    function endCurrentRound() public{
        //get end price for the previous round / start price for the current round
        //betting end for the current round and start for the next round
        //anyone can call this function but only valid after the "Timeframe" has passed since round started

        require(block.timestamp > poolRecords[currentPoolID].startTime + timeFrame);
        
        
        currentPoolID += 1;
        //If pool ID < 2 poolID-2 will get index out of bound
        require(currentPoolID >= 2,"Invalid poolID");

        uint _endTime = block.number;
        uint _endPrice = getPrice(_endTime);
        
        // Update endp rice for previous 2 round
        poolRecords[currentPoolID-2].endPrice = _endPrice;
        poolRecords[currentPoolID-2].endTime = _endTime;
        poolRecords[currentPoolID-2].status = Status.COMPLETED;

        //Update start Price for previous round
        poolRecords[currentPoolID-1].startPrice = _endPrice;
        poolRecords[currentPoolID-1].startTime = _endTime;
        poolRecords[currentPoolID-1].status = Status.PENDING;

        //Start new round, accept betting
        poolRecords[currentPoolID].status = Status.BETTING;
        
        //get Pool Result of the ending round
        bool isUpWin = getPoolResult(currentPoolID-2);
        if(isUpWin){
            totalWin +=  poolRecords[currentPoolID-2].totalBetUp;
            totalLose +=  poolRecords[currentPoolID-2].totalBetDown;
        }else{
            totalWin +=  poolRecords[currentPoolID-2].totalBetDown;
            totalLose +=  poolRecords[currentPoolID-2].totalBetUp;
        }

          // All the losing bet get Burned, winning bet will be claimed by user
          burnLosingToken(currentPoolID-2);

          // update alpha parameter
          updateAlpha();

          //keep records of alpha for each round
          poolRecords[currentPoolID].alpha = alpha;

        
        
        
    }

    // user make a bet
    function bet(uint256 _amount, bool _up) public {

        require(
            token.allowance(msg.sender, address(this)) >= _amount,
            "Not authorized "
        );

        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer Failed");

        if (_up) {
           
            poolRecords[currentPoolID+1].totalBetUp += _amount;
            bltUp.mint(msg.sender,currentPoolID,_amount,"");
            emit betEvent("up", msg.sender, totalBetUp);

        } else {
        
            poolRecords[currentPoolID+1].totalBetDown += _amount;
            bltDown.mint(msg.sender,currentPoolID,_amount,"");
            emit betEvent("down", msg.sender, totalBetDown);
        }
    }


    function getPoolResult(uint _poolID) public view returns(bool){
        require(_poolID <= currentPoolID-2, "Pool not ended yet");
        uint startPrice = poolRecords[_poolID].startPrice;
        uint endPrice = poolRecords[_poolID].endPrice;
        bool isUpWin = endPrice > startPrice;
        return(isUpWin);
    }

    // owner judge the result
    function burnLosingToken(uint _poolID) internal {
       bool isUpWin = getPoolResult(_poolID);
        if(isUpWin){
            token.burn(address(this),poolRecords[_poolID].totalBetDown);
        }else{
            token.burn(address(this),poolRecords[_poolID].totalBetUp);
        }

    }

     function getClaimable(uint _poolID) public view returns(bool,uint256,uint256) {
        bool isUpWin = getPoolResult(_poolID);
        uint poolAlpha = poolRecords[_poolID].alpha;
        uint256 claimable;

        
        if (isUpWin) {
            claimable = bltUp.balanceOf(msg.sender,_poolID);
        } else {
            claimable = bltDown.balanceOf(msg.sender,_poolID);    
        }

        uint256 mintable = claimable*poolAlpha/100;
        return(isUpWin,claimable,mintable);
    }

    function claim(uint _poolID) public returns(uint _claimable) { 

        require(_poolID <= currentPoolID -2, "round not ended yet");
        bool isUpWin;
        uint256 claimable;
        uint256 mintable;
        (isUpWin,claimable,mintable) = getClaimable(_poolID);

        
        if (isUpWin) {
            claimable = bltUp.balanceOf(msg.sender,_poolID);
            bltUp.burn(msg.sender,_poolID,claimable);
            token.mint(msg.sender,mintable);
            token.transfer(msg.sender,claimable);
        } else {
            claimable = bltDown.balanceOf(msg.sender,_poolID);
            bltDown.burn(msg.sender,_poolID,claimable);
            token.mint(msg.sender,mintable);
            token.transfer(msg.sender,claimable);
        }

        emit ClaimEvent(isUpWin,msg.sender,_poolID,claimable);
        return (claimable);
        // require(claimable > 0, "No Reward to Claim");
        // token.mint(msg.sender, claimable);
        // token.transfer(msg.sender, claimable);
    }


    function getAllCliamble() public returns(uint claimable) {

     
      return 0;
    }

 

    //return odd of the current betting pairs
    function getBettingOdd() public view returns(uint){
      
      uint odds = 100*totalWin/(totalWin+totalLose);
      return (odds);
    }

    // return total betting value in the pool
    function getBalance() public {}

    // Get latest price of the undelying betting token
    function getPrice(uint256 seed) public pure returns(uint256) {
        return seed;
        // uint256 price =
        //     uint256(
        //         keccak256(
        //             (
        //                 abi.encodePacked(
        //                     blockhash(block.number - 1),
        //                     block.timestamp,
        //                     seed
        //                 )
        //             )
        //         )
        //     );
        // return price;
    }

    // Update Parameter
}