/**
 * Hook that owns the /ws/storybook-v2 stream state.
 *
 * Collects bible_token / pages_token into live preview strings, parses the
 * `bible` and `pages` commit events, accumulates per-page images as they
 * render, and surfaces the final manifest.
 *
 * Kept separate from the legacy v1 WebSocketContext-backed flow so the two
 * code paths can coexist during incremental migration.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';
import type {
  StorybookBible,
  StoryPageV2,
  IntroductionPageV2,
  ComprehensionQuestionV2,
  StorybookManifest,
  StorybookV2Event,
} from '../types/storybook';
import type { StorybookV2Payload } from '../utils/storybookPromptBuilder';

export type V2Status =
  | 'idle'
  | 'connecting'
  | 'planning'
  | 'writing_pages'
  | 'rendering_images'
  | 'packaging'
  | 'done'
  | 'error'
  | 'cancelled';

export interface PageImageEntry {
  page: number;
  imageDataBase64?: string;
  imagePath?: string;
  placeholder: boolean;
  error?: string;
}

export interface StorybookV2State {
  status: V2Status;
  jobId: string | null;
  bibleText: string;
  bible: StorybookBible | null;
  pagesText: string;
  introductionPage: IntroductionPageV2 | null;
  pages: StoryPageV2[];
  comprehensionQuestions: ComprehensionQuestionV2[];
  pageImages: Record<number, PageImageEntry>;
  manifest: StorybookManifest | null;
  errorMessage: string | null;
}

const INITIAL_STATE: StorybookV2State = {
  status: 'idle',
  jobId: null,
  bibleText: '',
  bible: null,
  pagesText: '',
  introductionPage: null,
  pages: [],
  comprehensionQuestions: [],
  pageImages: {},
  manifest: null,
  errorMessage: null,
};

const ENDPOINT = '/ws/storybook-v2';

export function useStorybookV2() {
  const [state, setState] = useState<StorybookV2State>(INITIAL_STATE);
  const wsRef = useRef<WebSocket | null>(null);
  const jobIdRef = useRef<string | null>(null);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    jobIdRef.current = null;
  }, []);

  const handleEvent = useCallback((ev: StorybookV2Event) => {
    setState(prev => {
      switch (ev.type) {
        case 'status':
          return { ...prev, status: ev.status };
        case 'bible_token':
          return { ...prev, bibleText: prev.bibleText + ev.content };
        case 'bible':
          return { ...prev, bible: ev.content };
        case 'pages_token':
          return { ...prev, pagesText: prev.pagesText + ev.content };
        case 'pages':
          return {
            ...prev,
            introductionPage: ev.content.introduction_page,
            pages: ev.content.pages,
            comprehensionQuestions: ev.content.comprehension_questions,
          };
        case 'page_image': {
          const entry: PageImageEntry = {
            page: ev.page,
            imagePath: ev.image_path,
            imageDataBase64: (ev as any).imageDataBase64,
            placeholder: !!ev.placeholder,
            error: ev.error,
          };
          return { ...prev, pageImages: { ...prev.pageImages, [ev.page]: entry } };
        }
        case 'manifest':
          return { ...prev, manifest: ev.manifest };
        case 'done':
          return { ...prev, status: 'done' };
        case 'error':
          return { ...prev, status: 'error', errorMessage: ev.message };
        case 'cancelled':
          return { ...prev, status: 'cancelled' };
        default:
          return prev;
      }
    });
  }, []);

  const send = useCallback((payload: StorybookV2Payload, opts?: { generationMode?: 'queued' | 'simultaneous' }) => {
    // Tear down any prior socket so we start fresh for each generation.
    if (wsRef.current) {
      try { wsRef.current.close(); } catch { /* noop */ }
      wsRef.current = null;
    }
    const jobId = `sbv2_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    jobIdRef.current = jobId;
    setState({ ...INITIAL_STATE, status: 'connecting', jobId });

    const url = getWebSocketUrl(ENDPOINT, isElectronEnvironment());
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        brief: payload.brief,
        pageCount: payload.pageCount,
        targetAge: payload.targetAge,
        curriculumInfo: payload.curriculumInfo,
        jobId,
        generationMode: opts?.generationMode ?? 'queued',
      }));
    });

    ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data) as StorybookV2Event;
        handleEvent(msg);
      } catch (e) {
        console.warn('[storybook-v2] bad WS message', e);
      }
    });

    ws.addEventListener('error', () => {
      setState(prev => ({ ...prev, status: 'error', errorMessage: 'WebSocket error' }));
    });

    ws.addEventListener('close', () => {
      setState(prev => (
        prev.status === 'done' || prev.status === 'error' || prev.status === 'cancelled'
          ? prev
          : { ...prev, status: prev.status === 'connecting' ? 'error' : prev.status }
      ));
    });

    return jobId;
  }, [handleEvent]);

  const cancel = useCallback(() => {
    const ws = wsRef.current;
    const jobId = jobIdRef.current;
    if (ws && jobId && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'cancel', jobId }));
      } catch { /* noop */ }
    }
  }, []);

  useEffect(() => {
    return () => {
      const ws = wsRef.current;
      if (ws) {
        try { ws.close(); } catch { /* noop */ }
      }
    };
  }, []);

  return { state, send, cancel, reset };
}
