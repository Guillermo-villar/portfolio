"""Generates the site's social-preview card and the PWA icons.

Two problems this solves:

* The site shipped no og:image at all, so every link shared to LinkedIn, Slack
  or WhatsApp rendered as a bare grey box. The card produced here is also used
  as the "Web Portfolio" project thumbnail, replacing a stock www globe.
* manifest.json declared G3.png as both a 192x192 and a 512x512 icon when the
  file is actually 571x369 and not even square, which every install prompt and
  auditing tool complains about. Real square icons are rendered at both sizes.

Usage:  python tools/make_images.py
"""
from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw, ImageFont

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"

# Pulled from the site's own stylesheets so the card cannot drift from the UI.
INK = (255, 255, 255)
MUTED = (170, 170, 170)
ACCENT = (255, 152, 0)
PANEL = (51, 51, 51)
BACKDROP = (26, 26, 26)

# Roboto Mono is the site's typeface; fall back through what Windows ships.
FONT_CANDIDATES = [
    "C:/Windows/Fonts/consola.ttf",
    "C:/Windows/Fonts/RobotoMono-Regular.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]
BOLD_CANDIDATES = [
    "C:/Windows/Fonts/consolab.ttf",
    "C:/Windows/Fonts/RobotoMono-Bold.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for path in BOLD_CANDIDATES if bold else FONT_CANDIDATES:
        if pathlib.Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


def rounded_panel(draw: ImageDraw.ImageDraw, box, radius: int, fill) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def make_og_image() -> None:
    """1200x630 - the size LinkedIn, X, Slack and iMessage all crop to."""
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), BACKDROP)
    draw = ImageDraw.Draw(image)

    # Soft accent wash in the corner, echoing the cards' radial gradient.
    glow = Image.new("RGB", (width, height), BACKDROP)
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-260, 250, 620, 1010), fill=(46, 38, 24))
    glow_draw.ellipse((760, -300, 1500, 420), fill=(38, 36, 44))
    image = Image.blend(image, glow, 0.85)
    draw = ImageDraw.Draw(image)

    margin = 72
    panel = (margin, margin, width - margin, height - margin)
    rounded_panel(draw, panel, 28, PANEL)

    x = margin + 56
    plate_left = width - margin - 260

    # Accent rule, the same device the section headings use.
    rule_y = margin + 56
    draw.rounded_rectangle((x, rule_y, x + 96, rule_y + 6), 3, fill=ACCENT)

    name_font = font(70, bold=True)
    role_font = font(32)
    tag_font = font(28)
    domain_font = font(30, bold=True)

    # Lay the block out top-down with explicit leading rather than magic
    # offsets, so nothing can land on top of anything else.
    cursor = rule_y + 34
    for line in ("Guillermo Villar", "Sánchez"):
        draw.text((x, cursor), line, font=name_font, fill=INK)
        cursor += 82

    cursor += 14
    draw.text((x, cursor), "Computer engineer · Madrid", font=role_font, fill=ACCENT)
    cursor += 48

    for line in ("Machine learning, cryptography and", "things that have to actually run."):
        draw.text((x, cursor), line, font=tag_font, fill=MUTED)
        cursor += 38

    domain_y = panel[3] - 56 - 30
    draw.text((x, domain_y), "g-villar.tech", font=domain_font, fill=INK)

    # The text block must clear the footer line and the monogram plate.
    assert cursor <= domain_y, f"text block overruns the domain line ({cursor} > {domain_y})"
    widest = max(
        draw.textbbox((x, 0), "Guillermo Villar", font=name_font)[2],
        draw.textbbox((x, 0), "Machine learning, cryptography and", font=tag_font)[2],
    )
    assert widest < plate_left - 24, f"text runs into the monogram plate ({widest})"

    # Monogram plate on the right, mirroring the header's initials treatment.
    plate = (plate_left, margin + 132, width - margin - 60, margin + 332)
    rounded_panel(draw, plate, 24, (26, 26, 26))
    draw.rounded_rectangle(plate, radius=24, outline=(70, 70, 70), width=2)
    monogram = font(96, bold=True)
    box = draw.textbbox((0, 0), "GV", font=monogram)
    draw.text(
        (
            plate[0] + (plate[2] - plate[0] - (box[2] - box[0])) / 2 - box[0],
            plate[1] + (plate[3] - plate[1] - (box[3] - box[1])) / 2 - box[1],
        ),
        "GV",
        font=monogram,
        fill=ACCENT,
    )

    out = PUBLIC / "og-image.png"
    image.save(out, "PNG", optimize=True)
    print(f"wrote {out.name} ({out.stat().st_size // 1024} KB, {width}x{height})")


def make_icons() -> None:
    """Square PWA icons at the sizes manifest.json actually claims."""
    for size in (192, 512):
        image = Image.new("RGB", (size, size), BACKDROP)
        draw = ImageDraw.Draw(image)
        pad = round(size * 0.09)
        rounded_panel(draw, (pad, pad, size - pad, size - pad), round(size * 0.16), PANEL)

        glyph = font(round(size * 0.42), bold=True)
        box = draw.textbbox((0, 0), "GV", font=glyph)
        draw.text(
            (
                (size - (box[2] - box[0])) / 2 - box[0],
                (size - (box[3] - box[1])) / 2 - box[1],
            ),
            "GV",
            font=glyph,
            fill=ACCENT,
        )
        out = PUBLIC / f"icon-{size}.png"
        image.save(out, "PNG", optimize=True)
        print(f"wrote {out.name} ({out.stat().st_size // 1024} KB, {size}x{size})")


if __name__ == "__main__":
    make_og_image()
    make_icons()
