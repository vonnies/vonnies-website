"""Maak foto's webklaar voor de Vonnies-site.

Gebruik:  python3 tools/optimaliseer_fotos.py pad/naar/foto.jpg snowboard-hotwax-werkplaats
Vereist:  pip install pillow
Resultaat: img/<naam>.webp (max 1400px, kwaliteit 76) + de afmetingen voor width/height.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    bron, naam = Path(sys.argv[1]), sys.argv[2].lower().replace(" ", "-")
    im = ImageOps.exif_transpose(Image.open(bron)).convert("RGB")
    im.thumbnail((1400, 1400), Image.LANCZOS)
    doel = Path(__file__).resolve().parent.parent / "img" / f"{naam}.webp"
    im.save(doel, "WEBP", quality=76, method=6)
    kb = doel.stat().st_size // 1024
    print(f"{doel.relative_to(doel.parent.parent)}  {im.width}x{im.height}  {kb} KB")
    print(f'<img src="img/{naam}.webp" width="{im.width}" height="{im.height}" alt="…" loading="lazy">')
    if kb > 250:
        print("Let op: groter dan 250 KB, overweeg kwaliteit 70.")

if __name__ == "__main__":
    main()
