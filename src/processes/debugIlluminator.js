// This labels displays

module.exports = async room => {
  room.assert(`table: draw label table at (0.1, 0.1)`)
  room.assert(`whiteboard: draw label whiteboard at (0.1, 0.1)`)
  room.assert(`draw label display at (0.1, 0.15)`)
}
