const Chance = require('chance')
const chance = new Chance()

const getRandomDelay = () => chance.integer({ min: 1, max: 10 }) * 1000

const makeRandomAnimal = () => {
  const longAnimal = chance.animal().split(' ')
  return {
    name: chance.first(),
    animal: longAnimal[longAnimal.length - 1],
    x: chance.floating({ min: 0, max: 1 }),
    y: chance.floating({ min: 0, max: 1 })
  }
}

const printRandomAnimal = () => {
  const { name, animal, x, y } = makeRandomAnimal()
  console.log(`${name} is a ${animal} animal at (${x}, ${y})`)
}

const printRandomAnimalRecursively = () => {
  printRandomAnimal()
  setTimeout(printRandomAnimalRecursively, getRandomDelay())
}

printRandomAnimalRecursively()
