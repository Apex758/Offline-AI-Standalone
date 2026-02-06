"""
IP-Adapter Reference Image Manager

Manages reference images for IP-Adapter style transfer to ensure consistent
visual style across generated images.
"""

import json
import random
from pathlib import Path
from typing import List, Dict, Optional
from PIL import Image
import logging

logger = logging.getLogger(__name__)


class IPAdapterManager:
    """Manages reference images for IP-Adapter style transfer"""
    
    def __init__(self, index_path: str = "backend/config/reference_images_index.json"):
        # Handle path relative to this file
        if not Path(index_path).is_absolute():
            base_dir = Path(__file__).parent
            self.index_path = base_dir / "config" / "reference_images_index.json"
            if not self.index_path.exists():
                self.index_path = Path(index_path)
        else:
            self.index_path = Path(index_path)
        
        self.reference_index = self._load_index()
        logger.info(f"IP-Adapter Manager initialized with index: {self.index_path}")
    
    def _load_index(self) -> Dict:
        """Load reference image index from JSON"""
        if not self.index_path.exists():
            logger.warning(f"Reference image index not found: {self.index_path}")
            return {}
        
        try:
            with open(self.index_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading reference index: {e}")
            return {}
    
    def get_references_for_style(
        self, 
        style_id: str, 
        tags: Optional[List[str]] = None,
        count: int = 1,
        random_selection: bool = True
    ) -> List[Path]:
        """
        Get reference image paths for a given style
        
        Args:
            style_id: Style profile ID (e.g., "cartoon_3d")
            tags: Filter by tags (e.g., ["science", "space"])
            count: Number of references to return
            random_selection: Randomly select from matches
        
        Returns:
            List of file paths to reference images
        """
        reference_set_key = f"{style_id}_references"
        reference_set = self.reference_index.get(reference_set_key, {})
        images = reference_set.get("images", [])
        
        logger.info(f"Looking for references: style={style_id}, tags={tags}, count={count}")
        logger.info(f"Found {len(images)} total images in reference set")
        
        # Filter by tags if provided
        filtered_images = images
        if tags and len(tags) > 0:
            filtered_images = [
                img for img in images 
                if any(tag in img.get("tags", []) for tag in tags)
            ]
            logger.info(f"After tag filtering: {len(filtered_images)} images")
        
        # If no tag matches, use all images from the set
        if len(filtered_images) == 0:
            logger.info("No tag matches, using all images from reference set")
            filtered_images = images
        
        # If still no images, return empty list
        if len(filtered_images) == 0:
            logger.warning(f"No reference images found for style {style_id}")
            return []
        
        # Select images
        if random_selection:
            selected = random.sample(filtered_images, min(count, len(filtered_images)))
        else:
            selected = filtered_images[:count]
        
        paths = [Path(img["path"]) for img in selected]
        logger.info(f"Selected {len(paths)} reference images: {[p.name for p in paths]}")
        return paths
    
    def load_reference_images(self, paths: List[Path]) -> List[Image.Image]:
        """
        Load PIL Images from paths
        
        Args:
            paths: List of file paths to load
        
        Returns:
            List of PIL Image objects
        """
        images = []
        for path in paths:
            if path.exists():
                try:
                    img = Image.open(path).convert("RGB")
                    images.append(img)
                    logger.info(f"Loaded reference image: {path}")
                except Exception as e:
                    logger.error(f"Error loading reference image {path}: {e}")
            else:
                logger.warning(f"Reference image not found: {path}")
        
        return images
    
    def add_reference_image(
        self,
        style_id: str,
        image_path: str,
        tags: List[str],
        description: str = ""
    ) -> bool:
        """
        Add a new reference image to the index
        
        Args:
            style_id: Style profile ID
            image_path: Path to the reference image
            tags: Tags for filtering
            description: Description of the reference
        
        Returns:
            True if successful
        """
        reference_set_key = f"{style_id}_references"
        
        # Ensure reference set exists
        if reference_set_key not in self.reference_index:
            self.reference_index[reference_set_key] = {
                "style_id": style_id,
                "description": f"Reference images for {style_id}",
                "images": []
            }
        
        # Generate image ID
        image_id = f"{style_id}_ref_{len(self.reference_index[reference_set_key]['images']) + 1:03d}"
        
        # Add image entry
        image_entry = {
            "id": image_id,
            "path": image_path,
            "tags": tags,
            "description": description
        }
        
        self.reference_index[reference_set_key]["images"].append(image_entry)
        
        # Save updated index
        try:
            with open(self.index_path, 'w', encoding='utf-8') as f:
                json.dump(self.reference_index, f, indent=2)
            logger.info(f"Added reference image: {image_id}")
            return True
        except Exception as e:
            logger.error(f"Error saving reference index: {e}")
            return False
    
    def get_reference_count(self, style_id: str) -> int:
        """Get count of reference images for a style"""
        reference_set_key = f"{style_id}_references"
        reference_set = self.reference_index.get(reference_set_key, {})
        return len(reference_set.get("images", []))
    
    def list_all_references(self) -> Dict[str, int]:
        """Get reference counts for all styles"""
        counts = {}
        for key, data in self.reference_index.items():
            if key.endswith("_references"):
                style_id = data.get("style_id", key.replace("_references", ""))
                counts[style_id] = len(data.get("images", []))
        return counts


# Singleton instance
_ip_adapter_manager_instance: Optional[IPAdapterManager] = None


def get_ip_adapter_manager() -> IPAdapterManager:
    """Get or create IPAdapterManager singleton"""
    global _ip_adapter_manager_instance
    
    if _ip_adapter_manager_instance is None:
        _ip_adapter_manager_instance = IPAdapterManager()
    
    return _ip_adapter_manager_instance
