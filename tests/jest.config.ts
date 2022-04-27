import { pathsToModuleNameMapper } from "ts-jest";

import rootConfig from "../jest.config";
import { compilerOptions } from "../tsconfig.json";

export default {
  ...rootConfig,
  ...{
    displayName: "end2end",
    setupFilesAfterEnv: ["<rootDir>/jestSetup.ts"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/..",
    }),
    testMatch: ["<rootDir>/**/*.spec.ts"],
  },
};
