//// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Busd is ERC20 {
    constructor() ERC20("Binance Pegged USD", "Busd") {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
