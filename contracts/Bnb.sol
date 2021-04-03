//// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BNB is ERC20 {
    address owner;

    constructor() ERC20("Binance", "BNB") {
        owner = msg.sender;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Not Authorized owner");
        _;
    }

    function mint(address _to, uint256 _amount) public ownerOnly {
        _mint(_to, _amount);
    }
}
