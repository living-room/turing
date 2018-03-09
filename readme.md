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

    // Produce a string version of the results for the debugger to use
    animalFacts = solutions.map(animal => JSON.stringify(animal))
  })

// Query for "bugnets", locations where someone has physically placed a debugger.
room
  .subscribe(`there is a $bugnet bugnet at $x $y $xx $yy`)
  .on(({queries, solutions}) => {
    bugnets = []

    solutions.forEach(bugnet => {
      let [bugnetType, x, y, xx, yy] = [
        bugnet.bugnet.word,
        bugnet.x.value,
        bugnet.y.value,
        bugnet.xx.value,
        bugnet.yy.value
      ]
      let description = `Bugnet at ${x}, ${y}`

      // We only visualize the last bugnet returned by the query.
      // Previously we would build up an array of all the
      // bugnets we saw, but that got too messy.
      bugnets = [{bugnetType, x, y, xx, yy, description}]
    })
  })
```

#### developing

install dependencies with `yarn`

mess around with [room.js](./room.js)

build the [umd](https://github.com/umdjs/umd) library `yarn build`

for a nicer development experience, try using `yarn dev`, which will build on file change

To test the browser example locally, run `yarn backend` to start a room-http backend, and `yarn examples` to run the example frontend.
