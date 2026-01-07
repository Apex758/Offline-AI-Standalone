"""
Image Service - Production Ready with Electron Path Support
Manages SDXL-Turbo generation and IOPaint subprocess
Designed for offline Electron packaging with embedded Python
"""

import os
import sys
import subprocess
import logging
import requests
import time
import atexit
from pathlib import Path
from typing import Optional, Dict, Any
import base64
from io import BytesIO
from PIL import Image

logger = logging.getLogger(__name__)

def get_resource_path(relative_path: str) -> Path:
    """
    Get absolute path to resource, works for dev and production (Electron)
    
    In development: Uses relative path from backend folder
    In production: Uses path relative to Electron resources folder
    
    Args:
        relative_path: Relative path to resource (e.g., "models/image_generation/sdxl-turbo-openvino")
    
    Returns:
        Path: Absolute path to resource
    """
    # Check if running in packaged Electron app
    if hasattr(sys, '_MEIPASS'):
        # PyInstaller path
        base_path = Path(sys._MEIPASS)
    elif os.environ.get('ELECTRON_RESOURCE_PATH'):
        # Custom Electron resource path (set by main.js)
        base_path = Path(os.environ['ELECTRON_RESOURCE_PATH'])
    else:
        # Development mode - use current directory
        base_path = Path(__file__).parent
    
    resource_path = base_path / relative_path
    logger.info(f"Resource path resolved: {relative_path} -> {resource_path}")
    
    return resource_path


def get_app_data_path(subfolder: str = "") -> Path:
    """
    Get user-writable data directory for caching models
    
    Args:
        subfolder: Optional subfolder within app data
    
    Returns:
        Path: Path to app data directory
    """
    if os.name == 'nt':  # Windows
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'cache'
    else:  # macOS/Linux
        data_dir = Path.home() / '.olh_ai_education' / 'cache'
    
    if subfolder:
        data_dir = data_dir / subfolder
    
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


