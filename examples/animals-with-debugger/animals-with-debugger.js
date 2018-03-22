// This is a demo of subscribing to a server query, as well as
// two programs interacting with each other.

// It queries for animals in the database and draws them on screen.
// Then, if another program sees a "bugnet" (a debugger), it will also
// print debug output at the location of the bugnet.

const room = new window.Room() // assumes LivingRoom server running on http://localhost:3000
const context = canvas.getContext('2d')
let characters = new Map()
let animalFacts = []
let bugnets = []

// Set up some demo data
room
  .assert(`Simba is a cat animal at (0.5, 0.1)`)
  .assert(`Timon is a meerkat animal at (0.4, 0.6)`)
  .assert(`Pumba is a warthog animal at (0.55, 0.6)`)

// Query for locations of animals and update our local list
room
  .subscribe(`$name is a $animal animal at ($x, $y)`)
  .on(({assertions}) => {
    assertions.forEach(animal => {
      let [label, x, y] = [animal.name.word, animal.x.value, animal.y.value]
      characters.set(label, {x, y})
    })

    // Produce a string version of the results for the debugger to use
    animalFacts = assertions.map(animal => JSON.stringify(animal))
  })

// Query for "bugnets", locations where someone has physically placed a debugger.
room
  .subscribe(`there is a $bugnet bugnet at $x $y $xx $yy`)
  .on(({assertions}) => {
    bugnets = []

    assertions.forEach(bugnet => {
      let [bugnetType, x, y, xx, yy] = [
        bugnet.bugnet.word,
        bugnet.x.value,
        bugnet.y.value,
        bugnet.xx.value,
        bugnet.yy.value
      ]
      let description = `Bugnet at ${x}, ${y}`

      // We only visualize the last bugnet returned by the query.
      // Previously we would build up an array of all the
      // bugnets we saw, but that got too messy.
      bugnets = [{bugnetType, x, y, xx, yy, description}]
    })
  })

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  characters.forEach(({x, y}, name) => {
    context.fillStyle = '#fff'
    context.font = '40px sans-serif'
    context.fillText(name, x * canvas.width, y * canvas.height)
  })

  // Draw any bugnets that have been placed
  bugnets.forEach(({x, y}) => {
    let yOffset = 0

    context.font = '16px sans-serif'
    context.fillStyle = 'lightblue'
    context.fillText("BUGNET!", x * canvas.width, y * canvas.height)

    animalFacts.forEach(animalString => {
      yOffset += 25 // This is just to put each animal's JSON on a new line

      context.font = '18px sans-serif'
      context.fillStyle = 'lightblue'
      context.fillText(animalString, x * canvas.width, (y * canvas.height) + yOffset)
    })

    yOffset += 50

    bugnets.forEach(({description}) => {
      yOffset += 25

      context.font = '18px sans-serif'
      context.fillStyle = 'lightblue'
      context.fillText(description, x * canvas.width, (y * canvas.height) + yOffset)
    })
  })

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)


// Here we set up a loop that retracts all bugnets we've seen after 1 second.
// This helps keep the canvas clean.

// Temporarily commented out retracting code below,
// because living-room-server errors out when trying to retract a rumor,
// and we want this demo to successfully run.

/* var retractAllBugnets = function () {
  bugnets.forEach(function ({bugnetType, x, y, xx, yy}) {
    let fact = `there is a ${bugnetType} bugnet at ${x} ${y} ${xx} ${yy}`
    room.retract(fact)
  })
  bugnets = []
  setTimeout(retractAllBugnets, 1000)
}

retractAllBugnets() */
