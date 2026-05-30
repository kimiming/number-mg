"use client";
import React, { useRef, useState } from "react";

// 1. 定义 Props 的类型接口
interface AudioPlayerWithTimeProps {
  value: string; // 音频的 URL 地址
}

function AudioPlayerWithTime({ value }: AudioPlayerWithTimeProps) {
  // 2. 为 useRef 显式指定 HTMLAudioElement 类型，初始值为 null
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // 秒数格式化函数
  const formatTime = (time: number): string => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = (): void => {
    // 3. TypeScript 会提醒 audioRef.current 可能为 null，所以需要加个安全判断
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 4. 不需要显式写 React.SyntheticEvent，因为绑在原生标签上 TS 会自动推导，
  // 但如果要显式写，可以直接用内部属性，非常安全
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#333",
      }}
    >
      <audio
        ref={audioRef}
        src={value}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <button
        onClick={togglePlay}
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
          flexShrink: 0,
        }}
      >
        {isPlaying ? "⏸" : "▶"}
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
