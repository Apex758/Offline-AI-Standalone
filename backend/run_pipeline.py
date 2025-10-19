from transformers import BlipProcessor, BlipForConditionalGeneration
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image
import torch

print("Loading models...")

# Load BLIP for image captioning
device = torch.device("cpu")
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(device)

# Load small language model
llm_tokenizer = AutoTokenizer.from_pretrained("facebook/opt-125m")
llm_model = AutoModelForCausalLM.from_pretrained("facebook/opt-125m", torch_dtype=torch.float32).to(device)

print("Models loaded!")

def process_image(image_path):
    # Step 1: Caption the image
    image = Image.open(image_path).convert("RGB")
    inputs = blip_processor(images=image, return_tensors="pt").to(device)
    out = blip_model.generate(**inputs)
    caption = blip_processor.decode(out[0], skip_special_tokens=True)
    
    print(f"\nCaption: {caption}")
    
    # Step 2: Generate educational content
    prompt = f"This image shows: {caption}. Educational explanation:"
    inputs = llm_tokenizer(prompt, return_tensors="pt").to(device)
    outputs = llm_model.generate(**inputs, max_new_tokens=100)
    response = llm_tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    print(f"\nResponse: {response}")
    return caption, response

# Test it
if __name__ == "__main__":
    caption, response = process_image("test.jpg")