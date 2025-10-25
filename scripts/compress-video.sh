#!/bin/bash

# Video Compression Script for AI FastScale LP
# This script compresses the Hero-VSL.mp4 from 48MB to ~10-15MB

echo "🎬 AI FastScale Video Compression Script"
echo "========================================"
echo ""

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed!"
    echo ""
    echo "Please install FFmpeg first:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Ubuntu:  sudo apt install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    echo ""
    exit 1
fi

echo "✓ FFmpeg found"
echo ""

INPUT="public/videos/Hero-VSL.mp4"
OUTPUT="public/videos/Hero-VSL-compressed.mp4"
BACKUP="public/videos/Hero-VSL-original.mp4"

# Check if input file exists
if [ ! -f "$INPUT" ]; then
    echo "❌ Input file not found: $INPUT"
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(du -h "$INPUT" | cut -f1)
echo "📊 Original file size: $ORIGINAL_SIZE"
echo ""

echo "🔄 Compressing video..."
echo "   This may take 2-5 minutes..."
echo ""

# Compress video
# -crf 28: Constant Rate Factor (18-28 is good quality, higher = smaller file)
# -preset medium: Balance between speed and compression
# -vf scale=1920:-2: Max width 1920px, maintain aspect ratio
# -movflags +faststart: Enable streaming/fast start
# -c:a aac -b:a 128k: Audio codec and bitrate

ffmpeg -i "$INPUT" \
  -vcodec libx264 \
  -crf 28 \
  -preset medium \
  -vf "scale=1920:-2" \
  -movflags +faststart \
  -c:a aac -b:a 128k \
  "$OUTPUT" \
  -y \
  -hide_banner \
  -loglevel warning \
  -stats

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Compression successful!"
    echo ""

    # Get new file size
    NEW_SIZE=$(du -h "$OUTPUT" | cut -f1)
    echo "📊 New file size: $NEW_SIZE"
    echo ""

    # Backup original and replace
    echo "💾 Backing up original to: $BACKUP"
    mv "$INPUT" "$BACKUP"

    echo "🔄 Replacing with compressed version..."
    mv "$OUTPUT" "$INPUT"

    echo ""
    echo "🎉 Done! Your video is now optimized."
    echo ""
    echo "Original backed up to: $BACKUP"
    echo "Compressed video at: $INPUT"
    echo ""
    echo "Test it: npm run dev"
else
    echo ""
    echo "❌ Compression failed!"
    echo "The original file was not modified."
    exit 1
fi
