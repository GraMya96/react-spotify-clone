import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    RssIcon
} from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { allPlaylists, selectedPlaylistState } from '../atoms/playlistAtom';

const Sidebar = () => {

    const { data: session, status } = useSession();
    const [ playlists, setPlaylists ] = useRecoilState( allPlaylists );
    const setSelectedPlaylist = useSetRecoilState( selectedPlaylistState );
    const spotifyApi = useSpotify();

    useEffect(() => {
        if( spotifyApi.getAccessToken() ) {
            spotifyApi.getUserPlaylists().then( data => {
                setPlaylists( data.body.items );
            } )
        }
    }, [ session, spotifyApi ])

    return (
        <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900
            space-y-4 overflow-y-scroll h-screen pb-36
            sm:max-w-[12rem] lg:max-w-[14rem] hidden md:block md:min-w-[13rem] scrollbar-hide'>

            <button className='flex items-center space-x-2
                hover:text-white'>
                <HomeIcon className='h-5 w-5'/>
                <p>Home</p>
            </button>
            <button className='flex items-center space-x-2
                hover:text-white'>
                <SearchIcon className='h-5 w-5'/>
                <p>Search</p>
            </button>
            <button className='flex items-center space-x-2
                hover:text-white'>
                <LibraryIcon className='h-5 w-5'/>
                <p>Your Library</p>
            </button>

            <hr className='border-t-[0.1px] border-gray-900'/>

            <button className='flex items-center space-x-2
                hover:text-white'>
                <PlusCircleIcon className='h-5 w-5'/>
                <p>Create Playlist</p>
            </button>
            <button className='flex items-center space-x-2
                hover:text-white'>
                <HeartIcon className='h-5 w-5 text-blue-500'/>
                <p>Liked Songs</p>
            </button>
            <button className='flex items-center space-x-2
                hover:text-white'>
                <RssIcon className='h-5 w-5 text-green-500'/>
                <p>Your episodes</p>
            </button>

            <hr className='border-t-[0.1px] border-gray-900'/>

            {/* Playlist */}
            { playlists.map( playlist => (
                <p key={ playlist.id }
                    className='cursor-pointer hover:text-white'
                    onClick={ () => { setSelectedPlaylist( playlist ) } }>
                    { playlist.name }
                </p>
            ) ) }

        </div>
    )
}

export default Sidebar;