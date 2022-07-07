import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-import-css';

export default {
  input: 'src/LandingMonitor.tsx',
  output: {
    dir: 'build',
    format: 'es'
  },
  plugins: [
    css({ output: 'LandingMonitor.css' }),
    resolve(),
    typescript()
  ]
}
