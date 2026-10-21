import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : (error && error.type ? `DOM Event: ${error.type}` : 'Application error');
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    const normalized = error instanceof Error ? error : new Error(String(error?.message || error?.type || error));
    console.warn('[QR Studio Pro] Handled boundary exception:', normalized.message, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('qr_studio_draft_v2');
      localStorage.removeItem('qr_studio_draft');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#0f172a',
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg style={{ width: '24px', height: '24px', stroke: '#2563eb', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              QR Studio Pro Recovery
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              The application encountered a browser-side state issue. Click below to refresh your session smoothly.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Reload Studio
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global listener to suppress unhandled DOM Event rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason === 'object' && ('isTrusted' in event.reason || event.reason instanceof Event)) {
    console.warn('[QR Studio Pro] Handled unhandled DOM Event rejection gracefully:', event.reason.type || 'Event');
    event.preventDefault();
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
