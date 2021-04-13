
//// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;

import "./Blt.sol";

contract BltContainer {
  address public bltUp = address(new Blt("up"));
  address public bltDown = address(new Blt("down"));

  function setNewOwner(address newOwner) public {
    Blt(bltUp).setOwner(newOwner);
    Blt(bltDown).setOwner(newOwner);

  }
}