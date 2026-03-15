# Image Generation Models & LoRA Guide

## Our Current Setup

We use two models, both running via OpenVINO on CPU:

| Model | Backend | Steps | Speed | Quality | Best For |
|-------|---------|-------|-------|---------|----------|
| **SDXL-Turbo** | OpenVINO (FP16/INT8) | 4 | Fast (~15s) | Good | Quick drafts, iterative editing, educational images |
| **FLUX.1 Schnell** | OpenVINO (INT4) | 4 | Slower (~60s+) | Excellent | Final quality images, complex scenes |

### Optimizations Applied
- **Tiny Autoencoder (TAESDXL)** - Faster VAE decoding for SDXL-Turbo
- **INT8 Quantized UNet** - ~2x speedup with minimal quality loss (NNCF)
- **Image-to-Image pipeline** - Edit existing images with prompts

---

## The Multi-Finger / Bad Anatomy Problem

SDXL-Turbo generates in 1-4 steps (vs. 20-50 for full SDXL). This speed comes at a cost — fewer denoising steps means less time to resolve fine details like hands, fingers, and faces.

### What We've Already Done
1. **Increased default steps from 2 to 4** - Biggest single improvement
2. **Set native resolution (512x512)** - What SDXL-Turbo was trained on
3. **Improved negative prompts** - Anatomy-specific terms across all style profiles
4. **Quality prompt suffixes** - "masterpiece, best quality, high quality" etc.

### What LoRAs Can Do (Next Level)

LoRA (Low-Rank Adaptation) adds small trainable weight matrices on top of the base model. They can dramatically improve specific weaknesses without retraining the entire model.

---

## Recommended LoRAs for SDXL-Turbo

### Priority 1: Quality & Detail Enhancement

