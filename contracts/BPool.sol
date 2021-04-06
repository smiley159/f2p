//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Bnb.sol";

contract BPool {
    //User can make a bet by using BNB

    address owner; // onwer of contract
    address token_; // Accepted token of this pool
    BNB token;

    uint256 public totalBetUp; // amount of token bet up
    uint256 public totalBetDown;
    // amount of token bet down
    mapping(address => uint256) betUpBalances;
    address[] betUpIndices;

    mapping(address => uint256) betDownBalances;
    address[] betDownIndices;

    mapping(address => uint256) claimableBalances;

    event betEvent(string side, address indexed from, uint256 amount);

    uint256 public startBlock; // Block of starting Price
    uint256 public endBlock; // Block of ending price

    uint256 public startPrice; // Block of starting Price
    uint256 public endPrice; // Block of ending price

    bool public isUpWin; // Whether bet Up or bet Down Won
    bool isActive = true;

    constructor(address _token) {
        owner = msg.sender;
        token_ = _token;
        token = BNB(_token);

        //Dummy
        startBlock = block.number + 10000;
        endBlock = block.number + 20000;

        startPrice = getPrice(100) / token.decimals();
        endPrice = getPrice(200) / token.decimals();
    }

    modifier onlyBeforeStart() {
        require(block.number < startBlock, "Invalid after round has started");
        _;
    }

    modifier onlyAfterEnd() {
        require(block.number > endBlock, "Invalid before round has ended");
        _;
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
            if (betUpBalances[msg.sender] == 0) betUpIndices.push(msg.sender);

            betUpBalances[msg.sender] += _amount;
            totalBetUp += _amount;
            emit betEvent("up", msg.sender, totalBetUp);
        } else {
            if (betDownBalances[msg.sender] == 0)
                betDownIndices.push(msg.sender);
            betDownBalances[msg.sender] += _amount;
            totalBetDown += _amount;
            emit betEvent("down", msg.sender, totalBetDown);
        }
    }

    // owner judge the result
    function judge() public {
        require(isActive, "Pool is no longer active");
        uint256 burnAmount;
        if (startPrice > endPrice) {
            isUpWin = false;
            burnAmount = totalBetUp;
        } else {
            isUpWin = true;
            burnAmount = totalBetDown;
        }

        //Transfer token to treasuries address at 2% of total Burn

        token.burn(address(this), (burnAmount * 98) / 100);
        // token.transfer(owner, (burnAmount * 2) / 100);
        isActive = false;

        // Mint Token to winner
        //Burn token of loser we just burn
        //Redirect Portion of Burn to Treasuries
    }

    function claim() public {
        uint256 claimable;
        if (isUpWin) {
            claimable = betUpBalances[msg.sender];
            betUpBalances[msg.sender] = 0;
        } else {
            claimable = betDownBalances[msg.sender];
            betDownBalances[msg.sender] = 0;
        }
        require(claimable > 0, "No Reward to Claim");
        token.mint(msg.sender, claimable);
        token.transfer(msg.sender, claimable);
    }

    function getClaimable() public view returns (uint256) {
        uint256 claimable;
        if (isUpWin) {
            claimable = betUpBalances[msg.sender];
        } else {
            claimable = betDownBalances[msg.sender];
        }

        return claimable * 2;
    }

    //return odd of the current betting pairs
    function getBettingOdd() public {}

    // return total betting value in the pool
    function getBalance() public {}

    // Get latest price of the undelying betting token
    function getPrice(uint256 seed) public view returns (uint256) {
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
