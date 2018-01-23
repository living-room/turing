#!node --experimental-modules

import Room from '../build/room.js'

// connects to http://localhost:3000 by default
const room = new Room()

room
  .assert(`#You am a doggo`)
  .assert(`#I am a pupper`)
  .select(`$who am a $what`)
  .do(({who, what}) => {
    console.log(`roomdb thinks ${who.name} is a ${what.str}`)
  })
