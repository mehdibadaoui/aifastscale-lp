#!/bin/bash

# Favicon Generation Script for AI FastScale LP
# This script converts icon.svg to favicon.ico and apple-touch-icon.png

echo "🎨 AI FastScale Favicon Generation Script"
echo "=========================================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed!"
    echo ""
    echo "Option 1 - Install ImageMagick:"
    echo "  macOS:   brew install imagemagick"
    echo "  Ubuntu:  sudo apt install imagemagick"
    echo ""
    echo "Option 2 - Use online tool (recommended for beginners):"
    echo "  1. Go to: https://realfavicongenerator.net/"
    echo "  2. Upload: public/icon.svg"
    echo "  3. Download the generated package"
    echo "  4. Extract favicon.ico and apple-touch-icon.png to public/"
    echo ""
    exit 1
fi

echo "✓ ImageMagick found"
echo ""

INPUT="public/icon.svg"
FAVICON="public/favicon.ico"
APPLE_ICON="public/apple-touch-icon.png"

# Check if input file exists
if [ ! -f "$INPUT" ]; then
    echo "❌ Input file not found: $INPUT"
    exit 1
fi

echo "🔄 Generating favicon.ico (multi-size)..."
convert "$INPUT" -define icon:auto-resize=256,128,64,48,32,16 "$FAVICON"

if [ $? -eq 0 ]; then
    echo "✅ favicon.ico created"
else
    echo "❌ Failed to create favicon.ico"
    exit 1
fi

echo ""
echo "🔄 Generating apple-touch-icon.png (180x180)..."
convert "$INPUT" -resize 180x180 "$APPLE_ICON"

if [ $? -eq 0 ]; then
    echo "✅ apple-touch-icon.png created"
else
    echo "❌ Failed to create apple-touch-icon.png"
    exit 1
fi

echo ""
echo "🎉 Done! Favicons generated successfully."
echo ""
echo "Created files:"
echo "  - $FAVICON"
echo "  - $APPLE_ICON"
echo ""
echo "Test it: npm run dev and check your browser tab"
