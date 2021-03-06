/// <reference path="../../typings/bundle.d.ts" />

interface Environment {
  currentDirectory: string;
  newLine: string;
  useCaseSensitiveFileNames: boolean;
  defaultLibFileName: string;

  readFile(fileName: string): string;
  writeFile(fileName: string, data: string): void;
  resolvePath(...pathSegments: string[]): string;
  relativePath(...pathSegments: string[]): string;
  dirname(fileName: string): string;
  exists(fileName: string): boolean;
  glob(pattern: string, cwd?: string): string[];
}

export = Environment;
