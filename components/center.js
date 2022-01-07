import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { shuffle } from 'lodash';
import { allPlaylists, selectedPlaylistState } from '../atoms/playlistAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Songs from "./songs";
import useSpotify from "../hooks/useSpotify";
import { isSpotifyConnectionError } from "../atoms/songAtom";

const COLORS = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500',
]

const Center = () => {

    const { data: session } = useSession();
    const [ color, setColor ] = useState( null );
    const spotifyApi = useSpotify();
    const [ loadingData, setLoadingData ] = useState( true );
    const playlists = useRecoilValue( allPlaylists );
    const [ dropdownOpened, setDropdownOpened ] = useState(false);
    const [ selectedPlaylist, setSelectedPlaylist ] = useRecoilState( selectedPlaylistState );
    const [ spotifyError, setSpotifyError ] = useRecoilState( isSpotifyConnectionError );

    useEffect(() => {
        //Get initial playlist
        const initialSelectedPlaylist = playlists.find( playlist => playlist.id === '0uZ3B45bcNyn838k7XWkFD' );

        setSelectedPlaylist( initialSelectedPlaylist );

        setLoadingData( false );

    }, [ playlists, spotifyApi ])

    useEffect(() => {
        setColor(shuffle(COLORS).pop());
    }, [ selectedPlaylist ])

    // Error Message disappearing after 1.2s
    useEffect(() => {
        if( spotifyError && spotifyError !== '' ) {
            setTimeout( () => setSpotifyError(''), 2000 )
        }
    }, [ spotifyError ])

    return (
        <div className='flex-grow text-white h-screen overflow-y-scroll scrollbar-hide'>
            <header className="absolute top-5 right-8">
                <div
                    onClick={ () => setDropdownOpened( state => !state ) }
                    className="z-20 flex items-center space-x-3 opacity-90 bg-black relative
                    cursor-pointer rounded-full border-[2px]
                    p-1 pr-2">
                    <img src={ session?.user.image } alt="" className="rounded-full w-10 h-10"/>
                    <h2 className='font-bold'>{ session?.user.name }</h2>
                    <ChevronDownIcon className="h-5 w-5"/>
                </div>

                <div className={ `flex justify-center items-end border-[1.5px] dropdown min-h-[75px] opacity-80 bg-black absolute top-[50%] p-5 rounded-b-full right-0 left-0
                    ${ !dropdownOpened && 'hidden' }` }>
                    <button className='space-x-2 justify-center
                    hover:text-white text-gray-300 text-sm' onClick={() => signOut()}>
                        <p className='font-bold'>Logout</p>
                    </button>
                </div>
            </header>

            <section className={ `flex items-end h-80 space-x-7 bg-gradient-to-b to-black ${ color } text-white p-8` }>
                {
                    !loadingData && selectedPlaylist && selectedPlaylist.images && selectedPlaylist.name
                        ? (
                            <>
                                <img className='h-28 w-28 md:h-44 md:w-44 shadow-2xl' src={ selectedPlaylist.images[0].url } alt="Playlist Cover" />
                                <div className="flex flex-col flex-wrap">
                                    <p className="text-sm font-semibold">PLAYLIST</p>
                                    <h1 className="text-[1.18rem] md:text-3xl xl:text-5xl font-bold pr-3 md:pr-0">{ selectedPlaylist.name }</h1>
                                </div>
                            </>
                        )
                        : <p className="text-lg">Loading...</p>
                }

            </section>

            {
                spotifyError && spotifyError !== ''
                    ?  (
                        <section className="my-3 mx-8 bg-red-700 px-4 py-1 font-md">
                            <p className='font-bold'>Connection Error: { spotifyError }</p>
                        </section>
                    )
                    : null
            }

            <div>
                <Songs />
            </div>

        </div>
    )
}

export default Center;