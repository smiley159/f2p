//// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Blt is ERC1155 {

    address public owner;

    constructor(string memory _uri) ERC1155(_uri) {
        //owner = msg.sender;
        owner = tx.origin;

    }

    modifier ownerOnly() {
        require(
            msg.sender == owner || tx.origin == owner,
            "Not Authorized owner"
        );
        _;
    }

    function setOwner(address _newOwner) public ownerOnly {
        owner = _newOwner;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public ownerOnly {
        _mint(account, id, amount, data);

    }


}
