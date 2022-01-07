import useSpotify from '../hooks/useSpotify';
import { useSetRecoilState } from 'recoil';
import { millisToMinutesAndSeconds } from '../utils/milliseconds';
import { currentSongIdState, isPlayingState, isSpotifyConnectionError } from '../atoms/songAtom';

const Song = ({ song }) => {

    const spotifyApi = useSpotify();
    const setCurrentSongId = useSetRecoilState( currentSongIdState );
    const setIsPlaying = useSetRecoilState( isPlayingState );
    const setSpotifyError = useSetRecoilState( isSpotifyConnectionError );

    const playSong = id => {
        setCurrentSongId( id );
        setIsPlaying( true );
        spotifyApi.play({
            uris: [ song.track.uri ]
        }).catch( () => setSpotifyError( 'Please play a song from Spotify App using this device' ) );
    }

    return (
        <div
            onClick={ () => playSong( song.track.id ) }
            className="grid grid-cols-2 font-semibold text-gray-500 hover:bg-gray-900 rounded-lg py-3 px-4 cursor-pointer">
            <div className='flex items-center space-x-4'>
                <img
                    src={ song.track.album.images[0].url }
                    className="h-10 w-10"
                    alt="Song Cover" />
                <div>
                    <p className='truncate text-white w-45 lg:w-64'>{ song.track.name }</p>
                    <p>{ song.track.artists[0].name }</p>
                </div>
            </div>

            <div className="flex items-center justify-between lg-auto lg:ml-0">
                <p className="hidden lg:inline w-40 lg:w-60">{ song.track.album.name }</p>
                <p className="ml-auto lg:ml-0 text-right">{ millisToMinutesAndSeconds( song.track.duration_ms ) }</p>
            </div>
        </div>
    )
}

export default Song;