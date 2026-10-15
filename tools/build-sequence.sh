#!/usr/bin/env bash
# Concatenates the maquette clips with short crossfades and exports WebP frame sequences at 1600 and 800 px.
set -euo pipefail
cd "$(dirname "$0")/.."
C=content/media/higgsfield/C
OUT=public/media/maquette/seq
FPS=${FPS:-8}
XF=0.6
CLIPS=(C1-volumes C2-materials C3-light)
[ -f "$C/C4-alive.mp4" ] && CLIPS+=(C4-alive)
INPUTS=(); for c in "${CLIPS[@]}"; do INPUTS+=(-i "$C/$c.mp4"); done
n=${#CLIPS[@]}
filter=""; prev="[0:v]"; offset=0
for ((i=1;i<n;i++)); do
  d=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$C/${CLIPS[$((i-1))]}.mp4")
  offset=$(python3 -I -c "print(round($offset + $d - $XF, 3))")
  out="[v$i]"; [ $i -eq $((n-1)) ] && out="[vout]"
  filter+="${prev}[$i:v]xfade=transition=fade:duration=$XF:offset=$offset$out;"
  prev="[v$i]"
done
filter=${filter%;}
ffmpeg -v error -y "${INPUTS[@]}" -filter_complex "$filter" -map "[vout]" -c:v libx264 -crf 18 -pix_fmt yuv420p "$C/maquette-sequence.mp4"
rm -rf "$OUT"; mkdir -p "$OUT/1600" "$OUT/800"
ffmpeg -v error -y -i "$C/maquette-sequence.mp4" -vf "fps=$FPS,scale=1600:-2" -c:v libwebp -quality 68 -compression_level 6 "$OUT/1600/f%03d.webp"
ffmpeg -v error -y -i "$C/maquette-sequence.mp4" -vf "fps=$FPS,scale=800:-2" -c:v libwebp -quality 70 -compression_level 6 "$OUT/800/f%03d.webp"
COUNT=$(ls "$OUT/1600" | wc -l)
LAST=$(printf "f%03d.webp" "$COUNT")
ffmpeg -v error -y -i "$OUT/1600/$LAST" -q:v 4 public/media/maquette-poster.jpg
printf '{ "count": %s, "fps": %s }\n' "$COUNT" "$FPS" > components/maquette/frames.json
echo "frames: $COUNT  size 1600: $(du -sh $OUT/1600 | cut -f1)  800: $(du -sh $OUT/800 | cut -f1)"
