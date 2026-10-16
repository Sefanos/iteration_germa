#!/usr/bin/env bash
# Usage: clip-check.sh <clip.mp4> <label> [reference.png]
# Six-frame contact sheet into pitch/v3/explore/, the final frame as a full-quality PNG for chaining,
# and a villa-box PSNR of the first frame against the reference (if given).
set -euo pipefail
cd "$(dirname "$0")/.."
f=$1; n=$2; ref=${3:-}
E=content/media/higgsfield/E
d=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$f")
inputs=""
for i in 0 1 2 3 4 5; do t=$(python3 -I -c "print(round($d*$i/5.4,2))"); ffmpeg -v error -y -ss $t -i "$f" -frames:v 1 -q:v 3 "$E/frames/$n-$i.jpg"; inputs="$inputs -i $E/frames/$n-$i.jpg"; done
ffmpeg -v error -y $inputs -filter_complex "[0][1][2][3][4][5]xstack=inputs=6:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0,scale=1920:-1" "pitch/v3/explore/$n-sheet.jpg"
ffmpeg -v error -y -sseof -0.05 -i "$f" -frames:v 1 "$E/$n-last.png"
echo "$n: $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$f") ${d}s, last frame $E/$n-last.png"
if [ -n "$ref" ]; then
  W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f"); H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f")
  echo -n "  first frame vs reference (full): "; ffmpeg -y -i "$E/frames/$n-0.jpg" -i "$ref" -lavfi "[1:v]scale=$W:$H[s];[0:v][s]psnr" -f null - 2>&1 | grep -o 'average:[0-9.]*'
fi
