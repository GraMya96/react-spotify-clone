import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect, useState } from "react";
import { isPlayingState, currentSongIdState, isSpotifyConnectionError } from "../atoms/songAtom";
import { useSongInfo } from '../hooks/useSongInfo';
import { PauseIcon, SwitchHorizontalIcon, VolumeOffIcon } from '@heroicons/react/outline'
import { FastForwardIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon } from '@heroicons/react/solid'
import { debounce } from "lodash";


const Player = () => {

    const spotifyApi = useSpotify();
    const [ currentSongId, setCurrentSongId ] = useRecoilState( currentSongIdState );
    const [ isPlaying, setIsPlaying ] = useRecoilState( isPlayingState );
    const setSpotifyError = useSetRecoilState( isSpotifyConnectionError );
    const { data: session, status } = useSession();
    const [ volume, setVolume ] = useState(50);

    const songInfo = useSongInfo();

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then( data => {
            if( data.body?.is_playing ) {
                spotifyApi.pause()
                .catch( () => (
                    setSpotifyError( 'Please play a song from Spotify App using this device' )
                ) );

                setIsPlaying( false );
            }
            else {
                spotifyApi.play()
                .catch( () => (
                    setSpotifyError( 'Please play a song from Spotify App using this device' )
                ) );

                setIsPlaying( true );
            }
        } )
        .catch( error => console.error( error.message ) );
    }

    const fetchCurrentSong = () => {
        if( !songInfo ) {
            spotifyApi.getMyCurrentPlayingTrack().then( data => {
                setCurrentSongId( data.body?.item?.id );

                spotifyApi.getMyCurrentPlaybackState().then( data => {
                    setIsPlaying( data.body?.is_playing );
                } )
            } )
        }
    }

    const debouncedAdjustVolume =
        // Imported function from lodash.
        debounce( volume => {
            spotifyApi.setVolume( volume ).catch( error => console.log( error.message ) );
        }, 350)
    ;

    useEffect(() => {
        if( spotifyApi.getAccessToken() && !currentSongId ) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [ currentSongId, session, spotifyApi ])

    useEffect(() => {
        if( volume >= 0 && volume <= 100 ) {
            debouncedAdjustVolume( volume );
        }
    }, [ volume ])

    return (
        <div className={`pr-4 pl-4 border-t border-gray-700 sticky ${ songInfo ? 'bottom-0' : 'bottom-[-120%]' }
            transition-all duration-300 h-24 bg-gradient-to-b from-black to-gray-900 text-white
            grid grid-cols-2 sm:grid-cols-3 text-xs md:text-base px-2 md:px-8
            `}>

            {/* Left */}
            <div className="flex items-center space-x-0 md:space-x-4">
                <img
                    className="hidden md:inline h-10 w-10"
                    src={ songInfo?.album.images?.[0].url } alt="Song Cover" />

                    <div className="flex flex-col justify-between">
                        <h3 className="font-semibold">{ songInfo?.name }</h3>
                        <p className="text-sm">{ songInfo?.artists?.[0]?.name }</p>
                    </div>
            </div>


            {/* Center */}
            <div className="flex items-center justify-end sm:justify-center md:justify-evenly">
                <SwitchHorizontalIcon
                    className='button hidden md:inline' />
                <RewindIcon
                    className='button hidden md:inline' />

                {
                    isPlaying
                    ? (
                        <PauseIcon onClick={ handlePlayPause } className="button w-10 h-10"/>
                    )
                    : (
                        <PlayIcon onClick={ handlePlayPause } className="button w-10 h-10"/>
                    )

                }

                <FastForwardIcon
                    className='button hidden md:inline' />
                <ReplyIcon
                    className='button hidden md:inline' />
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3
                md:space-x-4 sm:justify-end justify-center
                col-start-1 col-end-3 sm:col-auto">
                {/* <VolumeDownIcon className='button' /> */}
                <VolumeOffIcon
                    className='button'
                    onClick={ () => setVolume( 0 ) } />
                <input
                    className='cursor-pointer w-14 md:w-28'
                    type="range"
                    min={ 0 }
                    value={ volume }
                    max={ 100 }
                    onChange={ e => setVolume( e.target.value ) } />
                <VolumeUpIcon
                    className='button'
                    onClick={ () => volume < 100 && setVolume( volume => volume + 15 ) } />
            </div>
        </div>
    )
}

export default Player;

