from jina import Executor, requests
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
from pathlib import Path
import os

class BlipCaptioner(Executor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.device = torch.device("cpu")
        user_models_dir = Path(os.path.expandvars("%APPDATA%")) / "Offline AI Standalone" / "models"
        blip_model_name = "blip-image-captioning-base"
        user_blip_path = user_models_dir / blip_model_name
        if user_blip_path.exists():
            model_path = str(user_blip_path)
        else:
            model_path = "Salesforce/blip-image-captioning-base"
        self.processor = BlipProcessor.from_pretrained(model_path)
        self.model = BlipForConditionalGeneration.from_pretrained(model_path).to(self.device)

    @requests
    def caption(self, docs, **kwargs):
        for doc in docs:
            image = Image.open(doc.uri).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            out = self.model.generate(**inputs)
            caption = self.processor.decode(out[0], skip_special_tokens=True)
            doc.text = caption
        return docs