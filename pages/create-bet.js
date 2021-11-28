import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


import { smartbetaddress } from '../config'

import SmartBet from '../contracts/SmartBet.json'

export default function BetCreation() {
  const [formInput, updateFormInput] = useState({ localTeam: '', visitorTeam: ''})
  const router = useRouter()

  async function onChange(e) {
  }


  async function createBet() {
    const { localTeam, visitorTeam } = formInput
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)
    let transaction = await contract.createBet(localTeam,visitorTeam,{from:signer.address})
    let tx = await transaction.wait()
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Local Team"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, localTeam: e.target.value })}
        />
        <input 
          placeholder="Visitor Team"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, visitorTeam: e.target.value })}
        />
        
        <button onClick={createBet} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Create Bet
        </button>
      </div>
    </div>
  )
}