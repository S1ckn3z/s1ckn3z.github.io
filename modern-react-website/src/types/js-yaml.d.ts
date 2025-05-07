// src/types/js-yaml.d.ts
declare module 'js-yaml' {
    export interface YAMLException extends Error {
      mark?: {
        line: number;
        column: number;
        position: number;
      };
    }
    
    export function load(input: string, options?: any): any;
    export function dump(input: any, options?: any): string;
  }