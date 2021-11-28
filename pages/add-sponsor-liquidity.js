import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


import {smartbetaddress} from '../config'

import SmartBet from '../contracts/SmartBet.json'

export default function AddingSponsor() {
  const [formInput, updateFormInput] = useState({ sponsorAmount: 0})
  const router = useRouter()
  const { id } = router.query

  async function onChange(e) {
  }


  async function AddLiquidity(i) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)
    
    const amount = ethers.utils.parseUnits(formInput.sponsorAmount, 'ether')
    let transaction = await contract.addBetSponsor(id,{from:signer.address, value: amount})
    let tx = await transaction.wait()
    router.push('/')    
  }


  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Liquidity Amount"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, sponsorAmount: e.target.value })}
        />
        <button onClick={AddLiquidity} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Add Liquidity
        </button>
      </div>
    </div>
  )
}