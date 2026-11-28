#!/usr/bin/env python3
"""Build the homepage hero cat poses (cats/hero/*.webp) from the cheese-cat family PNGs (11-13 set).

  python3 scripts/build-hero-poses.py [SRC_DIR]     # default: ~/codecat-hq/docs/design/cat-logo-family-20261114/p
Needs Pillow. Every pose is placed on the same 192x192 canvas, centred on its body and with its
lowest pixel on row 185 (the row side.png uses today), so all poses sit on the hero line with no layout jump.
No new drawing: only shift / scale / re-encode.
"""
import sys
from pathlib import Path
from PIL import Image

SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "codecat-hq/docs/design/cat-logo-family-20261114/p"
OUT = Path(__file__).resolve().parent.parent / "cats" / "hero"
BASE, N = 185, 192
# pose -> (file facing left, file facing right); same file twice = one drawing for both
POSES = {
    "front": ("front", "front"), "side": ("side", "side-r"), "sleep": ("sleep", "sleep-r"),
    "loaf": ("loaf-l", "loaf"), "back": ("walk", "walk"), "look": ("lookback-l", "lookback-r"),
}
# peek and face were dropped from the hero set (엄비 11-28): peek doubles the app-row cat, face is a 2x close-up


def place(name):
    im = Image.open(SRC / f"{name}.png").convert("RGBA")
    box = im.split()[3].point(lambda v: 255 if v > 24 else 0).getbbox()
    c = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    c.paste(im, (N // 2 - (box[0] + box[2]) // 2, BASE + 1 - box[3]), im)
    return c


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    made = {}
    for pose, (l, r) in POSES.items():
        for side, f in (("l", l), ("r", r)):
            if f in made:
                made[(pose, side)] = made[f]
                continue
            p = OUT / f"{pose}-{side}.webp"
            place(f).save(p, "WEBP", quality=82, method=6, alpha_quality=90)
            made[(pose, side)] = p
            print(p.name, p.stat().st_size)
        if l == r:  # symmetric: one file only
            (OUT / f"{pose}-r.webp").unlink(missing_ok=True)
    print("poses:", ",".join(POSES))


main()
