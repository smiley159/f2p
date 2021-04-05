import BPool from "../contracts/BPool.json"


export default function BPoolInterface() {

  const contract = new window.web3.eth.Contract(BPool.abi, BPool.networks["5777"].address)

  return {
    loadContract: () => {
      return contract
    }

    , balanceOf: async (address) => {
      return await contract.methods.balanceOf(address).call()
    }


  }





}