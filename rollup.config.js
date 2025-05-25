import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
    terser(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    copy({
      targets: [
        { src: 'public/**/*', dest: 'dist' },
        { src: 'src/index.html', dest: 'dist' }
      ]
    })
  ]
};
