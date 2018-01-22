room is a javascript client for talking to a roomdb server

it works in node or the browser

requires a running roomdb server

#### examples

from [examples/node.mjs](./examples/node.mjs)

```javascript
#!node --experimental-modules

import Room from './build/room.js'

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
```

from [examples/browser.html](./examples/browser.html)

```html
<html>
  <head>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
  </head>
  <body>
    <canvas id="canvas"></canvas>

    <script src="./build/room.js"></script>
    <script>
      const room = new window.room() // assumes RoomDB http server running on http://localhost:3000
      const context = canvas.getContext('2d')
      let things = []

      room
        .assert(`Simba is a cat at (50, 50)`)
        .then(({data}) => console.log(`My id is ${data.id}`))

      window.setInterval(
        room
          .select(`$name is a $thing at ($x, $y)`)
          .then(({data}) => { things = data })
        , 100
      )

      async function draw (time) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        context.clearRect(0, 0, canvas.width, canvas.height)
        things.forEach(thing => ctxt.fillText(...thing))
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

for a nicer development experience, try using `yarn dev`

to test the browser example, use `yarn serve`

this will build automatically on file changes
