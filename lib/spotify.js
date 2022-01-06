import SpotifyWebApi from 'spotify-web-api-node';

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'streaming',
    'user-read-private',
    'user-library-read',
    'user-top-read',
    // 'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-follow-read'
].join(',');

const params = {
    scope: scopes
}

const queryParamString = new URLSearchParams( params );

const LOGIN_URL = 'https://accounts.spotify.com/authorize?' + queryParamString.toString();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXTAUTH_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXTAUTH_PUBLIC_CLIENT_SECRET,
})

export { LOGIN_URL };

export default spotifyApi;
