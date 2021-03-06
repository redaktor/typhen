/// <reference path='../typings/bundle.d.ts' />

import ts = require('typescript');
import Environment = require('./environments/environment');
import Logger = require('./logger');

class CompilerHost implements ts.CompilerHost {
  private cachedSources: {[index: string]: ts.SourceFile} = {};
  private version: number = 0;

  constructor(private env: Environment) {
  }

  public getSourceFile(fileName: string, languageVersion: ts.ScriptTarget,
      onError?: (message: string) => void): ts.SourceFile {
    if (this.cachedSources[fileName] === undefined) {
      var text: string;

      try {
        text = this.env.readFile(fileName);
      } catch (e) {
        return undefined;
      }
      this.cachedSources[fileName] = ts.createSourceFile(fileName, text,
          languageVersion, this.version.toString(), false);
    }
    return this.cachedSources[fileName];
  }

  public getDefaultLibFilename(): string {
    return this.env.defaultLibFileName;
  }

  public writeFile(fileName: string, data: string, writeByteOrderMark: boolean,
      onError?: (message: string) => void): void {
    Logger.debug('Skip to write: ' + fileName);
  }

  public getCurrentDirectory(): string {
    return this.env.currentDirectory;
  }

  public useCaseSensitiveFileNames(): boolean {
    return this.env.useCaseSensitiveFileNames;
  }

  public getCanonicalFileName(fileName: string): string {
    return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
  }

  public getNewLine(): string {
    return this.env.newLine;
  }
}

export = CompilerHost;
