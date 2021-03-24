import create from "zustand";
import { devtools } from "zustand/middleware";
import _ from "lodash";

const baseUrl = "/api/users/";

export const useUserStore = create(
  devtools(() => ({
    user: null,
    userState: null,
    selectedContextMenuId: null,
  }))
);

export const setUser = (user) => useUserStore.setState({ user });
export const fetchUser = async () => {
  try {
    const response = await fetch("/me");
    useUserStore.setState({ user: await response.json() });
    await fetchUserState();
  } catch (err) {
    console.log("unable to load user");
  }
};

export const setUserState = (userState) => useUserStore.setState({ userState });
export const fetchUserState = async () => {
  try {
    const response = await fetch(baseUrl + "/currentUserState");
    useUserStore.setState({ userState: await response.json() });
  } catch (err) {
    console.log("unable to load userState");
  }
};

// helpers

const toFormData = (input) => {
  const formData = new FormData();
  Object.entries(input).forEach(([key, val]) => formData.append(key, val));
  return formData;
};

const debouncedVolumeFetch = _.debounce(fetch, 2000);
const debouncedFetchUserState = _.debounce(fetchUserState, 2000);

export const updateUser = async (url, data) => {
  Object.entries(data).forEach(([key, val]) =>
    setUserState({ ...useUserStore.getState().userState, [key]: val })
  );

  if (data.volume) {
    await debouncedVolumeFetch(baseUrl + url, {
      method: "PUT",
      body: toFormData(data),
    });
  } else await fetch(baseUrl + url, { method: "PUT", body: toFormData(data) });

  // debouncedFetchUserState();
};

export const setSelectedPlaylistId = async (
  selectedPlaylistId,
  selectedTrackId
) => {
  updateUser(useUserStore.getState().user.id + "/saveProgress", {
    selectedPlaylistId,
    selectedTrackId,
  });
};
export const setSelectedTrackId = async (selectedTrackId) => {
  updateUser(useUserStore.getState().user.id + "/saveProgress", {
    selectedPlaylistId: useUserStore.getState().userState.selectedPlaylistId,
    selectedTrackId,
  });
};

export const setMuted = async (muted) => {
  updateUser(useUserStore.getState().user.id, { muted });
};
export const setShuffle = async (shuffle) => {
  updateUser(useUserStore.getState().user.id, { shuffle });
};
export const setVolume = async (volume) => {
  updateUser(useUserStore.getState().user.id, { volume });
};
export const setTranscode = async (transcode) => {
  updateUser(useUserStore.getState().user.id, { transcode });
};

export const setEq = async (eqNum, field, value) => {
  updateUser(useUserStore.getState().user.id + "/eq", {
    eqNum,
    field,
    value,
  });
};

export const setSelectedContextMenuId = (selectedContextMenuId) =>
  useUserStore.setState({ selectedContextMenuId });
