import os
from PIL import Image
from rembg import remove
import io

BASE = r"C:\Users\LG\Desktop\Projects\Offline AI Standalone"
SRC = os.path.join(BASE, "trophies")
DST = os.path.join(BASE, "trophies-processed")
os.makedirs(DST, exist_ok=True)

# Full mapping: filename_prefix -> (trophy_type, tier)
IMAGE_MAP = {
    "hvo1eohvo1eohvo1": ("lightning", "gold"),
    "17obnt17obnt17ob": ("compass", "gold"),
    "h6q1anh6q1anh6q1": ("chat-bubble", "gold"),
    "azfm6cazfm6cazfm": ("chat-bubble", "silver"),
    "19jjkf19jjkf19jj": ("chat-bubble", "bronze"),
    "qpqmxpqpqmxpqpqm": ("compass", "silver"),
    "g2ldytg2ldytg2ld": ("compass", "bronze"),
    "sq27r4sq27r4sq27": ("lightning", "silver"),
    "1fyapt1fyapt1fya": ("clipboard", "silver"),
    "xqre0xxqre0xxqre": ("clipboard", "bronze"),
    "dgrn8fdgrn8fdgrn": ("lightning", "bronze"),
    "7gw7dm7gw7dm7gw7": ("bar-chart", "silver"),
    "76yhjl76yhjl76yh": ("scale", "silver"),
    "a9dzpxa9dzpxa9dz": ("scale", "bronze"),
    "9iwcp89iwcp89iwc": ("bar-chart", "bronze"),
    "1z9jrr1z9jrr1z9j": ("quill", "silver"),
    "vjqb2qvjqb2qvjqb": ("scroll", "silver"),
    "z7psomz7psomz7ps": ("quill", "bronze"),
    "aw4508aw4508aw45": ("scroll", "bronze"),
    "78pt9678pt9678pt": ("milestone", "silver"),
    "37cah837cah837ca": ("mortarboard", "silver"),
    "740zs7740zs7740z": ("mortarboard", "bronze"),
    "1s6ret1s6ret1s6r": ("milestone", "bronze"),
    "jcebbqjcebbqjceb": ("brain", "gold"),
    "8jzdy48jzdy48jzd": ("flame", "gold"),
    "6x0as76x0as76x0a": ("brain", "silver"),
    "j0ska5j0ska5j0sk": ("flame", "silver"),
    "a5vrfsa5vrfsa5vr": ("brain", "bronze"),
    "9ldj0f9ldj0f9ldj": ("flame", "bronze"),
    "bvakeabvakeabvak": ("owl", "silver"),
    "ytk7spytk7spytk7": ("owl", "gold"),
    "wwtcdewwtcdewwtc": ("owl", "bronze"),
}

# Don't flip these types
NO_FLIP = {"chat-bubble", "quill"}

for fname in os.listdir(SRC):
    if not fname.endswith(".png"):
        continue
    # Extract the key from filename like Gemini_Generated_Image_XXXX.png
    key = fname.replace("Gemini_Generated_Image_", "").replace(".png", "")
    if key not in IMAGE_MAP:
        print(f"SKIP unknown: {fname}")
        continue
    
    trophy_type, tier = IMAGE_MAP[key]
    out_name = f"{trophy_type}_{tier}.webp"
    print(f"Processing {fname} -> {out_name} (type={trophy_type}, tier={tier})")
    
    # Read image
    with open(os.path.join(SRC, fname), "rb") as f:
        img_data = f.read()
    
    # Remove background
    result = remove(img_data)
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    
    # Flip horizontally (mirror) unless excluded
    if trophy_type not in NO_FLIP:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Compress to webp
    out_path = os.path.join(DST, out_name)
    img.save(out_path, "WEBP", quality=82, method=6)
    
    fsize = os.path.getsize(out_path) / 1024
    print(f"  -> {out_name} ({fsize:.1f} KB)")

print("\nDone! All processed.")
