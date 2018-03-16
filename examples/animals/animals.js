// This is a demo of subscribing to a server query.
// It queries for animals in the database and draws them on screen.

const room = new LivingRoom() // assumes living room server running on http://localhost:3000
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
  .on(({queries, solutions}) => {
    solutions.forEach(animal => {
      let [label, x, y] = [animal.name.str, animal.x.value, animal.y.value]
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
