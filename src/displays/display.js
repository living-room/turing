// This is a demo of subscribing to a server query.

// Draw a word
//  `draw label $name at ($x, $y)`
//  `draw label Timon at (0.3, 0.3)`

// Draw a sentence
//  `draw text $text at ($x, $y)`
//  `draw text "timon is cool" at (0.8, 0.8)`

// Drawing a line
//  `$name is a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`
//  `timonpumbaline is a (255, 255, 0) line from (0.3, 0.3) to (0.5, 0.5)`

// Drawing a circle:
//  `$name is a ($r, $g, $b) circle at ($x, $y) with radius $radius`
//  `mycircle is a (255, 12, 123) circle at (0.5, 0.6) with radius 20`

const hostname = location.hostname
const pathArray = location.pathname.split('/')
const displayIndex = pathArray.indexOf('displays')
const namespace = pathArray[displayIndex + 1]

const room = new window.room(`http://${hostname}:3000`)
const context = canvas.getContext('2d')

let labels = new Map()
let texts = new Map()
let circles = new Map()
let lines = new Map()

const updateLabel = ({ assertions, retractions }) => {
  retractions.forEach(({ name }) => labels.delete(name.word))

  assertions.forEach(label => {
    labels.set(label.name.word, {
      name: label.name.word,
      x: label.x.value,
      y: label.y.value
    })
  })
}

const updateText = ({ assertions, retractions }) => {
  retractions.forEach(({ text }) => texts.delete(text.value))

  assertions.forEach(label => {
    texts.set(label.text.value, {
      text: label.text.value,
      x: label.x.value,
      y: label.y.value
    })
  })
}

const updateLine = ({ retractions, assertions }) => {
  retractions.forEach(({ name }) => {
    lines.delete(name.word)
  })

  assertions.forEach(line => {
    lines.set(line.name.word, {
      name: line.name.word,
      r: line.r.value,
      g: line.g.value,
      b: line.b.value,
      x: line.x.value,
      y: line.y.value,
      xx: line.xx.value,
      yy: line.yy.value
    })
  })
}

const updateCircle = ({ assertions, retractions }) => {
  retractions.forEach(({ name }) => circles.delete(name.word))

  assertions.forEach(circle => {
    circles.set(circle.name.word, {
      name: circle.name.word,
      x: circle.x.value,
      y: circle.y.value,
      r: circle.r.value,
      g: circle.g.value,
      b: circle.b.value,
      radius: circle.radius.value
    })
  })
}

// Query labels
room.subscribe(`draw label $name at ($x, $y)`, updateLabel)
room.subscribe(`${namespace}: draw label $name at ($x, $y)`, updateLabel)
// Query text
room.subscribe(`draw text $text at ($x, $y)`, updateText)
room.subscribe(`${namespace}: draw text $text at ($x, $y)`, updateText)

// Query lines
room.subscribe(
  `draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  updateLine
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  updateLine
)
// Query circles
room.subscribe(
  `draw a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  updateCircle
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  updateCircle
)

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#fff'
  context.font = '40px sans-serif'

  labels.forEach(({ x, y }, name) => {
    context.fillText(name, x * canvas.width, y * canvas.height)
  })

  texts.forEach(({ x, y }, text) => {
    const oldFillStyle = context.fillStyle
    context.fillStyle = '#33f'
    context.fillText(text, x * canvas.width, y * canvas.height)
    context.fillStyle = oldFillStyle
  })

  circles.forEach(({ x, y, r, g, b, radius }, name) => {
    const oldStrokeStyle = context.strokeStyle
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.ellipse(
      x * canvas.width,
      y * canvas.height,
      radius,
      radius,
      0,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.strokeStyle = oldStrokeStyle
  })

  lines.forEach(({ x, y, xx, yy, r, g, b }, name) => {
    const oldStrokeStyle = context.strokeStyle
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.moveTo(x * canvas.width, y * canvas.height)
    context.lineTo(xx * canvas.width, yy * canvas.height)
    context.stroke()
    context.strokeStyle = oldStrokeStyle
  })

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
