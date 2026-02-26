#!/usr/bin/env bash
# Converts new .mov files in img/ to .mp4 (H.264, CRF 18) and archives originals to img/mov/
# Usage: ./bin/convert-movs.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG_DIR="$PROJECT_ROOT/img"
MOV_ARCHIVE="$IMG_DIR/mov"
PROJECTS_MD="$PROJECT_ROOT/projects.md"

mkdir -p "$MOV_ARCHIVE"

if ! command -v ffmpeg &>/dev/null; then
    echo "Error: ffmpeg not found. Install with: brew install ffmpeg"
    exit 1
fi

shopt -s nullglob
movfiles=("$IMG_DIR"/*.mov)

if [[ ${#movfiles[@]} -eq 0 ]]; then
    echo "No .mov files found in img/. Nothing to do."
    exit 0
fi

echo "Found ${#movfiles[@]} .mov file(s):"
echo ""

converted=0
skipped=0

for mov in "${movfiles[@]}"; do
    base="$(basename "$mov" .mov)"
    mp4="$IMG_DIR/$base.mp4"

    if [[ -f "$mp4" ]]; then
        echo "  skip  $base.mov  (${base}.mp4 already exists)"
        ((skipped++)) || true
    else
        echo "  converting  $base.mov -> $base.mp4"
        ffmpeg -i "$mov" -vcodec h264 -crf 18 -acodec aac "$mp4" -loglevel error
        echo "  done"
        ((converted++)) || true
    fi

    echo "  archiving  $base.mov -> img/mov/"
    mv "$mov" "$MOV_ARCHIVE/"

    # Update any references in projects.md from .mov to .mp4
    if grep -q "${base}.mov" "$PROJECTS_MD" 2>/dev/null; then
        sed -i '' "s|${base}\.mov|${base}.mp4|g" "$PROJECTS_MD"
        echo "  updated projects.md: ${base}.mov -> ${base}.mp4"
    fi
done

echo ""
echo "Converted: $converted  |  Skipped: $skipped"
echo ""
echo "Next: run /audit-assets to rename files to match the projects.md convention."
