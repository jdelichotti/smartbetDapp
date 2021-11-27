import '../styles/globals.css'
import Link from 'next/link'


function Betplace({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl text-green-700 font-bold">SmartBet</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              Bets
            </a>
          </Link>      
          <Link href="/bet-administration">
            <a className="mr-6 text-blue-500">
              Bet Administration
            </a>
          </Link>
          <Link href="/create-bet">
            <a className="mr-6 text-blue-500">
              Create Bet
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Betplace