#!node --experimental-modules

import Room from '../build/room.js'

const room = new Room()

room
  .select(process.argv[process.argv.length - 1])
  .do(console.log)
