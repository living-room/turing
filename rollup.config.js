import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import resolve from 'rollup-plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import pkg from './package.json'

export default [{
  external: ['node-fetch', 'socket.io-client'],
  input: 'src/room.js',
  output: {
    name: 'room',
    file: pkg.main,
    format: 'cjs',
    sourcemap: true,
    globals: {
      'node-fetch': 'fetch',
      'socket.io-client': 'io'
    }
  }
}, {
  external: ['node-fetch', 'socket.io-client'],
  input: 'src/room.js',
  output: {
    name: 'room',
    file: 'build/room.browser.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      'node-fetch': 'fetch',
      'socket.io-client': 'io'
    }
  },
  plugins: [
    resolve({
       // pass custom options to the resolve plugin
      jsnext: true,
      main: true,
      preferBuiltins: true
    }),
    globals(),
    builtins(),
    commonjs({
      include: 'node_modules/**',
      ignoreGlobal: false
    })
  ]
}]
