import { atom } from 'recoil';

export const allPlaylists = atom({
    key: 'allPlaylists',
    default: []
})

export const selectedPlaylistState = atom({
    key: 'selectedPlaylist',
    default: {}
})