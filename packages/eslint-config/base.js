import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const restrictedConsumers = [
  'packages/{opponents,opponent-neural}/src/**/*.{ts,tsx}',
  'apps/web/src/{routes,components,store}/**/*.{ts,tsx}',
];
const privateNames = [
  'GameState',
  'GameBase',
  'PlacingState',
  'PlayingState',
  'FinishedState',
  'PrivateShotRecord',
  'GameCommand',
  'GameEvent',
  'EngineResult',
  'createGame',
  'applyCommand',
  'projectPlayerView',
  'projectGameEvents',
];
const coreModule = '[source.value=/^@sinktheship\\//]';

export default defineConfig(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '.artifacts/**'],
  },
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    rules: { '@typescript-eslint/consistent-type-imports': 'error' },
  },
  {
    files: [
      '**/*.{js,mjs,cjs}',
      '**/test/**/*.{ts,tsx}',
      'scripts/**/*.{ts,tsx}',
      '*.config.ts',
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}', 'packages/ui/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['packages/benchmark/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/game-core/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...[
          'Date',
          'globalThis',
          'window',
          'document',
          'process',
          'Buffer',
          'console',
          'setTimeout',
          'setInterval',
          'queueMicrotask',
          'requestAnimationFrame',
          'fetch',
          'XMLHttpRequest',
          'WebSocket',
          'Worker',
          'crypto',
          'performance',
          'localStorage',
          'sessionStorage',
        ].map((name) => ({
          name,
          message:
            'Keep game-core pure; inject randomness and time through ports.',
        })),
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Use the injected Rng.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Identifier[name='Math']:not(MemberExpression > Identifier.object)",
          message: 'Do not alias Math; use deterministic named operations.',
        },
        {
          selector: "MemberExpression[object.name='Math'][computed=true]",
          message:
            'Use deterministic named Math operations, not computed access.',
        },
      ],
    },
  },
  {
    files: restrictedConsumers,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@sinktheship/*'],
              importNamePattern: '^(Private.*|.*Checkpoint)$',
              message:
                'Private records and checkpoints belong to the session and privileged adapters.',
            },
          ],
          paths: [
            {
              name: '@sinktheship/game-core',
              importNames: privateNames,
              message:
                'Use public views and pure geometry; private engine state belongs to the session.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: `ImportDeclaration${coreModule} > ImportNamespaceSpecifier`,
          message:
            'Use named public imports; namespace imports bypass symbol restrictions.',
        },
        {
          selector: `ImportDeclaration${coreModule} > ImportDefaultSpecifier`,
          message: 'Use named public imports.',
        },
        {
          selector: `ExportAllDeclaration${coreModule}`,
          message: 'Do not re-export the complete core API.',
        },
        {
          selector: 'ImportExpression[source.value=/^@sinktheship\\//]',
          message: 'Use named static public imports.',
        },
        {
          selector: "CallExpression[callee.name='require']",
          message: 'Use named static public imports.',
        },
        {
          selector: 'TSImportType',
          message:
            'Use named static public type imports so symbol restrictions apply.',
        },
      ],
    },
  },
);
