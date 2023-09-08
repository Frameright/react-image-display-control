// Inspired by
// https://github.com/jaredpalmer/tsdx/blob/2d7981b/src/createRollupConfig.ts

// Import rollup plugins
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import path from 'path';

const outputOptions = {
  all: {
    inlineDynamicImports: true,
    sourcemap: true,
    globals: { react: 'React' },
  },
  esm: {
    format: 'esm',
    freeze: false,
    esModule: true,
    exports: 'named',
  },
  cjs: {
    format: 'cjs',
  },
  min: {
    plugins: [
      terser({
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10,
        },
        ecma: 2020,
        toplevel: true,
        warnings: true,
      }),
    ],
  },
};

const config = {
  plugins: [
    // Resolve bare module specifiers to relative paths
    resolve(),

    // All bundled external modules need to be converted from CJS to ESM
    commonjs(),

    typescript({
      declarationDir: 'dist',
      compilerOptions: {
        sourceMap: true,
        declaration: true,
        jsx: 'react',
      },
    }),
  ],
  input: './src/index.tsx',
  output: [
    {
      file: './dist/react-image-display-control.mjs',
      ...outputOptions.all,
      ...outputOptions.esm,
    },
    {
      file: './dist/react-image-display-control.min.mjs',
      ...outputOptions.all,
      ...outputOptions.esm,
      ...outputOptions.min,
    },
    {
      file: './dist/react-image-display-control.cjs',
      ...outputOptions.all,
      ...outputOptions.cjs,
    },
    {
      file: './dist/react-image-display-control.min.cjs',
      ...outputOptions.all,
      ...outputOptions.cjs,
      ...outputOptions.min,
    },
  ],
  external: (id) => {
    return !id.startsWith('.') && !path.isAbsolute(id);
  },
};

export default config;
