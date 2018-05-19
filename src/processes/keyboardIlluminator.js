module.exports = async room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  let buf = []

  room.on(
    `keyboardIlluminator is active`,
    `$mac got input event type $type with code $code and value $value @ $seq`,
    ({ code, type, value, seq }) => {
      if (code !== 4) return
      if (type !== 4) return
      room.retract(
        `whiteboard: draw small text "${buf.join(' ')}" at (0.05, 0.60)`
      )
      buf[seq] = value - 458700
      room.assert(
        `whiteboard: draw small text "${buf.join(' ')}" at (0.05, 0.60)`
      )
    }
  )

  room.assert(`keyboardIlluminator is active`)
}
