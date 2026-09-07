// Prevent errors when third-party libraries try to reassign window.fetch (e.g. in some iframe/sandboxed environments)
try {
  if (typeof window !== "undefined" && window.fetch) {
    const originalFetch = window.fetch;
    let customFetch = originalFetch;
    Object.defineProperty(window, "fetch", {
      get() {
        return customFetch;
      },
      set(value) {
        customFetch = value;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (e) {
  console.warn("Could not patch window.fetch:", e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