| LoRA | Source | What It Does | Recommended Strength |
|------|--------|-------------|---------------------|
| **Detail Tweaker XL** | [HuggingFace](https://huggingface.co/AiWise/Detail-Tweaker-XL_v1) / Civitai #122359 | Adds or reduces detail level. Positive weight = more detail, negative = less. | 1.0 - 1.5 |
| **SDXL Wrong LoRA** | [HuggingFace](https://huggingface.co/minimaxir/sdxl-wrong-lora) / Civitai #128708 | Use "wrong" as negative prompt. Improves textures, color, hand anatomy, reduces artifacts. | 0.7 - 1.0 |
| **Add More Details** | [HuggingFace](https://huggingface.co/LyliaEngine/add-detail-xl) | General detail enhancement for SDXL. | 0.5 - 1.0 |

### Priority 2: Hand & Finger Fixing

| LoRA | Source | What It Does | Recommended Strength |
|------|--------|-------------|---------------------|
| **ClearHandsXL v2** | Civitai #132884 | Fixes hands without affecting character/background. v2 is greatly improved. | 1.5 - 2.0 |
| **Hand Fine Tuning SDXL** | Civitai #278497 | Good across realistic, 2.5D, and anime styles. | 0.7 - 1.0 |
| **sd-hand-model-lora-sdxl** | [HuggingFace](https://huggingface.co/Gurusha/sd-hand-model-lora-sdxl) | HuggingFace-hosted hand fixer. | 0.5 - 1.0 |

### Priority 3: Face Quality

| LoRA | Source | What It Does | Recommended Strength |
|------|--------|-------------|---------------------|
| **Face Helper SDXL** | [HuggingFace](https://huggingface.co/ostris/face-helper-sdxl-lora) | Trained on 100k+ labeled faces. No trigger words needed. File: `face_xl_v0_1.safetensors` (224 MB). | 0.5 - 0.8 |
| **Better Faces Cultures SDXL** | Civitai #119376 | Realistic faces with natural skin, avoids over-smoothing. | 0.5 - 0.8 |

### Priority 4: Style-Specific

| LoRA | Source | What It Does | Strength |
|------|--------|-------------|----------|
| **Pixar Style** | [HuggingFace](https://huggingface.co/animte/pixar-sdxl-lora) | Pixar/3D cartoon rendering. | 0.6 - 0.8 |
| **Pixel Art SDXL** | Civitai #266711 | Pixel art style. Trigger: "pixel art" | 0.7 - 1.0 |
| **Eldritch LoRAs** | [HuggingFace](https://huggingface.co/EldritchAdam/SDXL_Eldritch_LoRAs) | Collection: Charcoal, Digital Art, Impressionism, Palette Knife, Wood Block Print. | 0.5 - 0.8 |

---

## Important: LoRA + SDXL-Turbo Compatibility

### What Works
- SDXL LoRAs are architecturally compatible with SDXL-Turbo (same UNet structure)
- LoRAs trained on base SDXL 1.0 can be applied at inference time
- Multiple LoRAs can be stacked simultaneously
- OpenVINO GenAI supports LoRA adapters in safetensors format

### Caveats
1. **Effects are muted** - Turbo uses 1-4 steps and low CFG (0-1), so LoRAs have fewer steps to influence output. You may need higher alpha/weight values than normal.
2. **Don't train LoRAs ON Turbo** - Training directly on distilled models (Turbo/Lightning/Hyper) causes output corruption. Always train on base SDXL, then apply to Turbo.
3. **CFG interaction** - SDXL-Turbo was trained with `guidance_scale=0`. LoRAs that rely heavily on negative prompts (like "Wrong LoRA") may have reduced effectiveness.
4. **Some LoRAs may produce unexpected results** - The distillation changes internal weight distributions.

### Recommendation
Start with **Detail Tweaker XL** (safe, well-tested) and **ClearHandsXL v2** (targeted fix). Test at higher strengths (1.5-2.0) since Turbo's few steps dampen LoRA effects.

---

## How to Use LoRAs with OpenVINO

OpenVINO GenAI supports LoRA adapters natively:

```python
import openvino_genai

# Set up adapter config
adapter_config = openvino_genai.AdapterConfig()

# Add LoRA(s) with alpha blending
detail_lora = openvino_genai.Adapter("loras/detail_tweaker_xl.safetensors")
hands_lora = openvino_genai.Adapter("loras/clearhandsxl_v2.safetensors")

adapter_config.add(detail_lora, alpha=1.5)
adapter_config.add(hands_lora, alpha=1.0)

# Create pipeline with adapters
pipe = openvino_genai.Text2ImagePipeline(
    "models/image_generation/sdxl-turbo-openvino",
    "CPU",
    adapters=adapter_config
)

# Generate
image = pipe.generate(
    "a child holding a flower, 3D cartoon style",
    width=512, height=512,
    num_inference_steps=4
)
```

### Key Points
- LoRA files must be in **safetensors** format
- Multiple LoRAs can be loaded simultaneously
- Alpha values control strength (higher = stronger effect)
- You can swap LoRAs per-generation without recompiling the base model
- Pass an empty `AdapterConfig()` to disable LoRAs for a specific generation

---

## Alternative: Using Diffusers Library (for non-OpenVINO pipelines)

```python
from diffusers import AutoPipelineForText2Image

pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo")

# Load LoRA
pipe.load_lora_weights("minimaxir/sdxl-wrong-lora", adapter_name="wrong")
pipe.load_lora_weights("AiWise/Detail-Tweaker-XL_v1", adapter_name="detail")

# Stack multiple LoRAs
pipe.set_adapters(["wrong", "detail"], adapter_weights=[0.8, 1.5])

# Generate
image = pipe("prompt here", negative_prompt="wrong", num_inference_steps=4).images[0]

# Optional: Fuse LoRA into model weights for faster inference
pipe.fuse_lora(adapter_names=["wrong", "detail"])
pipe.unload_lora_weights()  # Free adapter memory
```

---

## Model Comparison: When to Use What

### SDXL-Turbo (Our Fast Model)
- **Speed**: ~15s per image at 512x512
- **Quality**: Good with 4 steps + good negative prompts + LoRAs
- **Best for**: Rapid iteration, drafts, educational content, batch generation
- **Weakness**: Anatomy issues (hands/fingers), limited detail at low step counts
- **Tip**: Use img2img to refine — generate once, then edit with adjusted prompt

### FLUX.1 Schnell (Our Quality Model)
- **Speed**: ~60s+ per image
- **Quality**: Excellent, matches proprietary models
- **Best for**: Final images, complex compositions, marketing materials
- **Weakness**: Slower, no negative prompt support, larger model
- **Tip**: Already INT4 quantized, can't optimize much further

### Models Worth Watching (Future)
| Model | Why It's Interesting |
|-------|---------------------|
| **Z-Image-Turbo** | 6B params, sub-second on GPU, matches FLUX quality, Apache 2.0 |
| **FLUX.2 [klein]** | 4B-9B distilled FLUX, sub-second on consumer GPUs |
| **Qwen-Image-2512** | Best text rendering, unified generation + editing |

---

## Prompt Engineering Tips for Better Results

### Structure Your Prompts
```
[Subject], [Style keywords], [Quality keywords]
```

Example:
```
A flowering plant with roots stem and leaves,
3D cartoon style Pixar-like colorful,
masterpiece best quality high detail sharp focus
```

### Quality-Boosting Keywords
Add these to any prompt for better results:
- `masterpiece, best quality, high quality`
- `sharp focus, detailed`
- `professional, well-drawn`
- `8k, high resolution` (for realistic styles)

### Negative Prompt (Always Include)
```
deformed, distorted, blurry, extra fingers, mutated hands,
poorly drawn hands, poorly drawn face, bad anatomy,
bad proportions, extra limbs, disfigured, fused fingers,
too many fingers, six fingers, long neck, ugly,
low quality, worst quality
```

### Tips for Specific Subjects
- **People**: Avoid showing hands if possible. Use "hands behind back" or crop the subject.
- **Animals**: Generally safer than humans for anatomy.
- **Objects/Scenes**: SDXL-Turbo handles these well even at low steps.
- **Text in images**: SDXL-Turbo cannot render readable text. Use FLUX or Qwen-Image for that.

---

## Next Steps to Implement

### Phase 1: LoRA Integration (High Impact)
1. Download recommended LoRA safetensors files
2. Add LoRA loading to the OpenVINO pipeline in `image_service.py`
3. Allow users to toggle LoRAs on/off per generation

### Phase 2: Consider Model Upgrade
If quality remains insufficient, consider:
- **FLUX.2 [klein]** when it becomes available for OpenVINO — similar speed to SDXL-Turbo but much better quality
- **Z-Image-Turbo** — 6B params, sub-second inference, excellent quality, Apache 2.0 license
