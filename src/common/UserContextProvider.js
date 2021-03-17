import create from "zustand";

const baseUrl = "/api/users/";

export const useUserStore = create(() => ({
  user: null,
  selectedContextMenuId: null,
}));

export const setUser = (user) => useUserStore.setState({ user: user });

export const fetchUser = async () => {
  const response = await fetch("/api/users/current");
  useUserStore.setState({ user: await response.json() });
};
export const updateUser = async (url, formData) => {
  await fetch(baseUrl + url, { method: "PUT", body: formData });
  await fetchUser();
};

export const setSelectedPlaylistId = async (
  selectedPlaylistId,
  selectedTrackId
) => {
  const formData = new FormData();
  formData.append("selectedPlaylistId", selectedPlaylistId);
  formData.append("selectedTrackId", selectedTrackId);
  updateUser(useUserStore.getState().user.id + "/saveProgress", formData);
};
export const setSelectedTrackId = async (selectedTrackId) => {
  const formData = new FormData();
  formData.append(
    "selectedPlaylistId",
    useUserStore.getState().user.userState.selectedPlaylistId
  );
  formData.append("selectedTrackId", selectedTrackId);
  updateUser(useUserStore.getState().user.id + "/saveProgress", formData);
};

export const setMuted = async (muted) => {
  const formData = new FormData();
  formData.append("muted", muted);
  updateUser(useUserStore.getState().user.id, formData);
};
export const setShuffle = async (shuffle) => {
  const formData = new FormData();
  formData.append("shuffle", shuffle);
  updateUser(useUserStore.getState().user.id, formData);
};
export const setTranscode = async (transcode) => {
  const formData = new FormData();
  formData.append("transcode", transcode);
  updateUser(useUserStore.getState().user.id, formData);
};

export const setEq = async (eqNum, field, value) => {
  const formData = new FormData();
  formData.append("eqNum", eqNum);
  formData.append("field", field);
  formData.append("value", value);
  updateUser(useUserStore.getState().user.id + "/eq", formData);
};

export const setSelectedContextMenuId = (selectedContextMenuId) =>
  useUserStore.setState({ selectedContextMenuId: selectedContextMenuId });
