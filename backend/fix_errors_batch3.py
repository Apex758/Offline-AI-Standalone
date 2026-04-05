with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

original = content

def r(old, new, label=''):
    global content
    if old in content:
        content = content.replace(old, new, 1)
    else:
        print(f'NOT FOUND [{label}]: {repr(old[:100])}')

# Line 6530: assign_model_tier
r(
    '        if set_tier_config(config):\n            return JSONResponse(content={"status": "ok", "model": model, "tier": tier})\n        return JSONResponse(status_code=500, content={"error": "Failed to save"})\n    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": str(e)})\n\n\n@app.put("/api/tier-config/dual-model")',
    '        if set_tier_config(config):\n            return JSONResponse(content={"status": "ok", "model": model, "tier": tier})\n        return JSONResponse(status_code=500, content={"error": "Failed to save"})\n    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})\n\n\n@app.put("/api/tier-config/dual-model")',
    '6530'
)

# Line 6548: update_dual_model_config
r(
    '        if set_tier_config(config):\n            return JSONResponse(content={"status": "ok", "dual_model": existing_dual})\n        return JSONResponse(status_code=500, content={"error": "Failed to save"})\n    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": str(e)})',
    '        if set_tier_config(config):\n            return JSONResponse(content={"status": "ok", "dual_model": existing_dual})\n        return JSONResponse(status_code=500, content={"error": "Failed to save"})\n    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})',
    '6548'
)

# Line 6665: vision analyze
r(
    '    except Exception as e:\n        logger.error(f"Vision analyze error: {e}")\n        return JSONResponse(status_code=500, content={"error": str(e)})',
    '    except Exception as e:\n        logger.error(f"Vision analyze error: {e}")\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})',
    '6665'
)

# Line 6784: select diffusion model
r(
    '    except Exception as e:\n        logger.error(f"Error selecting diffusion model: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error selecting diffusion model: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '6784'
)

# Line 6809: get_active_diffusion_model
r(
    '    except Exception as e:\n        logger.error(f"Error getting active diffusion model: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error getting active diffusion model: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '6809'
)

# Line 7270: execute-organize
r(
    '    except Exception as e:\n        logger.error(f"Error executing organize plan: {e}")\n        return JSONResponse(status_code=500, content={"error": str(e)})',
    '    except Exception as e:\n        logger.error(f"Error executing organize plan: {e}")\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})',
    '7270'
)

# Line 7296: undo-organize
r(
    '    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": str(e)})\n\n\n@app.post("/api/export")',
    '    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})\n\n\n@app.post("/api/export")',
    '7296'
)

# Line 7343: Export failed
r(
    'content={"error": f"Export failed: {str(e)}"}',
    'content={"error": "Export failed"}',
    '7343'
)

# Line 7456: generate_image_prompt
r(
    '    except Exception as e:\n        logger.error(f"Error generating image prompt: {e}", exc_info=True)\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error generating image prompt: {e}", exc_info=True)\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '7456'
)

# Line 7550: generate_comic_prompts
r(
    '    except Exception as e:\n        logger.error(f"Error generating comic prompts: {e}", exc_info=True)\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error generating comic prompts: {e}", exc_info=True)\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '7550'
)

# Line 7586: TTS
r(
    '    except Exception as e:\n        logger.error(f"TTS error: {e}", exc_info=True)\n        return JSONResponse(status_code=500, content={"error": str(e)})',
    '    except Exception as e:\n        logger.error(f"TTS error: {e}", exc_info=True)\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})',
    '7586'
)

# Line 7609: preload_tts
r(
    'return JSONResponse(status_code=500, content={"status": "error", "error": str(e)})',
    'return JSONResponse(status_code=500, content={"status": "error", "error": "An internal error occurred"})',
    '7609'
)

# Line 7620: tts_status
r(
    'return JSONResponse(content={"loaded": False, "error": str(e)})',
    'return JSONResponse(content={"loaded": False, "error": "Failed to check model status"})',
    '7620'
)

# Line 7647: tts_voices
r(
    '    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": str(e)})\n\n\n@app.post("/api/generate-image")',
    '    except Exception as e:\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})\n\n\n@app.post("/api/generate-image")',
    '7647'
)

# Line 7718: generate_image
r(
    '    except Exception as e:\n        logger.error(f"Error generating image: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )\n\n\n@app.post("/api/generate-image-base64")',
    '    except Exception as e:\n        logger.error(f"Error generating image: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )\n\n\n@app.post("/api/generate-image-base64")',
    '7718'
)

# Line 7800: generate_image_base64
r(
    '    except Exception as e:\n        logger.error(f"Error generating image: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )\n\n\n@app.post("/api/generate-batch-images-base64")',
    '    except Exception as e:\n        logger.error(f"Error generating image: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )\n\n\n@app.post("/api/generate-batch-images-base64")',
    '7800'
)

# Line 7892: generate_batch_images_base64
r(
    '    except Exception as e:\n        logger.error(f"Error generating batch images: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error generating batch images: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '7892'
)

# Line 7993: generate_image_from_seed
r(
    '    except Exception as e:\n        logger.error(f"Error generating image from seed: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error generating image from seed: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '7993'
)

# Line 8058: inpaint_image
r(
    '    except Exception as e:\n        logger.error(f"Error in inpainting: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )\n\n\n@app.post("/api/inpaint-base64")',
    '    except Exception as e:\n        logger.error(f"Error in inpainting: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )\n\n\n@app.post("/api/inpaint-base64")',
    '8058'
)

# Line 8125: Invalid image base64
r(
    'content={"error": f"Invalid image base64: {str(e)}"}',
    'content={"error": "Invalid image data"}',
    '8125'
)

# Line 8135: Invalid mask base64
r(
    'content={"error": f"Invalid mask base64: {str(e)}"}',
    'content={"error": "Invalid mask data"}',
    '8135'
)

# Line 8177: inpaint_image_base64 outer catch
r(
    '    except Exception as e:\n        logger.error(f"Error in inpainting: {e}")\n        import traceback\n        logger.error(f"Full traceback: {traceback.format_exc()}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error in inpainting: {e}")\n        import traceback\n        logger.error(f"Full traceback: {traceback.format_exc()}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '8177'
)

# Line 8227: remove_background_base64
r(
    '    except Exception as e:\n        logger.error(f"Background removal error: {e}")\n        return JSONResponse(status_code=500, content={"error": str(e)})',
    '    except Exception as e:\n        logger.error(f"Background removal error: {e}")\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})',
    '8227'
)

# Line 8259: get_image_service_status
r(
    '    except Exception as e:\n        logger.error(f"Error checking image service status: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error checking image service status: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '8259'
)

# Line 8276: preload_image_pipeline
r(
    '    except Exception as e:\n        logger.error(f"Error preloading image pipeline: {e}")\n        return JSONResponse(status_code=500, content={"error": str(e)})',
    '    except Exception as e:\n        logger.error(f"Error preloading image pipeline: {e}")\n        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})',
    '8276'
)

# Line 8319: start_iopaint_service
r(
    '    except Exception as e:\n        logger.error(f"Error starting IOPaint: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": str(e)}\n        )',
    '    except Exception as e:\n        logger.error(f"Error starting IOPaint: {e}")\n        return JSONResponse(\n            status_code=500,\n            content={"error": "An internal error occurred"}\n        )',
    '8319'
)

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Batch 3 done. Changed: {content != original}')
