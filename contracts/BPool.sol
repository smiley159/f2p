pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BPool {
    //User can make a bet by using BNB

    address owner; // onwer of contract
    address token_; // Accepted token of this pool
    IERC20 token;

    uint256 public totalBetUp; // amount of token bet up
    uint256 public totalBetDown;
    // amount of token bet down
    mapping(address => uint256) betUpBalances;
    mapping(address => uint256) betDownBalances;

    event betEvent(string side, address indexed from, uint256 amount);

    uint256 startBlock; // Block of starting Price
    uint256 endBlock; // Block of ending price

    bool isActive; // Whether this block is still active

    constructor(address _token) {
        owner = msg.sender;
        token_ = _token;
        token = IERC20(_token);
        startBlock = block.number + 10000;
        endBlock = block.number + 20000;
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
            betUpBalances[msg.sender] += _amount;
            totalBetUp += _amount;
            emit betEvent("up", msg.sender, totalBetUp);
        } else {
            betDownBalances[msg.sender] += _amount;
            totalBetDown += _amount;
            emit betEvent("down", msg.sender, totalBetDown);
        }
    }

    // owner judge the result
    function judge() public onlyAfterEnd {}

    //return odd of the current betting pairs
    function getBettingOdd() public {}

    // return total betting value in the pool
    function getBalance() public {}

    // Get latest price of the undelying betting token
    function getPrice() public view returns (uint256) {
        uint256 price =
            uint256(
                keccak256(
                    (
                        abi.encodePacked(
                            blockhash(block.number - 1),
                            block.timestamp
                        )
                    )
                )
            );
        return price;
    }
}
