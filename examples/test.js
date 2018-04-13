const Room = require('../build/room.js')
const room = new Room()

room.select('$a is a $b animal at ($c, $d)').then(console.dir)
room.subscribe([`$a is a $aspecies animal at ($ax, $ay)`], console.dir)
