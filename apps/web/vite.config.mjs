import { defineConfig } from 'vite';
import { productionGuard } from '../../scripts/production-guard.mjs';
export default defineConfig({ plugins: [productionGuard()] });
