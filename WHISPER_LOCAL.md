# /api/whisper-local 切换说明

## 现在的工作方式

- Next.js `POST /api/whisper-local` 继续保留。
- 接口只负责接收 `filename`，然后调用 `scripts/transcribe.py`。
- Python 脚本从 `public/uploads` 读取音频文件，使用 `faster-whisper` 返回转写文本。

## 需要的 Python 环境

- 安装 `faster-whisper`
- 本机需要可用的 `python`、`python3` 或 `py`
- 如果你的环境里 Python 不在默认命令路径，可以设置 `PYTHON_BIN`
- 还需要可用的 `ffmpeg`，否则很多音频格式无法解码

## 可选环境变量

- `PYTHON_BIN`: 指定 Python 可执行文件
- `WHISPER_MODEL_PATH`: 直接指定本地模型路径，优先级高于模型名
- `WHISPER_MODEL_SIZE`: 模型名，默认 `base`
- `WHISPER_LANGUAGE`: 语言，默认 `zh`
- `WHISPER_DEVICE`: 默认 `cpu`
- `WHISPER_COMPUTE_TYPE`: 默认 `int8`
- `WHISPER_BEAM_SIZE`: 默认 `5`
- `WHISPER_VAD_FILTER`: 默认 `true`

## 示例安装

```bash
pip install -r scripts/requirements.txt
```

## 说明

- 路由仍然只认 `filename`，不会接受任意文件路径。
- 音频文件必须先由上传接口保存到 `public/uploads`。
