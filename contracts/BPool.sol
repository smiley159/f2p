//SPDX-License-Identifier: UNLICENSED

pragma solidity >= 0.4 .22 < 0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Bnb.sol";
import "./Blt.sol";

contract BPool {
    //User can make a bet by using BNB

    address public owner; // onwer of contract
    address token_; // Accepted token of this pool
    BNB token;
    Blt bltUp;
    Blt bltDown;

    uint public currentPoolID = 1; // current round of binary pool

    enum Status {COMPLETED,BETTING,PENDING}

    struct poolInfo {
        uint poolID;
        uint startBlock;
        uint endBlock;
        uint startPrice;
        uint endPrice;
        uint totalBetUp;
        uint totalBetDown;
        Status status;
    }

    mapping(uint => poolInfo) poolRecords;
    

    uint256 public totalBetUp; // amount of token bet up
    uint256 public totalBetDown;
    uint256 public totalWin; // amount of token bet up
    uint256 public totalLose;
    
  

    //Parameters

    uint public alpha ; // ratio of wining minting rewards reroutig to burn
    uint256 public burningRate; // Intended Burning rate of total betting per round 
    uint256 public treasuriesFee; // Portion of Burning that goes to treasuries


 

    //EVENTS

    event Log(string log,uint value);

    event betEvent(string side, address indexed from, uint256 amount);

    event ClaimEvent(bool isUpWin,address account,uint poolID, uint256 amount);

    event Alpha(uint alpha);

    //Constructor

    constructor(address _token,address _bltUp,address _bltDown) {
        owner = msg.sender;
        token_ = _token;
        token = BNB(_token);
        bltUp = Blt(_bltUp);
        bltDown = Blt(_bltDown);
        burningRate = 5;
        totalWin = 10000;
        totalLose = 10000;

    }

    //Update Parameter

    function updateBurningRate(uint _burningRate)  public  {
        burningRate = _burningRate;
    }

    function updateAlpha() internal  {
        // uint pWin = totalWin/(totalWin+totalLose);
        emit Log("Total Win",totalWin);
        emit Log("Total Lose",totalLose);
       
        uint pWin = totalWin*100/(totalWin+totalLose);
        alpha = 100*(100-burningRate-pWin)/pWin;

        emit Alpha(alpha);


      
    }

    function endCurrentRound() public{
        //get end price for the previous round / start price for the current round
        //betting end for the current round and start for the next round
        currentPoolID += 1;
        uint _endBlock = block.number;
        uint _endPrice = getPrice(_endBlock);
        
        
        poolRecords[currentPoolID-2].endPrice = _endPrice;
        poolRecords[currentPoolID-2].endBlock = _endBlock;
        poolRecords[currentPoolID-2].status = Status.COMPLETED;
        poolRecords[currentPoolID-1].startPrice = _endPrice;
        poolRecords[currentPoolID-1].startBlock = _endBlock;
        poolRecords[currentPoolID-1].status = Status.PENDING;
        poolRecords[currentPoolID].status = Status.BETTING;

        if(currentPoolID >= 2){
            

            //Update Parameter

            bool isUpWin = getPoolResult(currentPoolID-2);
            if(isUpWin){
                totalWin +=  poolRecords[currentPoolID-2].totalBetUp;
                totalLose +=  poolRecords[currentPoolID-2].totalBetDown;
            }else{
                totalWin +=  poolRecords[currentPoolID-2].totalBetDown;
                totalLose +=  poolRecords[currentPoolID-2].totalBetUp;
            }

             burnLosingToken(currentPoolID-2);
             updateAlpha();

        }
        
        

        

        
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


    function claim(uint _poolID) public returns(uint _claimable) { 

        bool isUpWin = getPoolResult(_poolID);
        uint claimable;
        
        if (isUpWin) {
            claimable = bltUp.balanceOf(msg.sender,_poolID);
            bltUp.burn(msg.sender,_poolID,claimable);
            token.mint(msg.sender,claimable*alpha/100);
            token.transfer(msg.sender,claimable);
        } else {
            claimable = bltDown.balanceOf(msg.sender,_poolID);
            bltDown.burn(msg.sender,_poolID,claimable);
            token.mint(msg.sender,claimable*alpha/100);
            token.transfer(msg.sender,claimable);
            // claimable = betDownBalances[msg.sender];
            // betDownBalances[msg.sender] = 0;
        }

        emit ClaimEvent(isUpWin,msg.sender,_poolID,claimable);
        return (claimable);
        // require(claimable > 0, "No Reward to Claim");
        // token.mint(msg.sender, claimable);
        // token.transfer(msg.sender, claimable);
    }

    function getClaimable() public view returns(uint256) {
        // uint256 claimable;
        // if (isUpWin) {
        //     claimable = betUpBalances[msg.sender];
        // } else {
        //     claimable = betDownBalances[msg.sender];
        // }

        // return claimable * 2;
    }

    //return odd of the current betting pairs
    function getBettingOdd() public {}

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