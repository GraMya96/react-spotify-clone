import { useRecoilValue } from 'recoil';
import { selectedPlaylistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import { useState, useEffect } from 'react';
import Song from './song';

const Songs = () => {

    const playlist = useRecoilValue( selectedPlaylistState );
    const spotifyApi = useSpotify();
    const [ playlistTracks, setPlaylistTracks ] = useState([]);

    useEffect(() => {
        if( spotifyApi.getAccessToken() && playlist && playlist.id ) {
            spotifyApi.getPlaylist( playlist.id ).then( data => {
                setPlaylistTracks( data.body.tracks.items );
            } )
        }
    }, [ playlist, spotifyApi ])

    return (
        <div className='text-white p-7 pt-4 text-[.93rem] lg:text-[1rem]'>
            { playlistTracks.map( ( song, i ) => (
                <Song
                    key={ song.track.id }
                    song={ song }
                    order={ i }
                />
            ) ) }
        </div>
    )
}

export default Songs;