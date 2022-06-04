import { resolve } from "path";
import { pathsToModuleNameMapper } from "ts-jest";

import unitConfig from "../jest.config";
import { compilerOptions } from "../tsconfig.json";

const integrationJestConfig: import("@jest/types").Config.InitialOptions = {
  ...unitConfig,
  ...{
    rootDir: resolve(__dirname),
    displayName: "integration-tests",
    setupFilesAfterEnv: ["<rootDir>/jestSetup.ts"],
    collectCoverage: false,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/..",
    }),
    testMatch: ["<rootDir>/**/*.spec.ts"],
  },
};

export default integrationJestConfig;
