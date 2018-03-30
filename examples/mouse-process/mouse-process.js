const Room = require('../build/room.js')
const room = new Room() //'http://crosby.cluster.recurse.com:3000')

const app = require('express')();    
const server = require('http').Server(app);  
const socket = require('socket.io')(server);

const lastMousePositions = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(4200);
console.log('Listening for mouse client on port 4200...');

socket.on('connection', socket => {
  console.log('Mouse client connected!');
  socket.on('mm', vec => {
    moveMouse(vec);
  });
});

function moveMouse(vec) {
    if (lastMousePositions.length > 9) {
        lastMousePositions.pop();
        lastMousePositions.unshift(vec);
        room
            .select([`$mouseLabel is a ($r, $g, $b) circle at ($x, $y) with radius $radius`])
            .doAll(mice => {
                if (mice.length) {
                    setTimeout(() => {
                        // FIXME: the mouse will disappear after 100ms of inactivity!
                        // maybe this should be mice.slice(0, mice.length-1).forEach?
                        mice.forEach(mouse => {
                            room.retract(`${mouse.mouseLabel} is a (${mouse.r}, ${mouse.g}, ${mouse.b}) circle at (${mouse.x}, ${mouse.y}) with radius ${mouse.radius}`);
                        });
                    }, 100); 
                }
            });

        for (let i = 0; i < 10; i += 1) {
            room.assert(`mouse${i} is a (${255 - i * 10}, ${255 - i * 10}, ${255 - i * 10}) circle at (${lastMousePositions[i].x}, ${lastMousePositions[i].y}) with radius ${30 - i * 2}`);
            console.log(`mouse${i} is a (${255 - i * 10}, ${255 - i * 10}, ${255 - i * 10}) circle at (${lastMousePositions[i].x}, ${lastMousePositions[i].y}) with radius ${30 - i * 2}`);
            // room.assert(`mouse${i} is a (${255 - i * 10}, ${255 - i * 10}, ${255 - i * 10}) line from (${lastMousePositions[i].x}, ${lastMousePositions[i].y}) to (${lastMousePositions[i].x + 0.2}, ${lastMousePositions[i].y + 0.2})`);
            // console.log(`mouse${i} is a (${255 - i * 10}, ${255 - i * 10}, ${255 - i * 10}) line from (${lastMousePositions[i].x}, ${lastMousePositions[i].y}) to (${lastMousePositions[i].x + 0.2}, ${lastMousePositions[i].y + 0.2})`);
        }
    } else {
        lastMousePositions.unshift(vec);
    }
}