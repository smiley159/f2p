//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// interface IERC20 {
//     function totalSupply() external view returns (uint256);
//     function balanceOf(address account) external view returns (uint256);
//     function transfer(address recipient, uint256 amount) external returns (bool);
//     function allowance(address owner, address spender) external view returns (uint256);
//     function approve(address spender, uint256 amount) external returns (bool);
//     function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
//     event Transfer(address indexed from, address indexed to, uint256 value);
//     event Approval(address indexed owner, address indexed spender, uint256 value);
// }

contract Pool {
    struct Order {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        uint256 blockNumber; //Block
    }

    address public owner;
    address public token1;
    address public token2;
    uint256 reserve1;
    uint256 reserve2;

    mapping(address => mapping(address => uint256)) balances;
    mapping(address => Order) orders;
    mapping(address => uint256) reserve;

    modifier ownerOnly() {
        require(msg.sender == owner, "Owner Only");
        _;
    }

    constructor(address _token1, address _token2) {
        owner = msg.sender;
        token1 = _token1;
        token2 = _token2;
        reserve1 = 0;
        reserve2 = 0;
    }

    // Deposit Token

    function deposit(uint256 _amount, address _token) external ownerOnly {
        IERC20 token = IERC20(_token);
        require(
            token.allowance(msg.sender, address(this)) >= _amount,
            "Not authorized"
        );
        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer Failed");
        balances[_token][msg.sender] += _amount;
        reserve[_token] += _amount;
    }

    // Withdraw Token

    function withdraw(uint256 _amount, address _token) external ownerOnly {
        IERC20 token = IERC20(_token);
        require(
            token.allowance(msg.sender, address(this)) >= _amount,
            "Not authorized amount"
        );
        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer Failed");
        require(balances[_token][msg.sender] >= _amount, "Insufficient");

        balances[_token][msg.sender] -= _amount;
        reserve[_token] -= _amount;
    }

    function getBalance(address _user, address _token)
        public
        view
        returns (uint256)
    {
        return (balances[_token][_user]);
    }

    function getExchangeRate(address _tokenIn, address _tokenOut)
        public
        pure
        returns (uint256)
    {
        /// Return exchange rate with X decimal places for now lets do 5
        return (10000);
    }

    function approveExchangeRate(address _tokenIn, uint256 _amountIn) public {
        //Dummy go get exchange rate
        require(
            orders[msg.sender].tokenIn == address(0),
            "Pending Order Existed"
        );
        address tokenOut = _tokenIn == token1 ? token2 : token1;
        uint256 exchangeRate = getExchangeRate(_tokenIn, tokenOut);
        exchangeRate = _tokenIn == token1 ? exchangeRate : 1 / exchangeRate;
        uint256 amountOut = _amountIn * (exchangeRate);
        Order memory newOrder =
            Order(_tokenIn, tokenOut, _amountIn, amountOut, block.number);
        orders[msg.sender] = newOrder;
    }

    function swap() public {
        //looking for existing order then swap
        //first will need to get the current price
        // require block timestamp to be at lease 3 blocks to avoid price manipulation
        Order memory order = orders[msg.sender];
        require(order.tokenIn != address(0), "Pending Order Existed");
        require(
            block.number - order.blockNumber >= 3,
            "Please wait at least 3 blocks"
        );

        uint256 newExchangeRate =
            getExchangeRate(order.tokenIn, order.tokenOut);
        uint256 newAmountOut = newExchangeRate * order.amountIn;

        require(
            (newAmountOut / order.amountOut) * 1000 <= 1,
            "Slippage over 0.1%"
        );
        IERC20(order.tokenOut).transfer(msg.sender, order.amountOut);
    }
}