class ImageService:
    """Manages image generation (SDXL) and inpainting (IOPaint)"""
    
    def __init__(self, 
                 sdxl_model_path: Optional[str] = None,
                 iopaint_port: int = 8080):
        """
        Initialize ImageService with automatic path resolution
        
        Args:
            sdxl_model_path: Override path to SDXL model (optional, auto-detected if None)
            iopaint_port: Port for IOPaint server
        """
        # Auto-detect SDXL model path
        if sdxl_model_path is None:
            sdxl_model_path = get_resource_path("models/image_generation/sdxl-turbo-openvino")
        else:
            sdxl_model_path = Path(sdxl_model_path)
        
        self.sdxl_model_path = Path(sdxl_model_path)
        self.iopaint_port = iopaint_port
        self.iopaint_process: Optional[subprocess.Popen] = None
        self.sdxl_pipeline = None
        
        # Setup IOPaint cache directory
        self.iopaint_cache_dir = get_app_data_path("iopaint")
        self._setup_iopaint_cache()
        
        # Register cleanup on exit
        atexit.register(self.cleanup)
        
        logger.info(f"ImageService initialized")
        logger.info(f"  SDXL model path: {self.sdxl_model_path}")
        logger.info(f"  IOPaint cache: {self.iopaint_cache_dir}")
    
    def _setup_iopaint_cache(self):
        """Setup IOPaint model cache in app data folder"""
        # Copy LaMa model from resources to cache if not exists
        lama_cache_file = self.iopaint_cache_dir / "big-lama.pt"
        
        if not lama_cache_file.exists():
            logger.info("Setting up IOPaint cache...")
            
            # Try to copy from bundled resources
            bundled_lama = get_resource_path("models/image_generation/lama/big-lama.pt")
            
            if bundled_lama.exists():
                logger.info(f"Copying LaMa model to cache: {bundled_lama} -> {lama_cache_file}")
                try:
                    import shutil
                    shutil.copy2(bundled_lama, lama_cache_file)
                    logger.info("LaMa model cached successfully")
                except Exception as e:
                    logger.error(f"Failed to cache LaMa model: {e}")
            else:
                logger.warning(f"Bundled LaMa model not found at: {bundled_lama}")
                logger.info("IOPaint will download on first use")
        else:
            logger.info(f"IOPaint cache already exists: {lama_cache_file}")
    
    def initialize_sdxl(self) -> bool:
        """
        Initialize SDXL-Turbo pipeline (lazy loading)
        
        Returns:
            bool: True if successful, False otherwise
        """
        if self.sdxl_pipeline is not None:
            return True
        
        try:
            from optimum.intel.openvino import OVStableDiffusionXLPipeline
            
            logger.info(f"Loading SDXL model from: {self.sdxl_model_path}")
            
            if not self.sdxl_model_path.exists():
                logger.error(f"SDXL model not found at: {self.sdxl_model_path}")
                logger.error("Please run setup-models.ps1 before building")
                return False
            
            self.sdxl_pipeline = OVStableDiffusionXLPipeline.from_pretrained(
                str(self.sdxl_model_path),
                compile=True
            )
            
            logger.info("SDXL pipeline loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize SDXL: {e}")
            return False
    
    def start_iopaint(self) -> bool:
        """
        Start IOPaint server as subprocess
        
        Returns:
            bool: True if started successfully
        """
        if self.is_iopaint_running():
            logger.info(f"IOPaint already running on port {self.iopaint_port}")
            return True
        
        try:
            # Find iopaint executable (works with embedded Python)
            iopaint_cmd = self._find_iopaint_executable()
            
            if not iopaint_cmd:
                logger.error("IOPaint executable not found")
                logger.error("Make sure iopaint is installed: pip install iopaint")
                return False
            
            # Set environment variable for model cache
            env = os.environ.copy()
            env['TORCH_HOME'] = str(self.iopaint_cache_dir.parent)
            
            # Start IOPaint subprocess
            cmd = [
                iopaint_cmd, "start",
                "--model=lama",
                "--device=cpu",
                f"--port={self.iopaint_port}",
                "--host=127.0.0.1"
            ]
            
            logger.info(f"Starting IOPaint: {' '.join(cmd)}")
            
            # Start process with no console window on Windows
            startupinfo = None
            creation_flags = 0
            
            if os.name == 'nt':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = subprocess.SW_HIDE
                creation_flags = subprocess.CREATE_NO_WINDOW
            
            self.iopaint_process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                startupinfo=startupinfo,
                creationflags=creation_flags,
                env=env
            )
            
            # Wait for server to be ready (max 30 seconds)
            for i in range(30):
                time.sleep(1)
                if self.is_iopaint_running():
                    logger.info(f"IOPaint started successfully on port {self.iopaint_port}")
                    return True
            
            logger.error("IOPaint failed to start within 30 seconds")
            return False
            
        except Exception as e:
            logger.error(f"Error starting IOPaint: {e}")
            return False
    
    def _find_iopaint_executable(self) -> Optional[str]:
        """Find iopaint executable in environment"""
        # Try to find iopaint in PATH
        if os.name == 'nt':
            # Windows - check Scripts folder in venv or embedded Python
            possible_paths = [
                os.path.join(sys.prefix, 'Scripts', 'iopaint.exe'),
                os.path.join(sys.prefix, 'Scripts', 'iopaint'),
                'iopaint.exe',
                'iopaint'
            ]
        else:
            # Linux/Mac
            possible_paths = [
                os.path.join(sys.prefix, 'bin', 'iopaint'),
                'iopaint'
            ]
        
        for path in possible_paths:
            if os.path.exists(path) or self._command_exists(path):
                logger.info(f"Found iopaint at: {path}")
                return path
        
        return None
    
    def _command_exists(self, command: str) -> bool:
        """Check if command exists in PATH"""
        try:
            subprocess.run([command, '--version'], 
                         capture_output=True, 
                         timeout=5,
                         creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
            return True
        except (subprocess.SubprocessError, FileNotFoundError):
            return False
    
    def is_iopaint_running(self) -> bool:
        """Check if IOPaint server is responding"""
        try:
            response = requests.get(
                f"http://127.0.0.1:{self.iopaint_port}/api/v1/server-config",
                timeout=2
            )
            return response.status_code == 200
        except requests.RequestException:
            return False
    
    def generate_image(self, 
                      prompt: str,
                      negative_prompt: str = "multiple people, group, crowd, deformed, distorted, blurry",
                      width: int = 1024,
                      height: int = 512,
                      num_inference_steps: int = 2,
                      guidance_scale: float = 0.0) -> Optional[bytes]:
        """
        Generate image using SDXL-Turbo
        
        Args:
            prompt: Text prompt for image generation
            negative_prompt: Negative prompt
            width: Image width
            height: Image height
            num_inference_steps: Number of inference steps (1-4 for Turbo)
            guidance_scale: CFG scale (0.0 for Turbo)
        
        Returns:
            bytes: PNG image data or None if failed
        """
        try:
            # Initialize SDXL if not already loaded
            if not self.initialize_sdxl():
                logger.error("SDXL pipeline not initialized")
                return None
            
            logger.info(f"Generating image: {prompt[:50]}...")
            
            # Generate image
            result = self.sdxl_pipeline(
                prompt=prompt,
                negative_prompt=negative_prompt,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                width=width,
                height=height
            )
            
            image = result.images[0]
            
            # Convert PIL Image to bytes
            buffer = BytesIO()
            image.save(buffer, format='PNG')
            image_bytes = buffer.getvalue()
            
            logger.info(f"Image generated successfully ({len(image_bytes)} bytes)")
            return image_bytes
            
        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return None
    
    def inpaint_image(self, 
                     image_data: bytes,
                     mask_data: bytes,
                     seed: Optional[int] = None) -> Optional[bytes]:
        """
        Remove objects from image using IOPaint (LaMa model)
        
        Args:
            image_data: Original image as bytes
            mask_data: Mask image as bytes (white = remove, black = keep)
            seed: Random seed for reproducibility
        
        Returns:
            bytes: Inpainted image as bytes or None if failed
        """
        try:
            # Ensure IOPaint is running
            if not self.is_iopaint_running():
                logger.info("IOPaint not running, starting it...")
                if not self.start_iopaint():
                    logger.error("Failed to start IOPaint")
                    return None
            
            # Convert bytes to base64
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            mask_b64 = base64.b64encode(mask_data).decode('utf-8')
            
            # Prepare request
            payload = {
                "image": f"data:image/png;base64,{image_b64}",
                "mask": f"data:image/png;base64,{mask_b64}",
                "ldmSteps": 25,
                "ldmSampler": "plms",
                "hdStrategy": "Original",
                "seed": seed if seed else -1
            }
            
            # Send request to IOPaint
            response = requests.post(
                f"http://127.0.0.1:{self.iopaint_port}/api/v1/inpaint",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                logger.info("Inpainting completed successfully")
                return response.content
            else:
                logger.error(f"IOPaint error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error in inpainting: {e}")
            return None
    
    def cleanup(self):
        """Cleanup resources and stop IOPaint"""
        logger.info("Cleaning up ImageService...")
        
        # Cleanup SDXL pipeline
        if self.sdxl_pipeline:
            try:
                del self.sdxl_pipeline
                self.sdxl_pipeline = None
                logger.info("SDXL pipeline cleaned up")
            except Exception as e:
                logger.error(f"Error cleaning SDXL: {e}")
        
        # Stop IOPaint process
        if self.iopaint_process:
            try:
                self.iopaint_process.terminate()
                self.iopaint_process.wait(timeout=5)
                logger.info("IOPaint process terminated")
            except Exception as e:
                logger.error(f"Error stopping IOPaint: {e}")
                try:
                    self.iopaint_process.kill()
                except:
                    pass
            finally:
                self.iopaint_process = None


# Singleton instance
_image_service_instance: Optional[ImageService] = None

def get_image_service(sdxl_model_path: Optional[str] = None,
                     iopaint_port: int = 8080) -> ImageService:
    """Get or create ImageService singleton"""
    global _image_service_instance
    
    if _image_service_instance is None:
        _image_service_instance = ImageService(sdxl_model_path, iopaint_port)
    
    return _image_service_instance