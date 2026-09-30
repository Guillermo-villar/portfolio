"""Re-encodes the oversized images in public/.

Every project card and blog thumbnail is displayed at a few hundred pixels at
most, but several were shipping at 1024px and up to 220 KB. Nothing here is
displayed above 800px, so that is the cap; the sources are kept losslessly
identical in aspect ratio and only re-encoded, never cropped.

Safe to re-run: a re-encode is only kept when it saves at least MIN_SAVING of
the current file. Without that guard each run would lossily re-encode work the
previous run had already done, shaving a few percent and a little quality off
every pass.

Usage:  python tools/optimize_images.py
"""
from __future__ import annotations

import io
import pathlib

from PIL import Image

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"

# Keep a re-encode only if it saves at least this fraction of the file.
MIN_SAVING = 0.10

# filename -> longest edge in CSS pixels the site can ever show it at, doubled
# for high-DPI screens and rounded to something sensible.
TARGETS = {
    "AI.webp": 800,
    "Crypto.webp": 800,
    "TFG.jpeg": 800,
    "comin.webp": 800,
    "outp.webp": 800,
    "web.webp": 800,
    "solsombra-banner.webp": 1200,
    "solsombra-og.jpg": 1200,
    "sfsu.jpg": 300,
    "OpenAI.webp": 300,
}

# Left alone on purpose: ciberv.webp has an alpha channel and re-encoding it
# came out larger than the original, and icon.png is not referenced anywhere
# (the site loads icon.webp instead).


def main() -> None:
    total_before = 0
    total_after = 0

    for name, longest in TARGETS.items():
        path = PUBLIC / name
        if not path.exists():
            print(f"skip {name}: not present")
            continue

        before = path.stat().st_size
        with Image.open(path) as image:
            image.load()
            width, height = image.size
            if max(width, height) > longest:
                scale = longest / max(width, height)
                image = image.resize(
                    (round(width * scale), round(height * scale)), Image.LANCZOS
                )

            # Encode to a buffer first so a re-encode that saves nothing can be
            # thrown away rather than written over a perfectly good file.
            buffer = io.BytesIO()
            suffix = path.suffix.lower()
            if suffix == ".webp":
                image.save(buffer, "WEBP", quality=82, method=6)
            elif suffix in (".jpg", ".jpeg"):
                image.convert("RGB").save(
                    buffer, "JPEG", quality=82, optimize=True, progressive=True
                )
            else:
                image.save(buffer, "PNG", optimize=True)
            size = image.size

        candidate = buffer.getvalue()
        if len(candidate) <= before * (1 - MIN_SAVING):
            path.write_bytes(candidate)
            after = len(candidate)
            change = f"-{100 - after * 100 // before}%"
        else:
            after = before
            change = "kept (already optimal)"

        total_before += before
        total_after += after
        print(f"{name:24s} {before // 1024:>4} KB -> {after // 1024:>4} KB  {size} {change}")

    print(f"\ntotal {total_before // 1024} KB -> {total_after // 1024} KB")


if __name__ == "__main__":
    main()
