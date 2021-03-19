import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { Link } from "react-router-dom";
import React from "react";
import { useAppStore, getTrackById } from "../../../common/AppContextProvider";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useUserStore } from "../../../common/UserContextProvider";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "components/utils";

const albumArtStyle = { height: "48px", margin: "0", paddingRight: "8px" };
// const trackStyle = {maxWidth: textWidth, maxHeight: '48px', overflow: 'auto'};
const artistAlbumTextStyle = { fontSize: ".875rem" };

export default function TrackDescription() {
  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
  const isWidthOver768 = useMediaQuery("(min-width: 768px)");

  function getSelectedTrack() {
    return tracks ? getTrackById(user.userState.selectedTrackId) : null;
  }

  const selectedTrack = getSelectedTrack();

  const artist = selectedTrack ? selectedTrack.artist : "";
  const albumArtist = selectedTrack ? selectedTrack.albumArtist : "";
  const album = selectedTrack ? selectedTrack.album : "";
  const title = selectedTrack ? selectedTrack.title : "";

  const textWidth = isWidthOver768 ? "calc(100vw - 408px)" : "100%";

  const imageUrl = getImageUrl(selectedTrack?.albumThumbnailId);

  // todo: does this need to be lazyload?
  const albumArt = (
    <img
      src={PLACEHOLDER_IMAGE_URL}
      data-src={imageUrl}
      alt="Placeholder"
      className="lazyload"
      style={albumArtStyle}
    />
  );

  return (
    <div className="level-item">
      {albumArt}
      <span
        id="track"
        style={{ maxWidth: textWidth, maxHeight: "48px", overflow: "auto" }}
      >
        <b>{title}</b>
        <br />
        <span id="artistAlbumText" style={artistAlbumTextStyle}>
          <Link to={"/artist/" + artist}>{artist}</Link>
          &nbsp;-&nbsp;
          <Link to={"/artist/" + albumArtist + "/album/" + album}>
            <i>{album}</i>
          </Link>
        </span>
      </span>
    </div>
  );
}
