import React, { useState, useEffect } from 'react';
import '../assets/styles/splash.css';

const STATUSES = [
  "Initializing secure kernel...",
  "Connecting to branch databases...",
  "Syncing inventory manifests...",
  "Loading kitchen workflows...",
  "Verifying manager credentials...",
  "System ready."
];

export default function SplashScreen({ onFinished }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [percent, setPercent] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Status text interval (cycles every 500ms)
    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => {
        if (prev < STATUSES.length - 1) {
          return prev + 1;
        }
        clearInterval(statusInterval);
        return prev;
      });
    }, 500);

    // Percentage progress interval (runs every 80ms)
    const percentInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev < 100) {
          const next = prev + Math.floor(Math.random() * 3) + 1;
          return next > 100 ? 100 : next;
        }
        clearInterval(percentInterval);
        return 100;
      });
    }, 80);

    return () => {
      clearInterval(statusInterval);
      clearInterval(percentInterval);
    };
  }, []);

  useEffect(() => {
    if (percent === 100) {
      // Trigger fade out after 500ms
      const fadeTimer = setTimeout(() => {
        setFade(true);
        // Call parent onFinished callback after the transition ends (800ms)
        const finishTimer = setTimeout(() => {
          onFinished();
        }, 800);
        return () => clearTimeout(finishTimer);
      }, 500);

      return () => clearTimeout(fadeTimer);
    }
  }, [percent, onFinished]);

  return (
    <div className="splash-container" style={{ opacity: fade ? 0 : 1 }}>
      <div className="splash-background">
        <img
          alt="Professional industrial kitchen backdrop"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHni5EIA65I2hPcjWeliYxbME_QoXC_S9TCp4b9U-TNXtkGipBRiCR3Kb4FDBnN-pohB2xdcgWQ0xSKLkx9UYivpxvK0cEQRv_xjfel0pfvUdfuZgZOjjguUSrXM-tXcm5YGchNL0RxnjSCiJM5b2tmHwrxKt9IkzfFNDw0dJ8VZw2AdQGL4Y-FmkdB429zt8ZDoZl-P-t3c2xC8eXSHzJUG4bXxvW035efP9cFWfjmCuDG_2qXa7HD_R0XeukYjZgMGsi5ZUJ-3tS"
        />
        <div className="splash-overlay"></div>
      </div>

      <main className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-logo-box">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant_menu
            </span>
          </div>
          <h1 className="splash-title">Z&amp;M Kitchen</h1>
          <p className="splash-subtitle">Enterprise Suite v4.0</p>
        </div>

        <div className="splash-branches-divider">
          <div className="splash-branch-column">
            <span className="splash-branch-name">Mehdi Kitchen</span>
            <span className="splash-branch-label">North Branch</span>
          </div>
          <div className="splash-line-separator"></div>
          <div className="splash-branch-column">
            <span className="splash-branch-name">Zangmo Kitchen</span>
            <span className="splash-branch-label">South Branch</span>
          </div>
        </div>

        <div className="splash-progress-section">
          <div className="splash-progress-row">
            <div className="splash-status-container">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                sync
              </span>
              <span className="splash-status-text">{STATUSES[statusIdx]}</span>
            </div>
            <span className="splash-percent-text">{percent}%</span>
          </div>
          <div className="splash-progress-bar-container">
            <div className="splash-progress-bar-fill" style={{ width: `${percent}%` }}></div>
          </div>

          <div className="splash-badges-row">
            <div className="splash-badge-item">
              <span className="material-symbols-outlined">wifi</span>
              <span className="splash-badge-text">Connected</span>
            </div>
            <div className="splash-badge-item">
              <span className="material-symbols-outlined">verified_user</span>
              <span className="splash-badge-text">Secure Session</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="splash-footer">
        <p className="splash-footer-copyright">© 2024 Z&amp;M Enterprise Solutions</p>
        <span className="splash-footer-system-id">System ID: ZMK-992-PX</span>
      </footer>
    </div>
  );
}
