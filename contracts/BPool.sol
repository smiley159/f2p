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
 

    //EVENTS

    event betEvent(string side, address indexed from, uint256 amount);

    constructor(address _token,address _bltUp,address _bltDown) {
        owner = msg.sender;
        token_ = _token;
        token = BNB(_token);
        bltUp = Blt(_bltUp);
        bltDown = Blt(_bltDown);

    }

    modifier onlyBeforeStart() {
        // require(block.number < startBlock, "Invalid after round has started");
        _;
    }

    modifier onlyAfterEnd() {
        // require(block.number > endBlock, "Invalid before round has ended");
        _;
    }

    function endCurrentRound() public{
        //get end price for the previous round / start price for the current round
        //betting end for the current round and start for the next round
        uint _endPrice = getPrice(100);
        uint _endBlock = block.number;
        
        poolRecords[currentPoolID-1].endPrice = _endPrice;
        poolRecords[currentPoolID-1].endBlock = _endBlock;
        poolRecords[currentPoolID-1].status = Status.COMPLETED;
        poolRecords[currentPoolID].startPrice = _endPrice;
        poolRecords[currentPoolID].startBlock = _endBlock;
        poolRecords[currentPoolID].status = Status.PENDING;

        burnLosingToken();

        poolRecords[currentPoolID+1].status = Status.BETTING;

        currentPoolID += 1;
    }

    // user make a bet
    function bet(uint256 _amount, bool _up) public onlyBeforeStart {
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

    // owner judge the result
    function burnLosingToken() internal {
        uint startPrice = poolRecords[currentPoolID-1].startPrice;
        uint endPrice = poolRecords[currentPoolID-1].endPrice;
        bool isUpWin = endPrice > startPrice;
        if(isUpWin){
            token.burn(address(this),poolRecords[currentPoolID-1].totalBetDown);
        }else{
            token.burn(address(this),poolRecords[currentPoolID-1].totalBetUp);
        }

    }


    function claim() public { 
        // uint256 claimable;
        // if (isUpWin) {
        //     claimable = betUpBalances[msg.sender];
        //     betUpBalances[msg.sender] = 0;
        // } else {
        //     claimable = betDownBalances[msg.sender];
        //     betDownBalances[msg.sender] = 0;
        // }
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
    function getPrice(uint256 seed) public view returns(uint256) {
        uint256 price =
            uint256(
                keccak256(
                    (
                        abi.encodePacked(
                            blockhash(block.number - 1),
                            block.timestamp,
                            seed
                        )
                    )
                )
            );
        return price;
    }
}