from jina import Executor, requests
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch

class BlipCaptioner(Executor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.device = torch.device("cpu")
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        self.model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        ).to(self.device)

    @requests
    def caption(self, docs, **kwargs):
        for doc in docs:
            image = Image.open(doc.uri).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            out = self.model.generate(**inputs)
            caption = self.processor.decode(out[0], skip_special_tokens=True)
            doc.text = caption
        return docs