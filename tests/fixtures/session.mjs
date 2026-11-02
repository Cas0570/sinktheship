// Scripted bootstrap fixture, not a game engine or SessionPort implementation.
export const fixtureId = 'STS_TEST_ONLY_TRANSCRIPT_V1';
const transcript = Object.freeze(['ready', 'advanced', 'complete']);
export function createFixtureSession() {
  let position = 0;
  const listeners = new Set();
  const publish = () => listeners.forEach((listener) => listener());
  return {
    getSnapshot: () => transcript[position],
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    advance() {
      position = Math.min(position + 1, transcript.length - 1);
      publish();
    },
    reset() {
      position = 0;
      publish();
    },
  };
}
