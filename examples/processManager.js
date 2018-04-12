/**
 * This process manager is a nice way to add more animal processes to all work together
 * It would be cool if the processes themselves would check if they are active, etc
 */

const fs = require('fs')

const fps = 1
const ms = 100 / fps

const Room = require('../build/room.js')
room = new Room()

const move = require('./processes/move.js')(room)

const processes = new Set()

setInterval(() => {
  move()
}, ms)
