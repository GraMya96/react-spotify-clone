import { atom } from 'recoil';

export const currentSongIdState = atom({
    key: 'currentSongId',
    default: ''
})

export const isPlayingState = atom({
    key: 'isPlaying',
    default: false
})

export const isSpotifyConnectionError = atom({
    key: 'spotifyError',
    default: ''
})