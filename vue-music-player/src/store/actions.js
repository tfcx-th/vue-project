import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/util';
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache';

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 记录当前歌曲
  let currentSong = playlist[currentIndex];
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let findPlaylistIndex = findIndex(playlist, song);
  // 插入歌曲，索引加1
  currentIndex++;
  playlist.splice(currentIndex, 0, song);
  // 已包含就删除
  if (findPlaylistIndex > -1) {
    if (currentIndex > findPlaylistIndex) {
      playlist.splice(findPlaylistIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(findPlaylistIndex + 1, 1);
    }
  }

  let currentSequenceIndex = findIndex(sequenceList, currentSong) + 1;
  let findSequenceIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSequenceIndex, 0, song);
  if (findSequenceIndex > -1) {
    if (currentSequenceIndex > findSequenceIndex) {
      sequenceList.splice(findSequenceIndex, 1);
    } else {
      sequenceList.splice(findSequenceIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let playlistIndex = findIndex(playlist, song);
  playlist.splice(playlistIndex, 1);
  let sequenceListIndex = findIndex(sequenceList, song);
  sequenceList.splice(sequenceListIndex, 1);

  if (currentIndex > playlistIndex || currentIndex === playlist.length) {
    currentIndex--;
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false);
  } else {
    commit(types.SET_PLAYING_STATE, true);
  }
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  })
}