# room-js

a universal javascript client that talks to a [roomdb](https://github.com/alexwart/roomdb) http [server](https://github.com/jedahan/room-http)

It works in node or the browser

ROOMDB_URI defaults to http://localhost:3000

#### examples

from [examples/node.mjs](./examples/node.mjs)

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

To test the browser example, use `yarn serve`
