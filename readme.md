# living-room-js

A universal javascript client that talks to a [living room server](https://github.com/jedahan/living-room-server)

It works in node or the browser, make sure you have a server listening on localhost:3000 or change LIVING_ROOM_URI to point to your server

# commandline app

There is a commandline application for quick testing and as a simple example of how to use this client in **[examples/commandline.js](./examples/commandline.js)**

Try `yarn assert '#something wicked this way comes'`, then `yarn select '$name $adj this way comes'`


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

from [examples/index.html](./examples/index.html)

```html
<html>
  <head>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
  </head>
  <body>
    <canvas id="canvas"></canvas>

    <script src="room.js"></script>
    <script>
      const room = new window.room() // assumes RoomDB http server running on http://localhost:3000
      const context = canvas.getContext('2d')
      let things = []

      room
        .assert(`Simba is a cat at (50, 50)`)
        .assert(`Timon is a meerkat at (100, 77)`)
        .assert(`Pumba is a warthog at (66, 77)`)

      window.setInterval(() => {
        room
          .select(`$name is a $thing at ($x, $y)`)
          .doAll(matches => things = matches)
      }, 1000)

      async function draw (time) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        context.clearRect(0, 0, canvas.width, canvas.height)
        things.forEach(({name, x, y}) => context.fillText(name.str, x, y))
        requestAnimationFrame(draw)
      }

      requestAnimationFrame(draw)
    </script>
  </body>
</html>
```

#### developing

install dependencies with `yarn`

mess around with [room.js](./room.js)

build the [umd](https://github.com/umdjs/umd) library `yarn build`

for a nicer development experience, try using `yarn dev`, which will build on file change

To test the browser example locally, run `yarn backend` to start a room-http backend, and `yarn examples` to run the example frontend.
