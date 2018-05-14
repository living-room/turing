module.exports = room => {
  return
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  let start = new Date()

  const ioHook = require('iohook')

  // TODO: get window size programattically, and listen to screen size changes
  const windowSize = { width: 1920, height: 1080 }

  const lastMousePositions = []

  ioHook.on('mousemove', event => {
    if (new Date() - start < 16) return
    start = new Date()

    const x = event.x / windowSize.width
    const y = event.y / windowSize.height

    lastMousePositions.unshift({ x, y })

    if (lastMousePositions.length > 9) lastMousePositions.pop()

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    for (let [i, pos] of lastMousePositions.entries()) {
      const b = 255 - i * 10
      const r = 30 - i * 2
      const l = alphabet[i]
      const { x, y } = pos
      const fact = `mouse${l} is a (${b}, ${b}, ${b}) circle at (${x}, ${y}) with radius ${r}`

      console.log({ fact })
      room.assert(fact).then(console.dir)

      const timeout = 100 * (10 - i)
      setTimeout(() => {
        room.retract(fact)
      }, timeout)
    }
  })

  room.subscribe(
    [`mouse is active`, `mouse$ is at ($x, $y)`],
    ({ assertions, retractions }) => {
      const update = ({ x: { value: x }, y: { value: y } }, fn) => {
        fn(`whiteboard: draw a (127, 127, 255) halo around ${x}, ${y}`)
      }

      assertions.forEach(assertion => update(assertion, room.assert.bind(room)))
      retractions.forEach(retraction =>
        update(retractions, room.retract.bind(room))
      )
    }
  )

  room.subscribe(`mouse is active`, ({ assertions }) => {
    ;(assertions.length && ioHook.start()) || ioHook.stop()
  })
}
