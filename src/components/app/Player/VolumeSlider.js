import React from "react";
import { useVolumeStore } from "../../../common/VolumeContextProvider";
import Slider, { createSliderWithTooltip } from "rc-slider/es";
import "rc-slider/assets/index.css";

const SliderWithTooltip = createSliderWithTooltip(Slider);

const volumeSliderStyle = { width: "120px" };
const sliderTrackStyle = { backgroundColor: "hsl(141, 71%, 48%)", height: 4 };
const sliderRailStyle = { backgroundColor: "#ddd" };
const sliderHandleStyle = { borderColor: "hsl(141, 71%, 48%)" };

export default function VolumeSlider() {
  const { volume, setVolume } = useVolumeStore((state) => ({
    volume: state.volume,
    setVolume: state.setVolume,
  }));

  return (
    <div style={volumeSliderStyle}>
      <SliderWithTooltip
        trackStyle={sliderTrackStyle}
        railStyle={sliderRailStyle}
        handleStyle={sliderHandleStyle}
        value={volume}
        min={-30}
        max={0}
        step={1}
        tipFormatter={(v) => `${v}dB`}
        onChange={setVolume}
      />
    </div>
  );
}
