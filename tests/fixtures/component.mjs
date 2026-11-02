import { createElement as h, useSyncExternalStore } from 'react';
import { fixtureId } from './session.mjs';
export const messages = {
  en: {
    title: 'Browser test fixture',
    next: 'Next step',
    reset: 'Reset fixture',
  },
  nl: {
    title: 'Browsertestfixture',
    next: 'Volgende stap',
    reset: 'Fixture herstellen',
  },
};
export function Fixture({ session, locale = 'en' }) {
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot);
  const copy = messages[locale];
  return h(
    'main',
    null,
    h('h1', null, copy.title),
    h('p', null, fixtureId),
    h('output', { 'aria-live': 'polite' }, snapshot),
    h(
      'button',
      { onClick: session.advance, disabled: snapshot === 'complete' },
      copy.next,
    ),
    h('button', { onClick: session.reset }, copy.reset),
  );
}
