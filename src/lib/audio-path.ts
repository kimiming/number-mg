export function toPlayableAudioPath(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('/api/uploads/')) {
    return trimmed;
  }

  if (trimmed.startsWith('/uploads/')) {
    return trimmed.replace('/uploads/', '/api/uploads/');
  }

  return trimmed;
}

export function getAudioFilename(value: string | null | undefined) {
  const path = toPlayableAudioPath(value);
  if (!path) {
    return '';
  }

  const withoutQuery = path.split('?')[0] ?? path;
  return withoutQuery.split('/').pop() ?? '';
}
