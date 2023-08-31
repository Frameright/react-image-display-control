// Inspired by
// https://github.com/jaredpalmer/tsdx/blob/2d7981b/src/createRollupConfig.ts

// Import rollup plugins
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

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
      file: './dist/react-image-display-control.esm.js',
      ...outputOptions.all,
      ...outputOptions.esm,
    },
    {
      file: './dist/react-image-display-control.esm.min.js',
      ...outputOptions.all,
      ...outputOptions.esm,
      ...outputOptions.min,
    },
    {
      file: './dist/react-image-display-control.cjs.js',
      ...outputOptions.all,
      ...outputOptions.cjs,
    },
    {
      file: './dist/react-image-display-control.cjs.min.js',
      ...outputOptions.all,
      ...outputOptions.cjs,
      ...outputOptions.min,
    },
  ],
  external: ['react', 'react-dom'],
};

export default config;
