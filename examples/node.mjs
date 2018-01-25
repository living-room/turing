#!node --experimental-modules

import Room from '../build/room.js'

// Connects to http://localhost:3000 by default
// You can also pass via ROOMDB_URI in your environment
const room = new Room()

room
  .assert(`#You am a doggo`)
  .assert(`#I am a pupper`)
  .select(`$who am a $what`)
  .do(({who, what}) => {
    console.log(`roomdb thinks ${who.name} is a ${what.str}`)
  })
