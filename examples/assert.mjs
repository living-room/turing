#!node --experimental-modules

import Room from '../build/room.js'

const room = new Room()

room.assert(process.argv[process.argv.length - 1])
