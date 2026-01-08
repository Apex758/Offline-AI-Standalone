import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// ========================================
// TypeScript Types
// ========================================

export interface ImageGenerationContext {
  subject?: string;
  grade?: string;
  topic?: string;
  questionType?: string;
  additionalContext?: string;
}

export interface ImagePromptResponse {
  success: boolean;
  prompt: string;
  negativePrompt: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numInferenceSteps?: number;
}

export interface ImageBase64Response {
  success: boolean;
  imageData: string; // data:image/png;base64,...
}

export interface InpaintBase64Request {
  image: string; // base64 or data URI
  mask: string;  // base64 or data URI
  seed?: number;
}

export interface ImageServiceStatus {
  sdxl: {
    initialized: boolean;
  };
  iopaint: {
    running: boolean;
    port: number;
  };
}

export interface SavedImageRecord {
  id: string;
  title: string;
  timestamp: string;
  type: 'images';
  imageUrl: string;
  formData?: any;
}

// ========================================
// API Client
// ========================================

export const imageApi = {
  /**
   * Generate an optimized image prompt using LLaMA model
   * @param context - Context about the worksheet/educational content
   * @returns Generated prompt and negative prompt
   */
  generatePrompt: async (context: ImageGenerationContext): Promise<ImagePromptResponse> => {
    try {
      const response = await axios.post<ImagePromptResponse>(
        `${API_URL}/generate-image-prompt`,
        { context }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating image prompt:', error);
      throw error;
    }
  },

  /**
   * Generate image and return as PNG blob
   * @param request - Image generation parameters
   * @returns Blob containing PNG image
   */
  generateImage: async (request: ImageGenerationRequest): Promise<Blob> => {
    try {
      const response = await axios.post(
        `${API_URL}/generate-image`,
        {
          prompt: request.prompt,
          negativePrompt: request.negativePrompt || 'blurry, distorted, low quality',
          width: request.width || 1024,
          height: request.height || 512,
          numInferenceSteps: request.numInferenceSteps || 2
        },
        {
          responseType: 'blob' // Important: receive as binary data
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  },

  /**
   * Generate image and return as base64 data URI
   * @param request - Image generation parameters
   * @returns Base64 data URI (ready for <img src="">)
   */
  generateImageBase64: async (request: ImageGenerationRequest): Promise<ImageBase64Response> => {
    try {
      const response = await axios.post<ImageBase64Response>(
        `${API_URL}/generate-image-base64`,
        {
          prompt: request.prompt,
          negativePrompt: request.negativePrompt || 'blurry, distorted, low quality',
          width: request.width || 1024,
          height: request.height || 512,
          numInferenceSteps: request.numInferenceSteps || 2
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating image (base64):', error);
      throw error;
    }
  },

  /**
   * Remove objects from image using inpainting
   * @param image - File object or base64 string
   * @param mask - File object or base64 string (white = remove)
   * @param seed - Optional seed for reproducibility
   * @returns Blob containing inpainted PNG image
   */
  inpaintImage: async (
    image: File | string,
    mask: File | string,
    seed?: number
  ): Promise<Blob> => {
    try {
      // If inputs are Files, use FormData (multipart)
      if (image instanceof File && mask instanceof File) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('mask', mask);
        if (seed !== undefined) {
          formData.append('seed', seed.toString());
        }

        const response = await axios.post(
          `${API_URL}/inpaint`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
          }
        );
        return response.data;
      } else {
        // If inputs are base64 strings, use JSON endpoint
        const response = await axios.post(
          `${API_URL}/inpaint-base64`,
          {
            image: typeof image === 'string' ? image : '',
            mask: typeof mask === 'string' ? mask : '',
            seed
          },
          {
            responseType: 'blob'
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error inpainting image:', error);
      throw error;
    }
  },

  /**
   * Remove objects from image and return as base64
   * @param request - Image and mask as base64 data URIs
   * @returns Base64 data URI of inpainted image
   */
  inpaintImageBase64: async (request: InpaintBase64Request): Promise<ImageBase64Response> => {
    try {
      const response = await axios.post<ImageBase64Response>(
        `${API_URL}/inpaint-base64`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error inpainting image (base64):', error);
      throw error;
    }
  },

  /**
   * Check status of image generation services
   * @returns Status of SDXL and IOPaint services
   */
  getStatus: async (): Promise<ImageServiceStatus> => {
    try {
      const response = await axios.get<ImageServiceStatus>(
        `${API_URL}/image-service/status`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting image service status:', error);
      throw error;
    }
  },

  /**
   * Manually start IOPaint service
   * @returns Success status
   */
  startIOPaint: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        `${API_URL}/image-service/start-iopaint`
      );
      return response.data;
    } catch (error) {
      console.error('Error starting IOPaint:', error);
      throw error;
    }
  },

  /**
   * Save image to backend storage
   */
  saveImage: async (imageRecord: SavedImageRecord): Promise<{ success: boolean }> => {
    try {
      const response = await axios.post(
        `${API_URL}/images-history`,
        imageRecord
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  },

  /**
   * Load image from backend storage
   */
  loadImage: async (imageId: string): Promise<SavedImageRecord> => {
    try {
      const response = await axios.get<SavedImageRecord>(
        `${API_URL}/images-history/${imageId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  },

  /**
   * Delete image from backend storage
   */
  deleteImage: async (imageId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/images-history/${imageId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

// ========================================
// Helper Functions
// ========================================

/**
 * Convert Blob to base64 data URI
 */
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert base64 data URI to Blob
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Download image from blob or data URI
 */
export const downloadImage = (data: Blob | string, filename: string = 'image.png') => {
  const url = data instanceof Blob ? URL.createObjectURL(data) : data;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  if (data instanceof Blob) {
    URL.revokeObjectURL(url);
  }
};