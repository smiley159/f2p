//// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BNB is ERC20 {
    address owner;

    constructor() ERC20("Binance", "BNB") {
        owner = msg.sender;
    }

    modifier ownerOnly() {
        require(
            msg.sender == owner || tx.origin == owner,
            "Not Authorized owner"
        );
        _;
    }

    function mint(address _to, uint256 _amount) public {//Todo add allowed minter {
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) public{ //Todo add allowed burner {
        _burn(_from, _amount);
    }
}
