#!/usr/bin/env python3
"""Refresh each app's page icon from its live App Store artwork.

  python3 scripts/refresh-icons.py            # download + write PNGs when the store art changed
  python3 scripts/refresh-icons.py --check    # compare repo files with the store art; exit 1 on drift
  python3 scripts/refresh-icons.py --live URL # compare the LIVE site (e.g. https://codecat.co.kr) with the store art

Needs Pillow (pip install pillow). Source of truth: iTunes lookup API, artworkUrl512.
To add an app: add one line to APPS.
"""
import io, json, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parent.parent
SIZE = 192
APPS = {  # App Store id -> repo paths that show the app icon
    "6834396044": ["sigol-jangteo/s/icon.png"],   # 오일장축제
    "6830167601": ["hyuyangrim/s/icon.png"],      # 열려라 숲
}
# share images (1200x630): the app icon sits in a fixed 200x200 box (x500,y139); only that box is replaced
OGS = {"6834396044": "sigol-jangteo/s/og.png", "6830167601": "hyuyangrim/s/og.png"}
OG_BOX, OG_R = (500, 139, 200, 200), 45
TOLERANCE = 2.0  # mean abs channel diff (0-255) allowed between page icon and store art


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "codecat-icons"}), timeout=30) as r:
        return r.read()


def store_icon(app_id):
    res = json.loads(get(f"https://itunes.apple.com/lookup?id={app_id}&country=kr"))["results"]
    if not res:
        raise SystemExit(f"no store result for id{app_id}")
    img = Image.open(io.BytesIO(get(res[0]["artworkUrl512"]))).convert("RGB")
    return res[0]["trackName"], img.resize((SIZE, SIZE), Image.LANCZOS)


def png_bytes(img):
    b = io.BytesIO(); img.save(b, "PNG", optimize=True); return b.getvalue()


def diff(a, b):
    a, b = a.convert("RGB").resize((SIZE, SIZE), Image.LANCZOS), b.convert("RGB")
    return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3


def og_mask():
    x = Image.new("L", (800, 800), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(x).rounded_rectangle((0, 0, 799, 799), radius=OG_R * 4, fill=255)
    return x.resize((OG_BOX[2], OG_BOX[3]), Image.LANCZOS)


def og_icon(img):
    return img.resize((OG_BOX[2], OG_BOX[3]), Image.LANCZOS)


def og_diff(og, img):
    """mean diff inside the icon box, 8 px in from the edge (skips the rounded-corner anti-aliasing)"""
    x, y, w, h = OG_BOX
    a = og.convert("RGB").crop((x + 8, y + 8, x + w - 8, y + h - 8))
    b = og_icon(img).crop((8, 8, w - 8, h - 8))
    return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    bad = changed = 0
    for app_id, paths in APPS.items():
        name, img = store_icon(app_id)
        for rel in paths:
            if mode == "--live":
                site = sys.argv[2].rstrip("/")
                cur = Image.open(io.BytesIO(get(f"{site}/{rel}?v={app_id}"))).convert("RGB")
                d = diff(cur, img)
                print(f"{'ok ' if d <= TOLERANCE else 'DIFF'} live {rel} vs store {name}: mean diff {d:.2f}")
                bad += d > TOLERANCE
                continue
            p = ROOT / rel
            d = diff(Image.open(p), img) if p.exists() else 999
            if d <= TOLERANCE:
                print(f"same {rel} ({name}) diff {d:.2f}"); continue
            if mode == "--check":
                print(f"DRIFT {rel} ({name}) diff {d:.2f}"); bad += 1; continue
            p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(png_bytes(img))
            print(f"wrote {rel} ({name}) was diff {d:.2f}"); changed += 1
        og = OGS.get(app_id)
        if og:
            site = sys.argv[2].rstrip("/") if mode == "--live" else None
            cur = Image.open(io.BytesIO(get(f"{site}/{og}?v={app_id}"))) if site else (Image.open(ROOT / og) if (ROOT / og).exists() else None)
            d = og_diff(cur, img) if cur else 999
            if d <= TOLERANCE:
                print(f"same {og} diff {d:.2f}")
            elif mode in ("--check", "--live"):
                print(f"DRIFT {og} diff {d:.2f}"); bad += 1
            else:
                base = cur.convert("RGB"); base.paste(og_icon(img), OG_BOX[:2], og_mask())
                (ROOT / og).write_bytes(png_bytes(base)); print(f"wrote {og} was diff {d:.2f}"); changed += 1
    sys.exit(1 if bad else 0)


main()
