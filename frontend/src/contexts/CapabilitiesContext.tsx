import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface DualModelConfig {
  enabled: boolean;
  fast_model: string | null;
  task_routing: Record<string, 'fast' | 'primary'>;
}

export interface Capabilities {
  tier: number;
  hasLlm: boolean;
  hasVision: boolean;
  hasOcr: boolean;
  hasDiffusion: boolean;
  hasLama: boolean;
  hasOcrModel: boolean;
  supportsThinking: boolean;
  selectedLlm: string;
  selectedDiffusion: string;
  dualModel: DualModelConfig;
}

// ---------------------------------------------------------------------------
// Recommendation types
// ---------------------------------------------------------------------------

export interface ModelRecommendation {
  name: string;
  reason: string;
  estimated_ram_gb?: number;
  param_b?: number | null;
  quant?: string | null;
  family?: string;
  fits_in_vram?: boolean;
  compatible?: boolean;
  size_mb?: number;
  ram_required_gb?: number;
  description?: string;
}

export interface LlmCompatibility {
  estimated_ram_gb: number;
  fits: boolean;
  comfortable: boolean;
  param_b: number | null;
  quant: string | null;
}

export interface Recommendations {
  hardware_tier: 'low' | 'mid' | 'high' | 'ultra';
  hardware_label: string;
  hardware_description: string;
  ram_gb: number;
  vram_mb: number;
  cpu_cores: number;
  has_gpu: boolean;
  gpu_name?: string | null;
  processor?: string | null;
  recommended_llm: ModelRecommendation | null;
  recommended_diffusion: ModelRecommendation | null;
  recommended_ocr: ModelRecommendation | null;
  supported_capability_tier: 1 | 2 | 3;
  llm_compatibility: Record<string, LlmCompatibility>;
  warnings: string[];
}

// ---------------------------------------------------------------------------

interface CapabilitiesContextType extends Capabilities {
  refreshCapabilities: () => Promise<void>;
  loading: boolean;
  recommendations: Recommendations | null;
  recommendationsLoading: boolean;
}

const defaultCapabilities: Capabilities = {
  tier: 1,
  hasLlm: false,
  hasVision: false,
  hasOcr: false,
  hasDiffusion: false,
  hasLama: false,
  hasOcrModel: false,
  supportsThinking: false,
  selectedLlm: '',
  selectedDiffusion: '',
  dualModel: {
    enabled: false,
    fast_model: null,
    task_routing: {},
  },
};

const CapabilitiesContext = createContext<CapabilitiesContextType>({
  ...defaultCapabilities,
  refreshCapabilities: async () => {},
  loading: true,
  recommendations: null,
  recommendationsLoading: true,
});

export function CapabilitiesProvider({ children }: { children: React.ReactNode }) {
  const [capabilities, setCapabilities] = useState<Capabilities>(defaultCapabilities);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const fetchRef = useRef(false);

  const refreshCapabilities = useCallback(async () => {
    try {
      const res = await fetch('/api/capabilities');
      if (!res.ok) return;
      const data = await res.json();
      setCapabilities({
        tier: data.tier ?? 1,
        hasLlm: data.has_llm ?? false,
        hasVision: data.has_vision ?? false,
        hasOcr: data.has_ocr ?? false,
        hasDiffusion: data.has_diffusion ?? false,
        hasLama: data.has_lama ?? false,
        hasOcrModel: data.has_ocr_model ?? false,
        supportsThinking: data.supports_thinking ?? false,
        selectedLlm: data.selected_llm ?? '',
        selectedDiffusion: data.selected_diffusion ?? '',
        dualModel: data.dual_model ?? defaultCapabilities.dualModel,
      });
    } catch (err) {
      console.error('Failed to fetch capabilities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recommendations once on mount — hardware doesn't change at runtime
  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch('/api/recommendations');
      if (!res.ok) return;
      const data: Recommendations = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchRef.current) {
      fetchRef.current = true;
      refreshCapabilities();
      fetchRecommendations();
    }
  }, [refreshCapabilities, fetchRecommendations]);

  return (
    <CapabilitiesContext.Provider
      value={{ ...capabilities, refreshCapabilities, loading, recommendations, recommendationsLoading }}
    >
      {children}
    </CapabilitiesContext.Provider>
  );
}

export function useCapabilities() {
  return useContext(CapabilitiesContext);
}
