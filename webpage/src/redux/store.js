import { createStore } from 'redux';


const initialState = {
  web3Ready: false,
  account: "",
  // alice: "0x28F81170d858cC4F31f9BBd070A1D8A34a3340d8",
  // bob: "0x7BcD12FA4899C8d93043A86B1c69763279A28240",
  // pool: "0x1b7139e7CC107076B51E4d1359b38460a2108102",
  // alice: "0x89ba0981704cf9D4057d66E691A94Edf83F057D8",
  // bob: "0x36d5c17C43a738Cbd63714a1D007EEE85dfB425F",

  //For notebook

  // alice:"0xf68d28b17f478C607e7230C6041c0608f4fc69Af",
  // bob:"0x26c6f76fA53fE85a7333FC6ffD4C1eE94AEB17B7",
  // pool:"0xA502ba3Aea157c309733Cd0c064a2005A3105fB2"

    //For Home

    alice:"0x89ba0981704cf9D4057d66E691A94Edf83F057D8",
    bob:"0x36d5c17C43a738Cbd63714a1D007EEE85dfB425F",
    pool:"0x4CD88373C941b217A16Dfee9Bb74087eb25A5C2D"
  






}

const changeState = (state = initialState, { type, ...rest }) => {
  // console.log(state)
  // console.log(rest)
  switch (type) {
    case 'setState':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store