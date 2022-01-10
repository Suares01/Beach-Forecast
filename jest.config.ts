import { resolve } from 'path';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const root = resolve(__dirname);

export default {
    rootDir: root,
    displayName: 'root-tests',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    testEnvironment: 'node',
    bail: true,
    clearMocks: true,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
    preset: 'ts-jest',
};
