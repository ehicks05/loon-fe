import { useAppStore, getTrackById } from "common/AppContextProvider";
import { useUserStore } from "common/UserContextProvider";
import { useEffect } from "react";

export default function Title() {
  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);

  useEffect(() => {
    const selectedTrack = getTrackById(user?.userState?.selectedTrackId);

    window.document.title = selectedTrack
      ? `${selectedTrack.title} by ${selectedTrack.artist}`
      : "Loon";
  }, [tracks, user?.userState?.selectedTrackId]);

  return null;
}
