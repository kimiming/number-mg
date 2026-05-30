'use client';

import { Button, Typography, message } from 'antd';
import { useState } from 'react';
import { getAudioFilename } from '@/lib/audio-path';

type Props = {
  recordId: string;
  audioPath: string;
  initialTranscript?: string | null;
};

async function saveTranscript(recordId: string, transcriptText: string) {
  const response = await fetch(`/api/records/${recordId}/transcript`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcriptText })
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? '保存转写失败');
  }
}

export function VoiceTranscribe({ recordId, audioPath, initialTranscript }: Props) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(initialTranscript?.trim() ?? '');

  const buttonLabel = text ? '重新识别' : '语音转文字';

  const handleTranscribe = async () => {
    if (!audioPath) {
      message.error('没有可识别的音频文件');
      return;
    }

    setLoading(true);
    try {
      if (!text) {
        setText('正在识别语音，请稍候...');
      }

      const response = await fetch('/api/whisper-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: getAudioFilename(audioPath) })
      });

      const data = (await response.json().catch(() => ({}))) as { text?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? '识别失败');
      }

      const transcriptText = (data.text ?? '').trim();
      setText(transcriptText);

      if (transcriptText) {
        await saveTranscript(recordId, transcriptText);
        message.success('识别完成，已缓存');
      } else {
        message.warning('没有识别到文本');
      }
    } catch (error) {
      const messageText = error instanceof Error ? error.message : '识别失败';
      setText(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" onClick={handleTranscribe} loading={loading} disabled={!audioPath}>
        {loading ? '识别中...' : buttonLabel}
      </Button>
      <div
        style={{
          marginTop: 16,
          whiteSpace: 'pre-wrap',
          border: '1px solid rgba(15, 23, 42, 0.12)',
          borderRadius: 12,
          padding: 12,
          background: 'rgba(255,255,255,0.7)'
        }}
      >
        <Typography.Text type="secondary">识别结果</Typography.Text>
        <div style={{ marginTop: 8 }}>{text || '点击按钮开始识别。'}</div>
      </div>
    </div>
  );
}
