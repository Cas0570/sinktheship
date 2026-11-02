import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createFixtureSession } from '../fixtures/session.mjs';
import { Fixture } from '../fixtures/component.mjs';
const locale = location.pathname === '/nl' ? 'nl' : 'en';
document.documentElement.lang = locale;
createRoot(document.getElementById('root')).render(
  createElement(
    StrictMode,
    null,
    createElement(Fixture, { session: createFixtureSession(), locale }),
  ),
);
