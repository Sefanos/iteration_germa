#!/usr/bin/env bash
# Joins the construction clips (xfade) and the chained exploration clips (straight concat) into one sequence,
# exports WebP frames at 1280 and 800 px, and writes components/garden/frames.json with the chapter boundaries.
set -euo pipefail
cd "$(dirname "$0")/.."
C=content/media/higgsfield/C2
E=content/media/higgsfield/E
OUT=public/media/garden/seq
FPS=${FPS:-7}
XF=0.35
# construction film with crossfades
CLIPS=(T1-K0-K2-wan720 T2-K2-K4-wan720 T3-K4-K6-wan720)
INPUTS=(); for c in "${CLIPS[@]}"; do INPUTS+=(-i "$C/$c.mp4"); done
n=${#CLIPS[@]}; filter=""; prev="[0:v]"; offset=0
for ((i=1;i<n;i++)); do
  d=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$C/${CLIPS[$((i-1))]}.mp4")
  offset=$(python3 -I -c "print(round($offset + $d - $XF, 3))")
  out="[v$i]"; [ $i -eq $((n-1)) ] && out="[vout]"
  filter+="${prev}[$i:v]xfade=transition=fade:duration=$XF:offset=$offset$out;"; prev="[v$i]"
done
filter=${filter%;}
ffmpeg -v error -y "${INPUTS[@]}" -filter_complex "$filter" -map "[vout]" -c:v libx264 -crf 16 -pix_fmt yuv420p -r 24 "$C/garden-film.mp4"
# exploration clips, in order, when present (each starts on the previous one's last frame)
EXP=(E1-pool E2-terrace E3-hold E4-evening)
parts=(); ids=()
[ -f "$E/D-arrival.mp4" ] && parts+=("$E/D-arrival.mp4") && ids+=(arrival)
parts+=("$C/garden-film.mp4"); ids+=(film)
for e in "${EXP[@]}"; do [ -f "$E/$e.mp4" ] && parts+=("$E/$e.mp4") && ids+=("explore-${e#E?-}"); done
rm -rf "$OUT"; mkdir -p "$OUT/1280" "$OUT/800"
json='{ "fps": '"$FPS"', "chapters": ['; total=0; sep=""
for idx in "${!parts[@]}"; do
  p=${parts[$idx]}; id=${ids[$idx]}
  tmp=$(mktemp -d); mkdir -p "$tmp/a" "$tmp/b"
  ffmpeg -v error -y -i "$p" -vf "fps=$FPS,scale=1280:-2:flags=lanczos" -c:v libwebp -quality 56 -compression_level 6 "$tmp/a/f%03d.webp"
  ffmpeg -v error -y -i "$p" -vf "fps=$FPS,scale=800:-2:flags=lanczos" -c:v libwebp -quality 58 -compression_level 6 "$tmp/b/f%03d.webp"
  cnt=$(ls "$tmp/a" | wc -l)
  k=0; for f in $(ls "$tmp/a"); do k=$((k+1)); mv "$tmp/a/$f" "$OUT/1280/f$(printf %03d $((total+k))).webp"; mv "$tmp/b/$f" "$OUT/800/f$(printf %03d $((total+k))).webp"; done
  json+="$sep{ \"id\": \"$id\", \"start\": $total, \"end\": $((total+cnt-1)) }"; sep=", "
  total=$((total+cnt)); rm -rf "$tmp"
done
json+=' ], "count": '"$total"' }'
echo "$json" > components/garden/frames.json
echo "frames: $total  1280: $(du -sh $OUT/1280 | cut -f1)  800: $(du -sh $OUT/800 | cut -f1)"; cat components/garden/frames.json
