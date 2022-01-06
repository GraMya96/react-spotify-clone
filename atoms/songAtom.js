import { atom } from 'recoil';

export const currentSongIdState = atom({
    key: 'currentSongId',
    default: ''
})

export const isPlayingState = atom({
    key: 'isPlaying',
    default: false
})