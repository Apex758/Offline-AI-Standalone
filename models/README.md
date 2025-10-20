# AI Models Directory

This directory is used to store AI model files for the Offline AI Standalone application.

## Supported Model Formats

The application supports the following model file formats:
- `.gguf` - GGUF format (recommended)
- `.bin` - Binary format
- `.ggml` - GGML format

## How to Add Models

1. Download your AI model file (e.g., a `.gguf` file)
2. Place the model file in this `models` directory
3. The backend will automatically detect and list all available models via the API endpoint

## API Endpoint

To retrieve the list of available models:
```
GET http://localhost:8000/api/models
```

This will return:
- List of all model files in this directory
- Model name, file size, and extension
- Which model is currently active
- Total count of available models

## Currently Active Model

The currently active model is configured in `backend/config.py` and may be located in the backend directory or in this models directory.

## Example Response

```json
{
  "success": true,
  "models": [
    {
      "name": "model-name.gguf",
      "path": "C:/path/to/models/model-name.gguf",
      "size_mb": 4250.50,
      "extension": ".gguf",
      "is_active": false
    }
  ],
  "models_directory": "C:/path/to/models",
  "count": 1
}
```

## Notes

- Place only AI model files in this directory
- Larger models will require more disk space and memory
- The backend will scan this directory each time the `/api/models` endpoint is called