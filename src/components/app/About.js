import React from "react";
import { useAppStore } from "../../common/AppContextProvider";
import { useUserStore } from "../../common/UserContextProvider";

export default function About() {
  const tracks = useAppStore((state) => state.tracks);
  const user = useUserStore((state) => state.user);
  const getSelectedTrack = () =>
    tracks.find((track) => track.id === user.userState.selectedTrackId);

  const selectedTrack = getSelectedTrack();

  const selectedTrackInfoRows = selectedTrack
    ? Object.entries(selectedTrack).map((value) => (
        <tr key={value[0]}>
          <td>{value[0]}</td>
          <td>{value[1]}</td>
        </tr>
      ))
    : null;

  return (
    <section className={"section"}>
      <div className={"subtitle"}>Selected Track Info</div>
      <table className={"table is-narrow"}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{selectedTrackInfoRows}</tbody>
      </table>
    </section>
  );
}
