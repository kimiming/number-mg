-- Add transcript cache for voice transcription
ALTER TABLE "PhoneRecord"
ADD COLUMN "transcriptText" TEXT;
