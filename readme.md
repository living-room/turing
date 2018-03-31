# living-room-js

A javascript package that makes it easy to talk with a [living room server](https://github.com/jedahan/living-room-server)

It works in node or the browser, and looks for a server at `LIVING_ROOM_URI` (default `localhost:3000`.

# getting started

First install this codebase

```bash
git clone https://github.com/jedahan/living-room-js
cd living-room-js
npm install
```

## Test that it works

This repository contains some example applications that talk with a room. To make sure communication is working, let's start the server, and see that one of the applications work.

```bash
npm start
```

This should copy [http://localhost:5000]() to your clipboard. Navigate to *[http://localhost:5000/animals]()*, and if everything is working, **Timon**, **Pumba**, and **Simba** will just be chilling in your browser. If not, please [file an issue](https://github.com/jedahan/living-room-js/issues/new).


## Add a new animal from the commandline

The living room server is running at http://localhost:3000 (over HTTP and Socket.io), and osc://localhost:41234 . Let's send some commands to add more animals to the browser window:

```bash
curl -d 'facts=alice is a human animal at (0.33, 0.22)' localhost:3000/assert
```

The visualization should now show alice near the top left of the screen

## 'Sense' some more animals

Coming up with creative names and animal species and locations is tedious, so we've created a fake sensor that 'sees' other animals for us. In **[examples/sensor.js][example-sensor]** we wrote a small script that sees random animals and prints them out on the commandline. Try running it!

```bash
node examples/sensor.js
```

You should see some animals being printed out

![example-sensor]

## Connect the sensor

This fake sensor is for debugging purposes - in lovelace we have a few sensors that [detect and track color][color-sensor], and [share the locations of objects in the room][yolo-sensor].

In this case, we are gonna use xargs and curl together to put them on the server

```bash
node examples/sensor.js | xargs -I {} curl -d "facts={}" localhost:3000/assert
```

This should start randomly adding some more animals to the canvas!

## How do we visualize things?

So we added some facts to the server, but like, how does the canvas react to that? Or maybe someone else wrote a sensor and you want to do something fun with it.

First, we'll want to see what the room has heard (if the server is not running, just do `npm start`)

```bash
curl http://localhost:3000/facts
```

You might see a bunch of strings like "Simba is a cat at (0.5, 0.5)" and "Elnora is a Xiphosura at (0.0676, 0.8081)".

Lets say we want a list of animal types, we can use pattern matching with the `$` symbol:

```bash
# note: the single quotes are VERY IMPORTANT in the terminal
curl -d 'facts=$name is a $species animal at ($x, $y)' localhost:3000/select

```

This is neat, but we want to do something with the browser and maybe make it more performant. The client library has support for subscriptions! See the html in **[examples/]()** for more information, but the general gist is:

```javascript
room
  .subscribe(`$name is a $species animal at ($x, $y)`, ({assertions} => {
    assertions.forEach(assertion => {
      console.log(`something new!`)
      console.dir(assertion)
    })
  })
```

# examples

In addition to [examples/commandline.js](./examples/commandline.js), we have a few other [examples](./examples):

```javascript
const Room = require('../build/room.js')

const room = new Room() // you can pass in the uri here or in LIVING_ROOM_URI

room
  .assert(`You am a doggo`)
  .assert(`I am a pupper`)
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
  .assert(`Simba is a cat animal at (0.5, 0.1)`)
  .assert(`Timon is a meerkat animal at (0.4, 0.6)`)
  .assert(`Pumba is a warthog animal at (0.55, 0.6)`)

// Query for locations of animals and update our local list
room
  .subscribe(`$name is a $animal animal at ($x, $y)`)
  .on(({selection, assertions, retractions}) => {
    assertions.forEach(animal => {
      let [label, x, y] = [animal.name.word, animal.x.value, animal.y.value]
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

install dependencies

    npm install

build [node.js](./build/room.js) and [browser](./build/room.browser.js) libraries on changes

    npm dev

test the browser example (with living-room-server started by `npm dev`)

    open http://localhost:3000

![example-sensor]: (./images/example-sensor.png)
[color-sensor]: https://github.com/jedahan/colorTracker
[yolo-sensor]: https://github.com/jedahan/yoloSensor
[example-sensor]: (./examples/sensor.js)