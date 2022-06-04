import { resolve } from "path";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const rootJestConfig: import("@jest/types").Config.InitialOptions = {
  displayName: "unit-tests",
  rootDir: resolve(__dirname),
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  bail: true,
  transform: {
    "^.+\\.(t)s?$": "@swc/jest",
  },
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
};

export default rootJestConfig;
