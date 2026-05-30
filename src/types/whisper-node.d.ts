declare module "whisper-node" {
  type WhisperSegment = {
    start?: string;
    end?: string;
    speech?: string;
  };

  type WhisperOptions = {
    modelName?: string;
    modelPath?: string;
    whisperOptions?: {
      language?: string;
      task?: "transcribe" | "translate";
      gen_file_txt?: boolean;
      gen_file_subtitle?: boolean;
      gen_file_vtt?: boolean;
      word_timestamps?: boolean;
      timestamp_size?: number;
    };
    shellOptions?: Record<string, unknown>;
  };

  function whisper(filePath: string, options?: WhisperOptions): Promise<WhisperSegment[] | undefined>;

  export default whisper;
}
