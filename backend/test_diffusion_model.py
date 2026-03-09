"""
Quick test script for diffusion models.
Run from the backend folder:
  ..\backend\python-embed\python.exe test_diffusion_model.py [model_key]

Available model keys:
  sdxl-lightning   (works now, diffusers 0.27+)
  sdxl-lcm         (works now, diffusers 0.27+)
  flux-schnell     (needs diffusers >= 0.30)
  sd35-medium      (needs diffusers >= 0.31)
  sana-1600m       (needs diffusers >= 0.32)
"""
import sys
import os
from pathlib import Path

# Add backend to path and point MODELS_DIR at project models/
sys.path.insert(0, str(Path(__file__).parent))
os.environ['MODELS_DIR'] = str(Path(__file__).parent.parent / 'models')

model_key = sys.argv[1] if len(sys.argv) > 1 else "sdxl-lightning"
print(f"\n=== Testing Diffusion Model: {model_key} ===\n")

try:
    from image_service import ImageService
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure you've updated image_service.py with the multi-model version")
    sys.exit(1)

svc = ImageService(model_key=model_key)

print(f"Model path: {svc.model_path}")
print(f"Backend:    {svc.model_info.get('backend', 'unknown')}")
print(f"Exists:     {svc.model_path.exists()}")

if not svc.model_path.exists():
    print("\nERROR: Model folder not found. Check downloads are complete.")
    sys.exit(1)

print("\nGenerating test image (512x512)...")
print("This may take several minutes on CPU...\n")

img_bytes = svc.generate_image(
    prompt="A colorful cartoon parrot perched on a tropical branch, educational illustration, bright colors, simple style",
    negative_prompt="realistic, photograph, dark, complex background, text",
    width=512,
    height=512,
)

if img_bytes:
    out_file = f"test_output_{model_key.replace('-', '_')}.png"
    with open(out_file, 'wb') as f:
        f.write(img_bytes)
    print(f"\nSUCCESS! Image saved to: backend/{out_file}")
    print(f"Size: {len(img_bytes):,} bytes")
else:
    print("\nFAILED — check the error messages above.")
    print("\nCommon fixes:")
    print("  - FLUX/SD3.5/SANA: upgrade diffusers:")
    print("    backend/python-embed/python.exe -m pip install 'diffusers>=0.32.0' --upgrade")
    print("  - Model not fully downloaded: re-run download_models.py")
    sys.exit(1)
