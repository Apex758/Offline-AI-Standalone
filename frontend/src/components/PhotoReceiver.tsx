import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { API_CONFIG } from '../config/api.config';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

// ── Types ────────────────────────────────────────────────────────────────────

interface Photo {
  id: string;
  filename: string;
  index: number;
  size_bytes: number;
  uploaded_at: string;
  path: string;
}

interface Session {
  id: string;
  session_name: string;
  date: string;
  folder_name: string;
  folder_path: string;
  created_at: string;
  photo_count: number;
  photos: Photo[];
}

interface ScanMatch {
  photo_id: string;
  student_id: string;
  student_name: string;
  doc_type: string;
  doc_id: string;
  doc_title: string;
  doc_subject: string;
  doc_grade: string;
  timestamp: string;
}

interface ExpectedStudent {
  student_id: string;
  full_name: string;
}

interface ScanToast {
  id: string;
  message: string;
  detail: string;
  timestamp: number;
}

interface PhotoReceiverProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

interface NetworkInfo {
  ip: string;
  all_ips: string[];
  port: number;
  ssl_port: number | null;
  ssl_enabled: boolean;
  phone_url: string;
  phone_url_http: string;
  phone_url_https: string | null;
}

const PhotoReceiver: React.FC<PhotoReceiverProps> = ({ tabId, savedData, onDataChange, isActive }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [connected, setConnected] = useState(false);
  const [phonesConnected, setPhonesConnected] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [showNewSession, setShowNewSession] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [savingToResources, setSavingToResources] = useState(false);

  // Hotspot + HTTPS state
  const [hotspotActive, setHotspotActive] = useState(false);
  const [hotspotLoading, setHotspotLoading] = useState(false);
  const [hotspotInfo, setHotspotInfo] = useState<{ ssid: string; password: string } | null>(null);
  const [httpsEnabled, setHttpsEnabled] = useState(false);
  const [httpsLoading, setHttpsLoading] = useState(false);

  // Grade mode state
  const [gradeMode, setGradeMode] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResults, setGradingResults] = useState<any[] | null>(null);
  const [gradingSummary, setGradingSummary] = useState<{ total: number; graded: number; failed: number; class_average: number } | null>(null);

  // Scan tracker state
  const [scanMatches, setScanMatches] = useState<ScanMatch[]>([]);
  const [showScanPanel, setShowScanPanel] = useState(false);
  const [expectedStudents, setExpectedStudents] = useState<Map<string, ExpectedStudent[]>>(new Map());
  const [scanToasts, setScanToasts] = useState<ScanToast[]>([]);
  const expectedStudentsRef = useRef<Map<string, ExpectedStudent[]>>(new Map());

  // Keep ref in sync with state for use inside SSE callback
  useEffect(() => { expectedStudentsRef.current = expectedStudents; }, [expectedStudents]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const BASE = API_CONFIG.BASE_URL;

  // ── Fetch network info ──
  const refreshNetworkInfo = useCallback(() => {
    fetch(`${BASE}/api/photo-transfer/network-info`)
      .then(r => r.json())
      .then(data => {
        setNetworkInfo(data);
        setHttpsEnabled(data.ssl_enabled || false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshNetworkInfo();
    // Also check hotspot status on mount
    fetch(`${BASE}/api/photo-transfer/hotspot/status`)
      .then(r => r.json())
      .then(data => setHotspotActive(data.active || false))
      .catch(() => {});
  }, []);

  // ── Hotspot controls ──
  const toggleHotspot = async () => {
    setHotspotLoading(true);
    try {
      if (hotspotActive) {
        await fetch(`${BASE}/api/photo-transfer/hotspot/stop`, { method: 'POST' });
        setHotspotActive(false);
        setHotspotInfo(null);
      } else {
        const res = await fetch(`${BASE}/api/photo-transfer/hotspot/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ssid: 'OECS-PhotoTransfer', password: 'oecs1234' }),
        });
        const data = await res.json();
        if (data.ok) {
          setHotspotActive(true);
          setHotspotInfo({ ssid: data.ssid, password: data.password });
        }
      }
      // Refresh network info after hotspot change
      setTimeout(refreshNetworkInfo, 1500);
    } catch {}
    setHotspotLoading(false);
  };

  // ── Fetch sessions ──
  const fetchSessions = useCallback(() => {
    fetch(`${BASE}/api/photo-transfer/sessions`)
      .then(r => r.json())
      .then(data => {
        setSessions(data);
        if (data.length > 0 && !activeSession) {
          setActiveSession(data[data.length - 1]);
          setPhotos(data[data.length - 1].photos || []);
          setShowNewSession(false);
        }
      })
      .catch(() => {});
  }, [activeSession]);

  useEffect(() => {
    fetchSessions();
  }, []);

  // ── SSE connection ──
  useEffect(() => {
    const es = new EventSource(`${BASE}/api/photo-transfer/stream`);
    eventSourceRef.current = es;

    es.addEventListener('connected', () => setConnected(true));

    es.addEventListener('photo_uploaded', (e) => {
      const data = JSON.parse(e.data);
      setPhotos(prev => [...prev, data.photo]);
      setActiveSession(prev => prev ? { ...prev, photo_count: data.total_count } : prev);
      if (data.phones_connected !== undefined) setPhonesConnected(data.phones_connected);
    });

    es.addEventListener('session_created', (e) => {
      const session = JSON.parse(e.data);
      setSessions(prev => [...prev, session]);
      setActiveSession(session);
      setPhotos([]);
      setShowNewSession(false);
    });

    es.addEventListener('photo_deleted', (e) => {
      const data = JSON.parse(e.data);
      setPhotos(prev => prev.filter(p => p.id !== data.photo_id));
    });

    es.addEventListener('session_deleted', (e) => {
      const data = JSON.parse(e.data);
      setSessions(prev => prev.filter(s => s.id !== data.session_id));
      setActiveSession(prev => prev?.id === data.session_id ? null : prev);
    });

    es.addEventListener('photo_matched', (e) => {
      const data = JSON.parse(e.data);
      const match: ScanMatch = { ...data, timestamp: new Date().toISOString() };
      setScanMatches(prev => [...prev, match]);

      // Show toast notification
      const docLabel = data.doc_title
        ? `${data.doc_title}${data.doc_subject ? ` (${data.doc_subject})` : ''}`
        : `${data.doc_type} identified`;
      const toastId = `${data.photo_id}_${Date.now()}`;
      setScanToasts(prev => [...prev, {
        id: toastId,
        message: docLabel,
        detail: data.student_name || data.student_id || '',
        timestamp: Date.now(),
      }]);
      setTimeout(() => {
        setScanToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3500);

      // Fetch expected students for this doc if not already fetched
      if (data.doc_id && !expectedStudentsRef.current.has(data.doc_id)) {
        fetch(`${BASE}/api/photo-transfer/doc-students/${data.doc_id}`)
          .then(r => r.json())
          .then((students: ExpectedStudent[]) => {
            setExpectedStudents(prev => new Map(prev).set(data.doc_id, students));
          })
          .catch(() => {});
      }
    });

    es.onerror = () => setConnected(false);
    es.onopen = () => setConnected(true);

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  // ── Sync theme to backend for phone page ──
  const resolvedTheme = settings.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : settings.theme;

  useEffect(() => {
    fetch(`${BASE}/api/photo-transfer/theme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: resolvedTheme }),
    }).catch(() => {});
  }, [resolvedTheme]);

  // ── Cleanup: stop hotspot when component unmounts ──
  useEffect(() => {
    return () => {
      // If we started a hotspot, stop it on unmount
      if (hotspotActive) {
        fetch(`${BASE}/api/photo-transfer/hotspot/stop`, { method: 'POST' }).catch(() => {});
      }
    };
  }, [hotspotActive]);

  // ── Reset scan tracker when session changes ──
  const resetScanTracker = useCallback(() => {
    setScanMatches([]);
    setExpectedStudents(new Map());
    setShowScanPanel(false);
    setScanToasts([]);
  }, []);

  // ── Create session from desktop ──
  const createSession = async () => {
    const sessionName = newClassName.trim() || 'Unnamed Session';
    try {
      const res = await fetch(`${BASE}/api/photo-transfer/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_name: sessionName }),
      });
      const session = await res.json();
      setSessions(prev => [...prev, session]);
      setActiveSession(session);
      setPhotos([]);
      setNewClassName('');
      setShowNewSession(false);
      resetScanTracker();
    } catch {}
  };

  // ── Export PDF ──
  const exportPdf = async () => {
    if (!activeSession) return;
    setExportingPdf(true);
    try {
      const res = await fetch(`${BASE}/api/photo-transfer/export-pdf/${activeSession.id}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeSession.session_name.replace(/\s+/g, '_')}_${activeSession.date}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setExportingPdf(false);
  };

  // ── Save to Resources ──
  const saveToResources = async () => {
    if (!activeSession) return;
    setSavingToResources(true);
    try {
      const res = await fetch(`${BASE}/api/photo-transfer/save-to-resources/${activeSession.id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.ok) {
        const w = window as any;
        if (w.electronAPI?.openFileExternal) {
          w.electronAPI.openFileExternal(data.path);
        }
      }
    } catch {}
    setSavingToResources(false);
  };

  // ── Grade all photos in session ──
  const gradeAll = async () => {
    if (!activeSession || photos.length === 0) return;
    setIsGrading(true);
    setGradingResults(null);
    setGradingSummary(null);
    try {
      // Fetch all photo files and send to scan-grade-auto
      const formData = new FormData();
      for (const photo of photos) {
        const res = await fetch(`${BASE}/api/photo-transfer/photos/${activeSession.id}/${photo.filename}`);
        if (res.ok) {
          const blob = await res.blob();
          formData.append('files', blob, photo.filename);
        }
      }
      const gradeRes = await fetch(`${BASE}/api/scan-grade-auto`, {
        method: 'POST',
        body: formData,
      });
      const data = await gradeRes.json();
      setGradingResults(data.results || []);
      setGradingSummary(data.summary || null);
    } catch (err) {
      console.error('Grading failed:', err);
    }
    setIsGrading(false);
  };

  // ── Delete session ──
  const deleteSession = async (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete session "${session.session_name}" and all its photos?`)) return;
    try {
      await fetch(`${BASE}/api/photo-transfer/sessions/${session.id}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== session.id));
      if (activeSession?.id === session.id) {
        setActiveSession(null);
        setPhotos([]);
        setSelectedPhoto(null);
        resetScanTracker();
      }
    } catch {}
  };

  // ── Delete photo ──
  const deletePhoto = async (photo: Photo) => {
    if (!activeSession) return;
    try {
      await fetch(`${BASE}/api/photo-transfer/photos/${activeSession.id}/${photo.id}`, {
        method: 'DELETE',
      });
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
    } catch {}
  };

  // ── Photo image URL ──
  const photoUrl = (photo: Photo) =>
    `${BASE}/api/photo-transfer/photos/${activeSession?.id}/${photo.filename}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* ── Header ── */}
      <div style={{
        padding: '16px 24px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Photo Transfer</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Scan QR code with phone to send photos
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Connection status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            borderRadius: 20,
            background: connected ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${connected ? '#bbf7d0' : '#fecaca'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: connected ? '#22c55e' : '#ef4444',
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: connected ? '#16a34a' : '#dc2626' }}>
              {connected ? (phonesConnected > 0 ? `${phonesConnected} phone${phonesConnected !== 1 ? 's' : ''}` : 'Ready') : 'Connecting...'}
            </span>
          </div>

          {activeSession && photos.length > 0 && (
            <button
              onClick={exportPdf}
              disabled={exportingPdf}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: '#2563eb',
                color: 'white',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: exportingPdf ? 0.6 : 1,
              }}
            >
              {exportingPdf ? 'Exporting...' : 'Export PDF'}
            </button>
          )}

          {activeSession && photos.length > 0 && (
            <button
              onClick={saveToResources}
              disabled={savingToResources}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: '#16a34a',
                color: 'white',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: savingToResources ? 0.6 : 1,
              }}
            >
              {savingToResources ? 'Saving...' : 'Save to Resources'}
            </button>
          )}

          {/* Grade Mode Toggle */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            borderRadius: 20,
            background: gradeMode ? '#fef3c7' : '#f1f5f9',
            border: `1px solid ${gradeMode ? '#fbbf24' : '#e2e8f0'}`,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: gradeMode ? '#92400e' : '#64748b',
          }}>
            <input
              type="checkbox"
              checked={gradeMode}
              onChange={(e) => setGradeMode(e.target.checked)}
              style={{ display: 'none' }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Grade Mode
          </label>

          {/* Grade All Button */}
          {gradeMode && activeSession && photos.length > 0 && (
            <button
              onClick={gradeAll}
              disabled={isGrading}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: isGrading ? '#9ca3af' : '#7c3aed',
                color: 'white',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: isGrading ? 'not-allowed' : 'pointer',
              }}
            >
              {isGrading ? 'Grading...' : `Grade All (${photos.length})`}
            </button>
          )}

          {/* Scan Tracker Badge */}
          {gradeMode && scanMatches.length > 0 && (
            <button
              onClick={() => setShowScanPanel(prev => !prev)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: showScanPanel ? '#ede9fe' : '#f0fdf4',
                border: `1px solid ${showScanPanel ? '#c4b5fd' : '#bbf7d0'}`,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: showScanPanel ? '#7c3aed' : '#16a34a',
                position: 'relative',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <line x1="7" y1="12" x2="17" y2="12" />
              </svg>
              {scanMatches.length} scanned
            </button>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: QR Code + Sessions ── */}
        <div style={{
          width: 320,
          minWidth: 320,
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          {/* QR Code + Connection */}
          {networkInfo && networkInfo.ip !== '127.0.0.1' ? (
            <div style={{ padding: 20, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>
                Scan with your phone camera
              </p>
              <div style={{
                background: 'white',
                padding: 16,
                borderRadius: 12,
                border: '2px solid #e2e8f0',
                display: 'inline-block',
              }}>
                <QRCodeSVG value={`${networkInfo.phone_url}?theme=${resolvedTheme}`} size={200} level="M" />
              </div>
              <div style={{
                marginTop: 12,
                padding: '8px 12px',
                background: '#f1f5f9',
                borderRadius: 8,
                fontSize: 13,
                color: '#334155',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}>
                {networkInfo.phone_url}
              </div>

              {/* Connection mode badges */}
              <div style={{ marginTop: 10, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {httpsEnabled && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                  }}>HTTPS (iOS Ready)</span>
                )}
                {hotspotActive && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                    background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                  }}>{t('photoTransfer.hotspotActive')}</span>
                )}
              </div>

              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                Phone must be on the same network as this PC
              </p>
            </div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#fef3c7', margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>No Network Detected</p>
              <p style={{ fontSize: 12, color: '#b45309', marginTop: 4 }}>
                Connect to WiFi or use the hotspot button below to create a direct connection.
              </p>
            </div>
          )}

          {/* ── Hotspot Controls ── */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{t('photoTransfer.laptopHotspot')}</span>
              </div>
              <button
                onClick={toggleHotspot}
                disabled={hotspotLoading}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: hotspotActive ? '#fef2f2' : '#eff6ff',
                  color: hotspotActive ? '#dc2626' : '#2563eb',
                  opacity: hotspotLoading ? 0.6 : 1,
                }}
              >
                {hotspotLoading ? '...' : hotspotActive ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
            {hotspotActive && hotspotInfo && (
              <div style={{
                padding: '8px 12px', borderRadius: 8,
                background: '#f8fafc', fontSize: 12, color: '#475569',
              }}>
                <div>Network: <strong>{hotspotInfo.ssid}</strong></div>
                <div>Password: <strong>{hotspotInfo.password}</strong></div>
              </div>
            )}
            {!hotspotActive && (
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                No WiFi? Turn on hotspot and connect your phone to it.
              </p>
            )}
          </div>

          {/* Sessions */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>Sessions</h3>
              <button
                onClick={() => setShowNewSession(true)}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0',
                  background: 'white', fontSize: 12, fontWeight: 600, color: '#2563eb', cursor: 'pointer',
                }}
              >
                + New
              </button>
            </div>

            {showNewSession && (
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Session name (e.g. Mrs. Johnson - Math)"
                  onKeyDown={e => e.key === 'Enter' && createSession()}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: '2px solid #e2e8f0', fontSize: 14, marginBottom: 8,
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  autoFocus
                />
                <button
                  onClick={createSession}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    background: '#2563eb', color: 'white', border: 'none',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Create Session
                </button>
              </div>
            )}

            {sessions.map(s => (
              <SessionItem
                key={s.id}
                session={s}
                isActive={activeSession?.id === s.id}
                onSelect={() => {
                  setActiveSession(s);
                  setPhotos(s.photos || []);
                  setShowNewSession(false);
                  setSelectedPhoto(null);
                  resetScanTracker();
                }}
                onDelete={(e) => deleteSession(s, e)}
              />
            ))}

            {sessions.length === 0 && !showNewSession && (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 16 }}>
                No sessions yet. Create one or scan QR from your phone.
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Photo Grid ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {activeSession ? (
            <>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    {activeSession.session_name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                    {activeSession.date} &middot; {photos.length} photo{photos.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Open the session folder in file explorer
                    const w = window as any;
                    if (w.electronAPI?.openFileExternal) {
                      w.electronAPI.openFileExternal(activeSession.folder_path);
                    }
                  }}
                  style={{
                    padding: '6px 12px', borderRadius: 8,
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    fontSize: 12, fontWeight: 600, color: '#475569',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  Open Folder
                </button>
              </div>

              {photos.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  color: '#94a3b8',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>Waiting for photos...</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Scan the QR code on the left with your phone to start sending photos</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 12,
                }}>
                  {photos.map(photo => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      photoUrl={photoUrl(photo)}
                      isSelected={selectedPhoto?.id === photo.id}
                      onSelect={() => setSelectedPhoto(photo)}
                      onDelete={() => deletePhoto(photo)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              color: '#94a3b8',
            }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{t('photoTransfer.createSession')}</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                Or scan the QR code from your phone — a session will be created automatically.
              </p>
            </div>
          )}
        </div>

        {/* ── Photo detail sidebar ── */}
        {selectedPhoto && activeSession && !gradingResults && (
          <div style={{
            width: 320,
            minWidth: 320,
            background: 'white',
            borderLeft: '1px solid #e2e8f0',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>Photo Detail</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: '1px solid #e2e8f0', background: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <img
                src={photoUrl(selectedPhoto)}
                alt={selectedPhoto.filename}
                style={{
                  width: '100%', borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />

              <div style={{ marginTop: 16 }}>
                <DetailRow label="Filename" value={selectedPhoto.filename} />
                <DetailRow label="Size" value={`${(selectedPhoto.size_bytes / 1024).toFixed(1)} KB`} />
                <DetailRow label="Uploaded" value={new Date(selectedPhoto.uploaded_at).toLocaleTimeString()} />
              </div>

              <button
                onClick={() => deletePhoto(selectedPhoto)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 16,
                }}
              >
                Delete Photo
              </button>
            </div>
          </div>
        )}

        {/* ── Grading Results Sidebar ── */}
        {gradeMode && gradingResults && (
          <div style={{
            width: 360,
            minWidth: 360,
            background: 'white',
            borderLeft: '1px solid #e2e8f0',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>{t('photoTransfer.gradingResults')}</h3>
                <button
                  onClick={() => { setGradingResults(null); setGradingSummary(null); }}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: '1px solid #e2e8f0', background: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Summary card */}
              {gradingSummary && (
                <div style={{
                  padding: 12, borderRadius: 8,
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: 'white', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{gradingSummary.class_average}%</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{t('photoTransfer.classAverage')}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
                    <span>Graded: {gradingSummary.graded}</span>
                    <span>Failed: {gradingSummary.failed}</span>
                    <span>Total: {gradingSummary.total}</span>
                  </div>
                </div>
              )}

              {/* Individual results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gradingResults.map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 10, borderRadius: 8,
                      border: `1px solid ${result.error ? '#fecaca' : '#e2e8f0'}`,
                      background: result.error ? '#fef2f2' : '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                          {result.student_name || result.file_name}
                        </div>
                        {result.student_id && (
                          <div style={{ fontSize: 11, color: '#64748b' }}>ID: {result.student_id}</div>
                        )}
                      </div>
                      {!result.error && (
                        <div style={{
                          padding: '4px 10px', borderRadius: 12,
                          background: result.percentage >= 70 ? '#f0fdf4' : result.percentage >= 50 ? '#fefce8' : '#fef2f2',
                          color: result.percentage >= 70 ? '#16a34a' : result.percentage >= 50 ? '#ca8a04' : '#dc2626',
                          fontSize: 13, fontWeight: 700,
                        }}>
                          {result.percentage}% ({result.letter_grade})
                        </div>
                      )}
                    </div>
                    {result.error && (
                      <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{result.error}</div>
                    )}
                    {!result.error && (
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                        Score: {result.score}/{result.total_points}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* ── Scan Tracker Panel ── */}
        {gradeMode && showScanPanel && scanMatches.length > 0 && !gradingResults && (
          <div style={{
            width: 360,
            minWidth: 360,
            background: 'white',
            borderLeft: '1px solid #e2e8f0',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>Scan Tracker</h3>
                <button
                  onClick={() => setShowScanPanel(false)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: '1px solid #e2e8f0', background: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Summary */}
              <div style={{
                padding: 12, borderRadius: 8,
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: 'white', marginBottom: 16,
              }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{scanMatches.length}</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{t('photoTransfer.documentsScanned')}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  {(() => {
                    const docIds = new Set(scanMatches.map(m => m.doc_id));
                    return `${docIds.size} unique document${docIds.size !== 1 ? 's' : ''}`;
                  })()}
                </div>
              </div>

              {/* Document groups */}
              {(() => {
                const groups = new Map<string, ScanMatch[]>();
                for (const m of scanMatches) {
                  const key = m.doc_id || 'unknown';
                  if (!groups.has(key)) groups.set(key, []);
                  groups.get(key)!.push(m);
                }

                return Array.from(groups.entries()).map(([docId, matches]) => {
                  const first = matches[0];
                  const expected = expectedStudents.get(docId) || [];
                  const scannedIds = new Set(matches.map(m => m.student_id));
                  const title = first.doc_title || docId;
                  const subtitle = [first.doc_subject, first.doc_grade ? `Grade ${first.doc_grade}` : ''].filter(Boolean).join(' - ');
                  const progressPct = expected.length > 0 ? Math.round((scannedIds.size / expected.length) * 100) : 0;

                  return (
                    <div key={docId} style={{
                      marginBottom: 16, padding: 12, borderRadius: 8,
                      border: '1px solid #e2e8f0', background: '#fafafa',
                    }}>
                      {/* Doc header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          background: first.doc_type === 'quiz' ? '#eff6ff' : '#f0fdf4',
                          color: first.doc_type === 'quiz' ? '#2563eb' : '#16a34a',
                          border: `1px solid ${first.doc_type === 'quiz' ? '#bfdbfe' : '#bbf7d0'}`,
                        }}>
                          {first.doc_type}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {title}
                          </div>
                          {subtitle && <div style={{ fontSize: 11, color: '#64748b' }}>{subtitle}</div>}
                        </div>
                      </div>

                      {/* Progress bar */}
                      {expected.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                            <span>{scannedIds.size} of {expected.length} students</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 3,
                              background: progressPct === 100 ? '#16a34a' : '#2563eb',
                              width: `${progressPct}%`,
                              transition: 'width 0.3s ease',
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Student list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Scanned students */}
                        {matches.map((m, idx) => (
                          <div key={`${m.student_id}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                              {m.student_name || m.student_id}
                            </span>
                          </div>
                        ))}

                        {/* Pending students (not yet scanned) */}
                        {expected
                          .filter(s => !scannedIds.has(s.student_id))
                          .map(s => (
                            <div key={s.student_id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', opacity: 0.45 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              <span style={{ fontSize: 12, color: '#64748b' }}>
                                {s.full_name || s.student_id}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ── Scan Toast Notifications ── */}
      {scanToasts.length > 0 && (
        <div style={{
          position: 'fixed', top: 16, right: 16,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 1000, pointerEvents: 'none',
        }}>
          {scanToasts.map(toast => (
            <div key={toast.id} style={{
              padding: '10px 16px', borderRadius: 10,
              background: 'white', border: '1px solid #bbf7d0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', gap: 10,
              animation: 'slideIn 0.3s ease',
              minWidth: 280,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{toast.message}</div>
                {toast.detail && <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{toast.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// ── Session item with hover delete ──────────────────────────────────────────

const SessionItem: React.FC<{
  session: Session;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}> = ({ session, isActive, onSelect, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        marginBottom: 4,
        cursor: 'pointer',
        background: isActive ? '#eff6ff' : 'transparent',
        border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session.session_name}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
          {session.date} &middot; {session.photo_count} photo{session.photo_count !== 1 ? 's' : ''}
        </div>
      </div>
      {hovered && (
        <button
          onClick={onDelete}
          title="Delete session"
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            border: 'none',
            background: 'rgba(220,38,38,0.1)',
            color: '#dc2626',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// ── Photo card with hover delete ────────────────────────────────────────────

const PhotoCard: React.FC<{
  photo: Photo;
  photoUrl: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ photo, photoUrl, isSelected, onSelect, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        background: 'white',
        border: isSelected ? '2px solid #2563eb' : '2px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
        position: 'relative',
      }}
    >
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(220,38,38,0.9)',
            border: 'none',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          title="Delete photo"
        >
          &times;
        </button>
      )}
      <div style={{
        width: '100%', aspectRatio: '4/3', overflow: 'hidden',
        background: '#f1f5f9',
      }}>
        <img
          src={photoUrl}
          alt={photo.filename}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {`Photo ${photo.index}`}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          {(photo.size_bytes / 1024).toFixed(0)} KB
        </div>
      </div>
    </div>
  );
};

// ── Detail row ───────────────────────────────────────────────────────────────

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
  </div>
);

export default PhotoReceiver;
