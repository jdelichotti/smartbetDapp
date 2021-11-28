import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


import { smartbetaddress } from '../config'
const BetResults = ['NotStarted','Local Win', 'Vistor Win', 'Drawn','Unknown']  

import SmartBet from '../contracts/SmartBet.json'

export default function DefineBetResult() {
  const [formInput, updateFormInput] = useState({betResult: 0})
  const router = useRouter()
  const { id } = router.query
  
  async function onChange(e) {
    const file = e.target.files[0]
  }


  async function defineResult() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)

    //const amount = ethers.utils.parseUnits(formInput.betAmount, 'ether')
    let transaction = await contract.defineResult(id,formInput.betResult,{from:signer.address})
    let tx = await transaction.wait()
    router.push('/bet-administration')    
  }


  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Bet Results </p>
                </div>
        <input 
          placeholder="Bet Final Result"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, betResult: e.target.value })}
        />
        <button onClick={defineResult} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Submit
        </button>
      </div>
    </div>
  )
}