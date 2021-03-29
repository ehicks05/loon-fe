import _ from "lodash";
import create from "zustand";
import superFetch from "./SuperFetch";

const tracksBaseUrl = "/library/";
const playlistBaseUrl = "/playlists/";

export const useAppStore = create(() => ({
  tracks: null,
  playlists: null,
}));

export const useTrackMap = () => {
  return useAppStore((state) => _.keyBy(state.tracks, "id"));
};

export const useDistinctArtists = () => {
  return useAppStore((state) => _.uniq(_.map(state.tracks, "artist")));
};

export const fetchTracks = async () => {
  const response = await superFetch(tracksBaseUrl);
  useAppStore.setState({ tracks: await response.json() });
};

export const fetchPlaylists = async () => {
  const response = await superFetch(playlistBaseUrl + "getPlaylists");
  useAppStore.setState({ playlists: await response.json() });
};

export const upsertPlaylist = async (formData) => {
  await superFetch(playlistBaseUrl + "addOrModify", {
    method: "POST",
    body: formData,
  });
  fetchPlaylists();
};

export const toggleTracksInPlaylist = async (playlistId, formData) => {
  await superFetch(playlistBaseUrl + playlistId, {
    method: "POST",
    body: formData,
  });
  fetchPlaylists();
};

export const copyPlaylist = async (formData) => {
  const id = await superFetch(playlistBaseUrl + "copyFrom", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  fetchPlaylists();
  return id;
};

export const deletePlaylist = async (playlistId) => {
  await superFetch(playlistBaseUrl + playlistId, { method: "DELETE" });
  fetchPlaylists();
};

export const clearPlaylist = async (playlistId) => {
  const formData = new FormData();
  formData.append("mode", "");
  formData.append("replaceExisting", true);
  formData.append("trackIds", []);
  await superFetch(playlistBaseUrl + playlistId, {
    method: "POST",
    body: formData,
  });
  fetchPlaylists();
};

export const getTrackById = (id) => {
  return useAppStore.getState().tracks.find((t) => t.id === id);
};

export const getPlaylistById = (id) => {
  return useAppStore.getState().playlists.find((p) => p.id === id);
};

// Update indices locally for quick render, later backend will return authoritative results.
export const dragAndDrop = async (formData) => {
  const oldIndex = Number(formData.get("oldIndex"));
  const newIndex = Number(formData.get("newIndex"));
  const playlistId = Number(formData.get("playlistId"));

  const [playlist, playlists] = _.partition(
    useAppStore.getState().playlists,
    (p) => p.id === playlistId
  );

  const tracks = [...playlist.playlistTracks];
  const track = tracks[oldIndex];
  tracks.splice(oldIndex, 1);
  tracks.splice(newIndex, 0, track);
  tracks.forEach((track, i) => (track.index = i));

  playlist.playlistTracks = tracks;
  useAppStore.setState({ ...playlists, playlist });

  await superFetch(playlistBaseUrl + "dragAndDrop", {
    method: "POST",
    body: formData,
  });
  fetchPlaylists();
};
