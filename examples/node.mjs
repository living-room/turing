#!node --experimental-modules

import Room from '../build/room.js'

// connects to http://localhost:3000 by default
const room = new Room()

room
  .assert(`#I am a cat`)
  .then(({id}) => console.log(`my id is ${id}`))

room
  .select(`#I am a $what`)
  .then(({what}) => {
    console.log(`roomdb thinks I am a`, what)
  })
