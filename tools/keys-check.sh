#!/usr/bin/env bash
# Flip-book contact sheet of the keyframes plus a villa-region consistency check (PSNR of the villa box vs K6).
set -euo pipefail
cd "$(dirname "$0")/.."
K=content/media/higgsfield/K
T=/home/zeta/.claude-profiles/lite/jobs/eca9ae5a/tmp/keys
mkdir -p "$T" pitch/v3/keys
files=(); for k in K0 K1 K2 K3 K4 K5 K6 K7; do [ -f "$K/$k.png" ] && files+=("$K/$k.png"); done
n=${#files[@]}
inputs=(); for f in "${files[@]}"; do inputs+=(-i "$f"); done
# contact sheet, 4 per row
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf '[%d:v]scale=960:-1,setsar=1[s%d];' $i $i; done)$(for i in $(seq 0 $((n-1))); do printf '[s%d]' $i; done)concat=n=$n:v=1:a=0,tile=4x$(( (n+3)/4 ))" -frames:v 1 pitch/v3/keys/flipbook.jpg
# villa box (right half, upper middle) PSNR against K6, and horizon/sky box
for f in "${files[@]}"; do
  name=$(basename "$f" .png)
  v=$(ffmpeg -y -i "$f" -i "$K/K6.png" -lavfi "[0:v]crop=1200:620:1400:260[a];[1:v]crop=1200:620:1400:260[b];[a][b]psnr" -f null - 2>&1 | grep -o 'average:[0-9.inf]*' | sed 's/average://')
  s=$(ffmpeg -y -i "$f" -i "$K/K6.png" -lavfi "[0:v]crop=2688:420:0:0[a];[1:v]crop=2688:420:0:0[b];[a][b]psnr" -f null - 2>&1 | grep -o 'average:[0-9.inf]*' | sed 's/average://')
  echo "$name  villa-box PSNR vs K6: $v dB   sky+lake box: $s dB"
done
