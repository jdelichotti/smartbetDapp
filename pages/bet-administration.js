import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import Link from 'next/link';

import { smartbetaddress } from '../config'

import SmartBet from '../contracts/SmartBet.json'

export default function BetDashboard() {
  const [bets, setBets] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const betStates = ['BetFunding', 'Created', 'Open', 'Closed', 'ResultsReady', 'ReadyForPayment', 'Finished']  
  useEffect(() => {
    loadBets()
  }, [])

  async function loadBets() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);    
    const contract = new ethers.Contract(smartbetaddress, SmartBet.abi, provider)    
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
     
    //console.log('items: ', bets)

  }

  async function openBet(betId) {
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)
    let transaction = await contract.openBet(betId,{from:signer.address})
    let tx = await transaction.wait()
    loadBets()
  }

  async function closeBet(betId) {
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)
    let transaction = await contract.closeBet(betId,{from:signer.address})
    let tx = await transaction.wait()
    loadBets()
  }

  async function calcPaymentBet(betId) {
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)
    let transaction = await contract.calcPayments(betId,{from:signer.address})
    let tx = await transaction.wait()
    loadBets()
  }


  async function ReleasePaymentBet(betId) {
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(smartbetaddress, SmartBet.abi, signer)
    let transaction = await contract.releasePayments(betId,{from:signer.address})
    let tx = await transaction.wait()
    loadBets()
  }




  
  //if (loadingState === 'loaded' && !bets.length) return (<h1 className="py-10 px-20 text-3xl">No bets created</h1>)
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
                  Bet ID
                </th>
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
                  <span className="sr-only">Open</span>
                </th>               
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Close</span>
                </th>
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Define Results</span>
                </th>
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Calc Payments</span>
                </th>                                                                                            
                <th scope="col" className="relative px-3 py-1">
                  <span className="sr-only">Release Payments</span>
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
                                    <div className="text-sm text-gray-900">{betItem.betId}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{betItem.localTeam}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.visitorTeam}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.initialAmount} Eth</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.localWiningAmount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.visitorWiningAmount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{betItem.drawnAmount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {betStates[betItem.state]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a  className="text-indigo-600 hover:text-indigo-900">
                                  <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded" onClick={() => closeBet(betItem.betId)}>Close</button>
                                  </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={{ pathname: '/define-result', query: { id: betItem.betId }}}>
                                  <a  className="text-indigo-600 hover:text-indigo-900">
                                  <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded">Define Result</button>
                                  </a>
                                </Link>
                                </td>                                

                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a  className="text-indigo-600 hover:text-indigo-900">
                                  <button className="w-full bg-green-500 text-white font-bold py-2 px-0 rounded" onClick={() => ReleasePaymentBet(betItem.betId)}>Release Payment</button>
                                  </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={{ pathname: '/bet-results', query: { id: betItem.betId} }}>
                                    <a  className="text-indigo-600 hover:text-indigo-900">
                                    <button className="w-full bg-blue-500 text-white font-bold py-2 px-0 rounded">Details</button>
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