module.exports = async room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  let buf = []

  room.subscribe([
    `keyboardIlluminator is active`,
    `$mac got input event type $type with code $code and value $value @ $seq`
  ], ({ assertions }) => {
    assertions.forEach(({code, type, value}) => {
      if (code.value !== 4) return
      if (type.value !== 4) return
      console.log(buf.join(''))
      room.retract(`whiteboard: draw small text "${buf.join(' ')}" at (0.05, 0.60)`)
      buf.push(value.value - 458700)
      room.assert(`whiteboard: draw small text "${buf.join(' ')}" at (0.05, 0.60)`)
    })
  })

  room.assert(`keyboardIlluminator is active`)
}
