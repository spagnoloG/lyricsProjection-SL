import playlistsApi from '../../services/playlistsApi'

export const namespaced = true

export const state = {
  playlists: [], // IDs(of lyrics), title and description
  currentPlaylist: {
    _id: 0,
    indexes: [],
    playlistName: '',
    playlistDescription: ''
  },
  totalPlaylists: 0
}

export const mutations = {
  add_new_playlist (state, playlist) {
    state.playlists.push(playlist)
  },
  set_playlist (state, playlist) {
    state.currentPlaylist._id = playlist._id
    state.currentPlaylist.indexes = playlist.indexes
    state.currentPlaylist.playlistName = playlist.playlistName
    state.currentPlaylist.playlistDescription = playlist.playlistDescription
  },
  set_playlists (state, playlists) {
    state.playlists = playlists
  },
  set_total_playlists (state, count) {
    state.totalPlaylists = count
  },
  delete_playlist (state, toDelete) {
    state.playlists.splice(toDelete, 1)
  },
  update_playlist (state, { toUpdate, playlist }) {
    state.playlists.splice(toUpdate, 1, playlist)
  }
}

export const actions = {
  addNewPlaylist ({ commit }, playlist) {
    return playlistsApi.postPlaylist(playlist)
      .then(response => {
        commit('add_new_playlist', playlist)
        return response
      })
      .catch(error => {
        return error
      })
  },
  //
  fetchPlaylist ({ commit }, playlistId) {
    return playlistsApi.getPlaylist(playlistId).then(response => {
      const data = response.data.playlist
      if (typeof data === 'undefined') {
        // Catch err
      } else {
        commit('set_playlist', data)
      }
      return data
    })
  },
  //
  fetchPlaylists ({ commit }) {
    return playlistsApi.getPlaylists()
      .then(response => {
        commit('set_playlists', response.data.playlists)
        commit('set_total_playlists', response.data.count)
      })
  },
  //
  deletePlaylist ({ commit }, playlistId) {
    // Find position of playlist in array by Id
    const foundPlaylist = state.playlists.find(playlist => playlist._id === playlistId)
    const toDelete = state.playlists.indexOf(foundPlaylist)
    if (toDelete === -1) {
      return // catch err
    }

    return playlistsApi.deletePlaylist(playlistId).then(response => {
      commit('delete_playlist', toDelete)
      return response
    })
  },
  //
  updatePlaylist ({ commit }, playlist) {
    // Find position of playlist in array by Id
    const playlistId = playlist._id
    const foundPlaylist = state.playlists.find(playlist => playlist._id === playlistId)
    const toUpdate = state.playlists.indexOf(foundPlaylist)
    if (toUpdate === -1) {
      return // catch err
    }

    return playlistsApi.updatePlaylist(playlist).then(response => {
      commit('update_playlist', {
        toUpdate,
        playlist
      })
      return response
    })
  }

}

export const getters = {
  getPlaylistById: state => _id => {
    return state.playlists.find(playlist => playlist._id === _id)
  },
  getAllPlaylists: state => {
    return state.playlists
  },
  getCurrentPlaylist: state => {
    return state.currentPlaylist
  }
}
