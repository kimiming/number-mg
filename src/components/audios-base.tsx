import React, { useRef, useState } from "react";

// 1. 定义 Props 的类型接口
interface CustomAudioPlayerProps {
  value: string; // 音频的 URL 地址
}

function CustomAudioPlayer({ value }: CustomAudioPlayerProps) {
  // 2. 为 useRef 显式指定 HTMLAudioElement 类型，初始值为 null
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlay = (): void => {
    // 3. 增加防御性代码：确保 ref 在当前 DOM 中已被挂载，防止 TS 报错
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ display: "inline-block" }}>
      {/* 隐藏原生的 audio 组件 */}
      <audio ref={audioRef} src={value} />

      {/* 自定义你的播放按钮 */}
      <button
        onClick={togglePlay}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
}

export default CustomAudioPlayer;
