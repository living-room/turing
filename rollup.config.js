import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
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
    replace({
      'process.env.ROOMDB_URI': (process.env.ROOMDB_URI ? JSON.stringify(process.env.ROOMDB_URI) : 'null')
    }),
    resolve(),
    commonjs({include: './node_modules/**'})
  ]
}
