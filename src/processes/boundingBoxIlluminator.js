module.exports = Room => {
  const room = new Room()

  var box = { x: 0.25, y: 0.25, w: 0.5, h: 0.5 }

  // Redraw boundingBox if any attribute has changed
  const updateBoundingBox = function (changes) {
    for (newBox of changes.assertions) {
      if (newBox.x0 != box.x || newBox.y0 != box.y || newBox.w != box.w || newBox.h != box.h) {
        eraseBoundingBox(box.w, box.h, box.x, box.y)
        drawBoundingBox(newBox.w, newBox.h, newBox.x0, newBox.y0)
        box = newBox
      }
    }
  }

  const drawBoundingBox = function (w, h, x, y) {
    room.assert(`draw a (255, 255, 255) line from (${x}, ${y}) to (${x+w}, ${y})`)
    room.assert(`draw a (255, 255, 255) line from (${x+w}, ${y}) to (${x+w}, ${y+h})`)
    room.assert(`draw a (255, 255, 255) line from (${x+w}, ${y+h}) to (${x}, ${y+h})`)
    room.assert(`draw a (255, 255, 255) line from (${x}, ${y+h}) to (${x}, ${y})`)
  }

  const eraseBoundingBox = function (w, h, x, y) {
    room.retract(`draw a (255, 255, 255) line from (${x}, ${y}) to (${x+w}, ${y})`)
    room.retract(`draw a (255, 255, 255) line from (${x+w}, ${y}) to (${x+w}, ${y+h})`)
    room.retract(`draw a (255, 255, 255) line from (${x+w}, ${y+h}) to (${x}, ${y+h})`)
    room.retract(`draw a (255, 255, 255) line from (${x}, ${y+h}) to (${x}, ${y})`)
  }

  // Query the db for boundingBox (any position, any size) and draw it
  //
  // Note: A feature of the subscribe function is that it uses a constraint
  // solver to satisfy the placeholders, e.g. $x and $y, before calling the
  // callback function.
  room.subscribe(
    `boundingBox is $w by $h at ($x0, $y0)`,
    updateBoundingBox
  )

  // Draw first box using defaults
  drawBoundingBox(box.w, box.h, box.x, box.y)

  room.assert(`boundingBoxIlluminator is active`)
}