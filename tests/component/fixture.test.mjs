import { createElement, StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Fixture } from '../fixtures/component.mjs';
import { createFixtureSession } from '../fixtures/session.mjs';

test('keyboard steps, completion and reset under StrictMode', async () => {
  const user = userEvent.setup();
  render(
    createElement(
      StrictMode,
      null,
      createElement(Fixture, { session: createFixtureSession() }),
    ),
  );
  expect(screen.getByRole('status')).toHaveTextContent('ready');
  await user.tab();
  expect(screen.getByRole('button', { name: 'Next step' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('status')).toHaveTextContent('advanced');
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  expect(screen.getByRole('status')).toHaveTextContent('complete');
  expect(screen.getByRole('button', { name: 'Next step' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Reset fixture' }));
  expect(screen.getByRole('status')).toHaveTextContent('ready');
});

test('injected sessions are isolated and unmount unsubscribes', () => {
  const first = createFixtureSession();
  const second = createFixtureSession();
  const unsubscribe = vi.fn();
  const subscribe = (listener) => {
    const release = first.subscribe(listener);
    return () => {
      release();
      unsubscribe();
    };
  };
  const view = render(
    createElement(Fixture, { session: { ...first, subscribe }, locale: 'nl' }),
  );
  expect(
    screen.getByRole('heading', { name: 'Browsertestfixture' }),
  ).toBeVisible();
  view.unmount();
  expect(unsubscribe).toHaveBeenCalledOnce();
  first.advance();
  expect(first.getSnapshot()).toBe('advanced');
  expect(second.getSnapshot()).toBe('ready');
});
