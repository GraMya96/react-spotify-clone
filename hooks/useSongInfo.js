import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentSongIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

export const useSongInfo = () => {

    const spotifyApi = useSpotify();
    const currentSongId = useRecoilValue( currentSongIdState );
    const [ songInfo, setSongInfo ] = useState(null);

    useEffect(() => {

        const fetchSongInfo = async () => {
            try {
                if( currentSongId ) {
                    const trackInfo = await fetch(
                       `https://api.spotify.com/v1/tracks/${ currentSongId }`,
                       {
                           headers: {
                               Authorization: `Bearer ${ spotifyApi.getAccessToken() }`
                           }
                       }

                    )

                    const data = await trackInfo.json();
                    setSongInfo( data );
                }

            }
            catch(error) {
                console.log( error.message );
            }
        }

        fetchSongInfo();
    }, [ currentSongId, spotifyApi ])

    return songInfo;
}
