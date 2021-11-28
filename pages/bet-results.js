import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


import { smartbetaddress } from '../config'
import SmartBet from '../contracts/SmartBet.json'

export default function GambersResults() {
  
  const router = useRouter()
  const { id } = router.query
  const [Gbets, setGbets] = useState([])
  const [SponsorBet, setSponsorBet] = useState([])
  const [Sbets, setSbets] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const betStates = ['BetFunding', 'Created', 'Open', 'Closed', 'ResultsReady', 'ReadyForPayment', 'Finished']     
  const betResults = ['NotStarted', 'LocalWin', 'VistorWin', 'Drawn', 'Unknown']   
  const betOptions = ['Local Win', 'Vistor Win', 'Drawn']   
   
  
  useEffect(() => {    
    getBetGamblersResults(id)
    getBetSponsorsResults(id)
    
    
  }, [])


  async function getBetGamblersResults(_betIndex) {
    
  //    const provider = new ethers.providers.JsonRpcProvider()    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(smartbetaddress, SmartBet.abi, provider)    
    const data = await contract.getGamblers(_betIndex)


    let gamblersBet = await Promise.all(data.map(async i => {
      let bet = {    
        betId: _betIndex,
        GamblerAddress: i.gamblerAccount,
        BetOption: i.betOption, 
        BetAmount: ethers.utils.formatUnits(i.betAmount.toString(), 'ether'),
        BetReward: ethers.utils.formatUnits(i.betRewardPayment.toString(), 'ether'),
        }
        return bet
    }))
    setGbets(gamblersBet)
    setLoadingState('loaded')
  }

  async function getBetSponsorsResults(_betIndex) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(smartbetaddress, SmartBet.abi, provider)    
    const data = await contract.getSponsors(_betIndex)
    console.log(data)

    let sponsorsBet = await Promise.all(data.map(async i => {
      let bet = {    
        betId: _betIndex,
        SponsorAddress: i.sponsorAccount,        
        SponsorAmount: ethers.utils.formatUnits(i.sponsorAmount.toString(), 'ether'),
        sponsorFeeAmount: ethers.utils.formatUnits(i.sponsorFeeAmount.toString(), 'ether'),
        SponsorResult: i.result,        
        }
        return bet
    }))

    //console.log(SponsorBet)
    setSponsorBet(sponsorsBet)
    //console.log(SponsorBet)
    setLoadingState('loaded')
  }

   async function goBack() {
    router.push('/') 
  }


//if (loadingState === 'loaded') return (<h1 className="py-10 px-20 text-3xl">No bets created</h1>)
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
                  Sponsor Address
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sponsor Liquidity
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sponsor Fee
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bet Result
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {
                    SponsorBet.map(
                        (sponsorItem, i) => 
                            (
                            <tr key={sponsorItem.betId}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{sponsorItem.SponsorAddress}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{sponsorItem.SponsorAmount}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{sponsorItem.sponsorFeeAmount} Eth</div>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {betResults[0]}
                                    </span>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody>
            </table>
        </div>
        
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gambler address
                </th>

                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bet Amount Team
                </th>
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reward Amount Amount
                </th>  
                <th
                  scope="col"
                  className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bet Option
                </th>             
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {
                    Gbets.map(
                        (gamblerItem, i) => 
                            (
                            <tr key={gamblerItem.betId}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{gamblerItem.GamblerAddress}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{gamblerItem.BetAmount}</div>
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{gamblerItem.BetReward} Eth</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {betOptions[gamblerItem.BetOption]}
                                    </span>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody>
            </table>
        </div>


        </div>
        <div>
        <button onClick={goBack} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Back to Bet
        </button>
        </div>
    </div>
    </div>
  
  )
}