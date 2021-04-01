import { createStore } from 'redux';


const initialState = {
  bnbAddr: "0xB66a5b58348B0693306D3AAA70ED4Cf556B3605A",
  bPoolAddr: "0x7E51B5a34Ddc9f6c5eD3C8E007Ca5E7170f8311b",
  account: "Hello",


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