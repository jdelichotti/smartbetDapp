import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import Link from 'next/link';

import {
   smartbetaddress
} from '../config'
import SmartBet from '../contracts/SmartBet.json'

export default function BetsReady() {
  const [bets, setBets] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [metaMask, setMetaMask] = useState('installed')
  const [metaMaskNetwork, setMetaMaskNetwork] = useState('connected')
  const betStates = ['BetFunding', 'Created', 'Open', 'Closed', 'ResultsReady', 'ReadyForPayment', 'Finished']  
  useEffect(() => {
    loadBets()
  }, [])

  async function loadBets() {

    // this returns the provider, or null if it wasn't detected
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setMetaMask('not-installed')
      return
    } 
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(smartbetaddress, SmartBet.abi, provider)    
   try{
      const data = await contract.getAvailableBets()
      let betsItems = await Promise.all(data.map(async i => {
      let bet = {    
        betId: i.betId.toNumber(),
        localTeam: i.localTeam,
        visitorTeam: i.visitorTeam, 
        state: i.state,
        results: i.results,
        initialAmount: ethers.utils.formatUnits(i.initialAmount.toString(), 'ether'),
        localWiningAmount: ethers.utils.formatUnits(i.localWiningAmount.toString(), 'ether'),
        visitorWiningAmount: ethers.utils.formatUnits(i.visitorWiningAmount.toString(), 'ether'),
        drawnAmount: ethers.utils.formatUnits(i.drawnAmount.toString(), 'ether')
        }
        return bet
    }))
    setBets(betsItems)
    setLoadingState('loaded')
      } catch (error) { 
        window.alert("Verify your MetaMask Network Connection")
        setMetaMaskNetwork('not-connected')
        return
    }

  }

  
  
  if (metaMaskNetwork === 'not-connected') return (<h1 className="px-20 py-10 text-3xl">MetaMask is in the wrong Network</h1>)
  if (metaMask === 'not-installed') return (<h1 className="px-20 py-10 text-3xl">MetaMask is not installed</h1>)
  if (loadingState === 'loaded' && !bets.length) return (<h1 className="py-10 px-20 text-3xl">No bets created</h1>)
  return (
    
<div className="flex flex-col ">
    <div className="-my-2 overflow-x-auto sm:-mx-8 lg:-mx-8 ">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Local Team
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Visitor Team
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Initial Amount
                </th>                
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Local Winning Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Visitor Winning Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Drawn Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bet State
                </th>
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Local Wins!</span>
                </th>               
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Visitor Wins!</span>
                </th>
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Add Liquidity</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {
                    bets.map(
                        (betItem, i) => 
                            (
                            <tr key={betItem.betId}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{betItem.localTeam}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.visitorTeam}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.initialAmount} eth</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.localWiningAmount} eth</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.visitorWiningAmount} eth</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.drawnAmount} eth</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {betStates[betItem.state]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={{ pathname: '/add-gambler-bet' , query: { id: betItem.betId, optionSelected: 0} }}>
                                    <a  className="text-indigo-600 hover:text-indigo-900">
                                    <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded">Local Wins</button>
                                    </a>
                                </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={{ pathname: '/add-gambler-bet', query: { id: betItem.betId , optionSelected:1 }}}>
                                    <a  className="text-indigo-600 hover:text-indigo-900">
                                    <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded">Visitor Win</button>
                                    </a>
                                </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={{ pathname: '/add-gambler-bet', query: { id: betItem.betId, optionSelected: 2 } }}>
                                    <a  className="text-indigo-600 hover:text-indigo-900">
                                    <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded">Drawn</button>
                                    </a>
                                </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={{ pathname: '/add-sponsor-liquidity' , query: { id: betItem.betId }}}>
                                    <a  className="text-indigo-600 hover:text-indigo-900">
                                    <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded">Add Liquidity</button>
                                    </a>
                                </Link>
                                </td>
                             
                            </tr>
                        )
                    )
                }
            </tbody>
            </table>
        </div>
        </div>
    </div>
    </div>
  )
}