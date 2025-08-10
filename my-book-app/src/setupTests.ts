// src/setupTests.ts
import '@testing-library/jest-dom/vitest';

// Extend Vitest's expect with jest-dom matchers
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
