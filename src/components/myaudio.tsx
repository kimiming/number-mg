"use client";

import React, { useRef, useState } from "react";
import { toPlayableAudioPath } from "@/lib/audio-path";

interface AudioPlayerWithTimeProps {
  value: string;
}

function AudioPlayerWithTime({ value }: AudioPlayerWithTimeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const src = toPlayableAudioPath(value);

  const formatTime = (time: number): string => {
    if (Number.isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = (): void => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = (): void => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = (): void => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  if (!src) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#333"
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <button
        onClick={togglePlay}
        type="button"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      <div>
        <span>{formatTime(currentTime)}</span>
        <span style={{ margin: "0 4px", color: "#999" }}>/</span>
        <span style={{ color: "#666" }}>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default AudioPlayerWithTime;
