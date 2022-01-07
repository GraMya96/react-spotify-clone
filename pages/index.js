import Head from 'next/head'
import Sidebar from '../components/sidebar'
import Center from '../components/center'
import Player from '../components/player'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      <Player />

    </div>
  )
}

