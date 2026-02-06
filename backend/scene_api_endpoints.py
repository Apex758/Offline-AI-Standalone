"""
Scene-Based Image Generation API Endpoints

These endpoints implement the image-first architecture where images are generated
from structured scene specifications.
"""

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import json
import base64
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

# Import scene system components
from scene_schema import SceneSchemaBuilder, SceneSpec, save_scene_spec_to_json
from ip_adapter_manager import get_ip_adapter_manager
from image_asset_store import get_image_asset_store
from image_service import get_image_service

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


@router.get("/api/topic-presets")
async def get_topic_presets():
    """
    Get all available topic presets
    
    Returns:
    {
        "topics": [
            {
                "topic_id": "science.grade4.solar_system",
                "display_name": "Solar System (Grade 4 Science)",
                "subject": "Science",
                "grade_band": "4",
                "preset_count": 3
            },
            ...
        ]
    }
    """
    try:
        builder = SceneSchemaBuilder()
        topics = builder.get_all_topics()
        
        return JSONResponse(content={
            "success": True,
            "topics": topics
        })
    except Exception as e:
        logger.error(f"Error getting topic presets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/topic-presets/{topic_id}")
async def get_topic_preset(topic_id: str):
    """
    Get presets for a specific topic
    
    Returns:
    {
        "topic_id": "science.grade4.solar_system",
        "display_name": "Solar System (Grade 4 Science)",
        "subject": "Science",
        "grade_band": "4",
        "strand": "Earth and Space Science",
        "image_presets": [...]
    }
    """
    try:
        builder = SceneSchemaBuilder()
        topic_data = builder.presets.get(topic_id)
        
        if not topic_data:
            raise HTTPException(status_code=404, detail=f"Topic {topic_id} not found")
        
        return JSONResponse(content=topic_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting topic preset: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/style-profiles")
async def get_style_profiles():
    """
    Get all available style profiles
    
    Returns:
    {
        "profiles": {
            "line_art_bw": {...},
            "cartoon_3d": {...},
            ...
        }
    }
    """
    try:
        # Try multiple paths
        base_dir = Path(__file__).parent
        profiles_path = base_dir / "config" / "style_profiles.json"
        
        if not profiles_path.exists():
            profiles_path = Path("backend/config/style_profiles.json")
        
        if not profiles_path.exists():
            logger.error(f"Style profiles not found. Tried: {profiles_path}")
            raise HTTPException(status_code=404, detail="Style profiles not found")
        
        with open(profiles_path, 'r', encoding='utf-8') as f:
            profiles = json.load(f)
        
        logger.info(f"✅ Loaded {len(profiles)} style profiles from {profiles_path}")
        
        return JSONResponse(content={
            "success": True,
            "profiles": profiles
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting style profiles: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/generate-scene-image")
async def generate_scene_image(request: Request):
    """
    Generate image from scene specification
    
    Request body:
    {
        "topic_id": "science.grade4.solar_system",
        "preset_id": "solar_system_overview",
        "style_profile_id": "cartoon_3d"
    }
    
    Returns:
    {
        "success": true,
        "imageData": "data:image/png;base64,...",
        "sceneSpec": {...},
        "assetId": "asset_...",
        "metadata": {...}
    }
    """
    try:
        data = await request.json()
        logger.info(f"Scene image generation request: {data}")
        
        topic_id = data.get("topic_id")
        preset_id = data.get("preset_id")
        style_profile_id = data.get("style_profile_id")
        
        if not all([topic_id, preset_id, style_profile_id]):
            raise HTTPException(
                status_code=400,
                detail="topic_id, preset_id, and style_profile_id are required"
            )
        
        # Build scene spec from preset
        builder = SceneSchemaBuilder()
        scene_spec = builder.build_scene_from_preset(
            topic_id=topic_id,
            preset_id=preset_id,
            style_profile_id=style_profile_id
        )
        
        logger.info(f"Built scene spec: {scene_spec.scene_id}")
        
        # Get the preset to access base_prompt
        preset = builder.get_preset(topic_id, preset_id)
        base_prompt = preset.get("base_prompt", "") if preset else ""
        
        # Load style profile
        base_dir = Path(__file__).parent
        profiles_path = base_dir / "config" / "style_profiles.json"
        if not profiles_path.exists():
            profiles_path = Path("backend/config/style_profiles.json")
        
        with open(profiles_path, 'r', encoding='utf-8') as f:
            style_profiles = json.load(f)
        
        style_profile = style_profiles.get(style_profile_id)
        if not style_profile:
            raise HTTPException(
                status_code=404,
                detail=f"Style profile {style_profile_id} not found"
            )
        
        # Get reference images for IP-Adapter (if available)
        ip_manager = get_ip_adapter_manager()
        ref_count = ip_manager.get_reference_count(style_profile_id)
        
        logger.info(f"Reference images available for {style_profile_id}: {ref_count}")
        
        # Build image prompt from scene spec using base_prompt from preset
        style_suffix = style_profile.get("base_prompt_suffix", "")
        prompt = builder.scene_to_prompt(scene_spec, style_suffix, base_prompt)
        
        logger.info(f"Generated prompt: {prompt[:100]}...")
        logger.info(f"Used base_prompt: {base_prompt[:100] if base_prompt else 'None (fallback to objects)'}")
        
        # Get SDXL settings from style profile
        settings = style_profile.get("sdxl_settings", {})
        negative_prompt = style_profile.get("negative_prompt", "")
        
        # Generate image
        image_service = get_image_service()
        image_bytes = image_service.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=settings.get("width", 512),
            height=settings.get("height", 512),
            num_inference_steps=settings.get("num_inference_steps", 4),
            guidance_scale=settings.get("guidance_scale", 0.0)
        )
        
        if not image_bytes:
            raise HTTPException(
                status_code=500,
                detail="Image generation failed"
            )
        
        logger.info(f"Image generated: {len(image_bytes)} bytes")
        
        # Store image asset with scene spec
        asset_store = get_image_asset_store()
        asset_id = asset_store.store_image(
            image_data=image_bytes,
            scene_spec=scene_spec.model_dump(),
            style_profile_id=style_profile_id,
            metadata={
                "topic_id": topic_id,
                "preset_id": preset_id,
                "prompt": prompt,
                "generated_at": datetime.now().isoformat()
            }
        )
        
        logger.info(f"Asset stored: {asset_id}")
        
        # Convert to base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        
        return JSONResponse(content={
            "success": True,
            "imageData": f"data:image/png;base64,{image_b64}",
            "sceneSpec": scene_spec.model_dump(),
            "assetId": asset_id,
            "metadata": {
                "topic_id": topic_id,
                "preset_id": preset_id,
                "style_profile_id": style_profile_id,
                "generated_at": datetime.now().isoformat()
            }
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating scene image: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/image-assets/{asset_id}")
async def get_image_asset(asset_id: str):
    """
    Retrieve an image asset by ID
    
    Returns:
    {
        "success": true,
        "asset": {
            "asset_id": "...",
            "imageData": "data:image/png;base64,...",
            "sceneSpec": {...},
            "style_profile_id": "...",
            "metadata": {...}
        }
    }
    """
    try:
        asset_store = get_image_asset_store()
        asset = asset_store.get_asset(asset_id)
        
        if not asset:
            raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
        
        # Load image data
        image_data = asset_store.get_image_data(asset_id)
        if image_data:
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            asset["imageData"] = f"data:image/png;base64,{image_b64}"
        
        return JSONResponse(content={
            "success": True,
            "asset": asset
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting image asset: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/image-assets/topic/{topic_id}")
async def get_assets_by_topic(topic_id: str):
    """
    Get all assets for a topic
    
    Returns:
    {
        "success": true,
        "assets": [...]
    }
    """
    try:
        asset_store = get_image_asset_store()
        assets = asset_store.find_assets_by_topic(topic_id)
        
        return JSONResponse(content={
            "success": True,
            "assets": assets,
            "count": len(assets)
        })
        
    except Exception as e:
        logger.error(f"Error getting assets by topic: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/image-assets/recent")
async def get_recent_assets(limit: int = 10):
    """
    Get recently generated assets
    
    Returns:
    {
        "success": true,
        "assets": [...]
    }
    """
    try:
        asset_store = get_image_asset_store()
        assets = asset_store.get_recent_assets(limit=limit)
        
        return JSONResponse(content={
            "success": True,
            "assets": assets,
            "count": len(assets)
        })
        
    except Exception as e:
        logger.error(f"Error getting recent assets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/image-assets/{asset_id}")
async def delete_image_asset(asset_id: str):
    """
    Delete an image asset
    
    Returns:
    {
        "success": true,
        "message": "Asset deleted"
    }
    """
    try:
        asset_store = get_image_asset_store()
        success = asset_store.delete_asset(asset_id)
        
        if not success:
            raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
        
        return JSONResponse(content={
            "success": True,
            "message": "Asset deleted"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting asset: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/scene-stats")
async def get_scene_stats():
    """
    Get statistics about scenes and assets
    
    Returns:
    {
        "success": true,
        "stats": {
            "total_assets": 10,
            "total_topics": 5,
            "reference_images": {...}
        }
    }
    """
    try:
        asset_store = get_image_asset_store()
        ip_manager = get_ip_adapter_manager()
        builder = SceneSchemaBuilder()
        
        return JSONResponse(content={
            "success": True,
            "stats": {
                "total_assets": asset_store.get_asset_count(),
                "total_topics": len(builder.presets),
                "reference_images": ip_manager.list_all_references()
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting scene stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
