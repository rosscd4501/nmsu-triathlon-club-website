"""
Batch-resize and compress images for the website.

WHAT THIS DOES:
- Looks at every .jpg/.jpeg/.png in the "images" folder (next to this script)
- Shrinks anything wider than MAX_WIDTH down to MAX_WIDTH (keeping proportions)
- Re-saves JPEGs at JPEG_QUALITY to cut file size way down
- Leaves your originals untouched — writes results into a new "images_optimized" folder
- Prints a before/after size report so you can see the savings

HOW TO USE:
1. Put this script in the SAME folder as your "images" folder
   (i.e. your site folder, which contains index.html, images/, etc.)
2. Install Pillow once, if you don't have it:
       pip install pillow
   (on some systems: pip3 install pillow)
3. Run:
       python3 resize_images.py
4. Check the new "images_optimized" folder. If it looks good, rename your
   old "images" folder to "images_original" (as a backup) and rename
   "images_optimized" to "images", then re-upload to GitHub.

You can tweak MAX_WIDTH or JPEG_QUALITY below and re-run any time.
"""

import os
from pathlib import Path
from PIL import Image

SOURCE_DIR = Path(".")
OUTPUT_DIR = Path("images_optimized")

MAX_WIDTH = 900
JPEG_QUALITY = 80

VALID_EXTENSIONS = {".jpg", ".jpeg"}



def human_size(num_bytes):
    for unit in ["B", "KB", "MB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.0f}{unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f}GB"


def optimize_image(src_path: Path, dest_path: Path):
    img = Image.open(src_path)

    # Resize if wider than MAX_WIDTH
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        new_size = (MAX_WIDTH, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    ext = src_path.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        # Flatten transparency (just in case) and save compressed
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(dest_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
    else:  # png
        img.save(dest_path, "PNG", optimize=True)


def main():
    if not SOURCE_DIR.exists():
        print(f"Couldn't find an '{SOURCE_DIR}' folder next to this script. "
              f"Put this script in your site folder and try again.")
        return

    OUTPUT_DIR.mkdir(exist_ok=True)

    files = [
    f for f in SOURCE_DIR.rglob("*")
    if f.suffix.lower() in VALID_EXTENSIONS
    and f.parent != SOURCE_DIR
    and "images_optimized" not in f.parts
]
    if not files:
        print(f"No .jpg/.jpeg/.png files found in '{SOURCE_DIR}'.")
        return

    total_before = 0
    total_after = 0

    print(f"{'File':35} {'Before':>10} {'After':>10} {'Saved':>8}")
    print("-" * 66)

    for f in files:
        #dest = OUTPUT_DIR / f.name
        dest = OUTPUT_DIR / f.relative_to(SOURCE_DIR)
        dest.parent.mkdir(parents=True, exist_ok=True)
        before = f.stat().st_size
        optimize_image(f, dest)
        after = dest.stat().st_size
        total_before += before
        total_after += after
        saved_pct = 100 * (1 - after / before) if before else 0
        print(f"{f.name:35} {human_size(before):>10} {human_size(after):>10} {saved_pct:>7.0f}%")

    print("-" * 66)
    print(f"{'TOTAL':35} {human_size(total_before):>10} {human_size(total_after):>10} "
          f"{100 * (1 - total_after / total_before):>7.0f}%")
    print(f"\nDone. Optimized images are in '{OUTPUT_DIR}/'.")


if __name__ == "__main__":
    main()
