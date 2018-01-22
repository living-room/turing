#!node --experimental-modules

import Room from '../build/room.js'

// connects to http://localhost:3000 by default
const room = new Room()

room.assert(`#You am a doggo`)
room.assert(`#I am a pupper`)

room
  .select(`$who am a $what`)
  .then(({solutions}) => {
    solutions.forEach(({who, what}) => {
      console.log(`roomdb thinks ${who.name} is a ${what.str}`)
    })
  })

// How can we do this?
//
// room
//  .select(`$who am a $what`)
//  .do(({who, what}) => {
//    console.log(`roomdb thinks ${who.name} is a ${what.str}`)
//  })
