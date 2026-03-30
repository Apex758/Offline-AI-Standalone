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
  selectedLlm: string;
  selectedDiffusion: string;
  dualModel: DualModelConfig;
}

interface CapabilitiesContextType extends Capabilities {
  refreshCapabilities: () => Promise<void>;
  loading: boolean;
}

const defaultCapabilities: Capabilities = {
  tier: 1,
  hasLlm: false,
  hasVision: false,
  hasOcr: false,
  hasDiffusion: false,
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
});

export function CapabilitiesProvider({ children }: { children: React.ReactNode }) {
  const [capabilities, setCapabilities] = useState<Capabilities>(defaultCapabilities);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!fetchRef.current) {
      fetchRef.current = true;
      refreshCapabilities();
    }
  }, [refreshCapabilities]);

  return (
    <CapabilitiesContext.Provider value={{ ...capabilities, refreshCapabilities, loading }}>
      {children}
    </CapabilitiesContext.Provider>
  );
}

export function useCapabilities() {
  return useContext(CapabilitiesContext);
}
