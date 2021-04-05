import { createStore } from 'redux';


const initialState = {
  web3Ready: false,
  account: "",
  // alice: "0x28F81170d858cC4F31f9BBd070A1D8A34a3340d8",
  // bob: "0x7BcD12FA4899C8d93043A86B1c69763279A28240",
  alice: "0x89ba0981704cf9D4057d66E691A94Edf83F057D8",
  bob: "0x36d5c17C43a738Cbd63714a1D007EEE85dfB425F",




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