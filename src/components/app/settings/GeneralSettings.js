import React, { useEffect, useState } from "react";
import "bulma-switch/dist/css/bulma-switch.min.css";
import {
  useUserStore,
  setTranscode,
} from "../../../common/UserContextProvider";

export default function GeneralSettings() {
  const transcode = useUserStore((state) => state.userState.transcode);
  const [transcodeQuality, setTranscodeQuality] = useState("");

  useEffect(() => {
    fetch("/api/systemSettings/transcodeQuality", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setTranscodeQuality(data));
  }, []);

  function handleSetTranscode(e) {
    setTranscode(e.target.checked);
  }

  return (
    <div>
      <section className={"section"}>
        <h1 className="title">Settings</h1>
        <h2 className="subtitle">General Settings</h2>
      </section>
      <section className="section">
        <form id="frmGeneralSettings" method="post" action="">
          <div className="field">
            <input
              type="checkbox"
              className="switch is-rounded"
              id="transcode"
              name="transcode"
              checked={transcode}
              onChange={(e) => handleSetTranscode(e)}
            />
            <label htmlFor="transcode">
              Transcode all tracks to mp3 v{transcodeQuality}
            </label>
          </div>
        </form>
      </section>
    </div>
  );
}
