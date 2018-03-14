# living-room-js

A universal javascript client that talks to a [living room server](https://github.com/jedahan/living-room-server)

It works in node or the browser, make sure you have a server listening on localhost:3000 or change LIVING_ROOM_URI to point to your server

# commandline app

There is a commandline application for quick testing and as a simple example of how to use this client in **[examples/commandline.js](./examples/commandline.js)**

Try `yarn assert "#something wicked this way comes"`, then `yarn select "$name $adj this way comes"`


#### examples

In addition to [examples/commandline.js](./examples/commandline.js), we have a few other [examples](./examples):

```javascript
#!node --experimental-modules

import Room from '../build/room.js'

const room = new Room() // you can pass in the uri here or in ROOMDB_URI

room
  .assert(`#You am a doggo`)
  .assert(`#I am a pupper`)
  .select(`$who am a $what`)
  .do(({who, what}) => {
    console.log(`roomdb thinks ${who.name} is a ${what.str}`)
  })
```

from [examples/animals/animals.js](./examples/animals/animals.js)

```js
// This is a demo of subscribing to a server query.
// It queries for animals in the database and draws them on screen.

const room = new window.room() // assumes RoomDB http server running on http://localhost:3000
const context = canvas.getContext('2d')
let characters = new Map()
let animalFacts = []

// Set up some demo data
room
  .assert(`#Simba is a cat animal at (0.5, 0.1)`)
  .assert(`#Timon is a meerkat animal at (0.4, 0.6)`)
  .assert(`#Pumba is a warthog animal at (0.55, 0.6)`)

// Query for locations of animals and update our local list
room
  .subscribe(`$name is a $animal animal at ($x, $y)`)
  .on(({queries, solutions}) => {
    solutions.forEach(animal => {
      let [label, x, y] = [animal.name.id, animal.x.value, animal.y.value]
      characters.set(label, {x, y})
    })
  })

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#fff'
  context.font = '40px sans-serif'

  characters.forEach(({x, y}, name) => {
    context.fillText(name, x * canvas.width, y * canvas.height)
  })

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
```

#### developing

install dependencies with `yarn`

mess around with [room.js](./room.js)

build the [umd](https://github.com/umdjs/umd) library `yarn build`

for a nicer development experience, try using `yarn dev`, which will build on file change

To test the browser example locally, run `yarn backend` to start a room-http backend, and `yarn examples` to run the example frontend.
