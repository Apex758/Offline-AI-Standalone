from jina import Executor, requests
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class LlamaResponder(Executor):
    def __init__(self, model_path="facebook/opt-125m", **kwargs):
        super().__init__(**kwargs)
        self.device = torch.device("cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_path, 
            torch_dtype=torch.float32
        ).to(self.device)

    @requests
    def respond(self, docs, **kwargs):
        for doc in docs:
            inputs = self.tokenizer(doc.text, return_tensors="pt").to(self.device)
            outputs = self.model.generate(**inputs, max_new_tokens=200)
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            doc.text = response
        return docs