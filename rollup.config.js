import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'

export default {
  external: ['node-fetch'],
  input: 'src/room.js',
  output: {
    name: 'room',
    file: pkg.main,
    format: 'umd',
    sourcemap: true,
    globals: {
      'node-fetch': 'fetch'
    }
  },
  plugins: [
    resolve(),
    commonjs({include: './node_modules/**'})
  ]
}
