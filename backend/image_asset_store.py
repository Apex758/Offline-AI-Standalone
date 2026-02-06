"""
Image Asset Store - Persistent storage for generated images and their metadata

This module manages the storage and retrieval of generated images along with
their scene specifications, enabling image reuse across multiple worksheets.
"""

import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List
import logging

logger = logging.getLogger(__name__)


class ImageAsset:
    """Represents a stored image with its metadata"""
    
    def __init__(
        self,
        asset_id: str,
        image_path: Path,
        scene_spec: Dict,
        style_profile_id: str,
        metadata: Dict
    ):
        self.asset_id = asset_id
        self.image_path = image_path
        self.scene_spec = scene_spec
        self.style_profile_id = style_profile_id
        self.metadata = metadata
        self.created_at = metadata.get('created_at', datetime.now().isoformat())
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            'asset_id': self.asset_id,
            'image_path': str(self.image_path),
            'scene_spec': self.scene_spec,
            'style_profile_id': self.style_profile_id,
            'metadata': self.metadata,
            'created_at': self.created_at
        }


class ImageAssetStore:
    """Manages persistent storage of generated images and their metadata"""
    
    def __init__(self, store_dir: str = "backend/data/image_assets"):
        self.store_dir = Path(store_dir)
        self.store_dir.mkdir(parents=True, exist_ok=True)
        self.index_file = self.store_dir / "index.json"
        self.index = self._load_index()
        logger.info(f"Image Asset Store initialized at: {self.store_dir}")
    
    def _load_index(self) -> Dict:
        """Load asset index from JSON"""
        if not self.index_file.exists():
            logger.info("Creating new asset index")
            return {}
        
        try:
            with open(self.index_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading asset index: {e}")
            return {}
    
    def _save_index(self):
        """Save asset index to JSON"""
        try:
            with open(self.index_file, 'w', encoding='utf-8') as f:
                json.dump(self.index, f, indent=2)
            logger.info(f"Asset index saved ({len(self.index)} assets)")
        except Exception as e:
            logger.error(f"Error saving asset index: {e}")
    
    def store_image(
        self,
        image_data: bytes,
        scene_spec: Dict,
        style_profile_id: str,
        metadata: Optional[Dict] = None
    ) -> str:
        """
        Store image with its scene specification and metadata
        
        Args:
            image_data: PNG image bytes
            scene_spec: Scene specification dictionary
            style_profile_id: Style profile used
            metadata: Optional additional metadata
        
        Returns:
            asset_id: Unique identifier for the stored asset
        """
        # Generate asset ID from content hash and timestamp
        content_hash = hashlib.sha256(image_data).hexdigest()[:16]
        timestamp = int(datetime.now().timestamp())
        asset_id = f"asset_{content_hash}_{timestamp}"
        
        # Save image file
        image_path = self.store_dir / f"{asset_id}.png"
        try:
            with open(image_path, 'wb') as f:
                f.write(image_data)
            logger.info(f"Stored image: {image_path} ({len(image_data)} bytes)")
        except Exception as e:
            logger.error(f"Error storing image: {e}")
            raise
        
        # Prepare metadata
        if metadata is None:
            metadata = {}
        
        metadata['created_at'] = datetime.now().isoformat()
        metadata['image_size_bytes'] = len(image_data)
        
        # Save asset metadata to index
        asset_metadata = {
            "asset_id": asset_id,
            "image_path": str(image_path),
            "scene_spec": scene_spec,
            "style_profile_id": style_profile_id,
            "metadata": metadata,
            "created_at": metadata['created_at']
        }
        
        self.index[asset_id] = asset_metadata
        self._save_index()
        
        logger.info(f"Asset stored: {asset_id}")
        return asset_id
    
    def get_asset(self, asset_id: str) -> Optional[Dict]:
        """
        Retrieve asset metadata
        
        Args:
            asset_id: Asset identifier
        
        Returns:
            Asset metadata dictionary or None if not found
        """
        asset = self.index.get(asset_id)
        if asset:
            logger.info(f"Retrieved asset: {asset_id}")
        else:
            logger.warning(f"Asset not found: {asset_id}")
        return asset
    
    def get_image_data(self, asset_id: str) -> Optional[bytes]:
        """
        Get image bytes for an asset
        
        Args:
            asset_id: Asset identifier
        
        Returns:
            Image bytes or None if not found
        """
        asset = self.get_asset(asset_id)
        if not asset:
            return None
        
        image_path = Path(asset["image_path"])
        if not image_path.exists():
            logger.error(f"Image file not found: {image_path}")
            return None
        
        try:
            with open(image_path, 'rb') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error reading image file: {e}")
            return None
    
    def find_assets_by_topic(self, topic_id: str) -> List[Dict]:
        """
        Find all assets for a given topic
        
        Args:
            topic_id: Topic identifier (e.g., "science.grade4.solar_system")
        
        Returns:
            List of asset metadata dictionaries
        """
        matching_assets = [
            asset for asset in self.index.values()
            if asset.get("scene_spec", {}).get("topic_id") == topic_id
        ]
        logger.info(f"Found {len(matching_assets)} assets for topic: {topic_id}")
        return matching_assets
    
    def find_assets_by_scene_preset(self, preset_id: str) -> List[Dict]:
        """
        Find all assets generated from a specific preset
        
        Args:
            preset_id: Image preset identifier
        
        Returns:
            List of asset metadata dictionaries
        """
        matching_assets = [
            asset for asset in self.index.values()
            if asset.get("scene_spec", {}).get("image_preset_id") == preset_id
        ]
        logger.info(f"Found {len(matching_assets)} assets for preset: {preset_id}")
        return matching_assets
    
    def get_image_path(self, asset_id: str) -> Optional[Path]:
        """
        Get file path for an asset's image
        
        Args:
            asset_id: Asset identifier
        
        Returns:
            Path to image file or None if not found
        """
        asset = self.get_asset(asset_id)
        if asset:
            return Path(asset["image_path"])
        return None
    
    def delete_asset(self, asset_id: str) -> bool:
        """
        Delete an asset and its image file
        
        Args:
            asset_id: Asset identifier
        
        Returns:
            True if successful, False otherwise
        """
        asset = self.get_asset(asset_id)
        if not asset:
            return False
        
        # Delete image file
        image_path = Path(asset["image_path"])
        if image_path.exists():
            try:
                image_path.unlink()
                logger.info(f"Deleted image file: {image_path}")
            except Exception as e:
                logger.error(f"Error deleting image file: {e}")
                return False
        
        # Remove from index
        del self.index[asset_id]
        self._save_index()
        
        logger.info(f"Deleted asset: {asset_id}")
        return True
    
    def get_asset_count(self) -> int:
        """Get total number of stored assets"""
        return len(self.index)
    
    def get_recent_assets(self, limit: int = 10) -> List[Dict]:
        """
        Get most recently created assets
        
        Args:
            limit: Maximum number of assets to return
        
        Returns:
            List of asset metadata dictionaries
        """
        assets = sorted(
            self.index.values(),
            key=lambda x: x.get('created_at', ''),
            reverse=True
        )
        return assets[:limit]
    
    def cleanup_orphaned_images(self) -> int:
        """
        Remove image files that are not in the index
        
        Returns:
            Number of orphaned files removed
        """
        indexed_paths = {Path(asset["image_path"]) for asset in self.index.values()}
        orphaned_count = 0
        
        for image_file in self.store_dir.glob("*.png"):
            if image_file not in indexed_paths and image_file != self.index_file:
                try:
                    image_file.unlink()
                    orphaned_count += 1
                    logger.info(f"Removed orphaned image: {image_file}")
                except Exception as e:
                    logger.error(f"Error removing orphaned image {image_file}: {e}")
        
        logger.info(f"Cleanup complete: {orphaned_count} orphaned files removed")
        return orphaned_count


# Singleton instance
_image_asset_store_instance: Optional[ImageAssetStore] = None


def get_image_asset_store() -> ImageAssetStore:
    """Get or create ImageAssetStore singleton"""
    global _image_asset_store_instance
    
    if _image_asset_store_instance is None:
        _image_asset_store_instance = ImageAssetStore()
    
    return _image_asset_store_instance
