# living-room/lovelace

All the code running in lovelace

To talk to lovelace directly, make sure to `export LIVING_ROOM_HOST=http://crosby.cluster.recurse.com:3000`

Check out the `src/` folder to see what is running on crosby, and being output through the projectors in lovelace.

Install dependencies with

    npm install
 
Run a local server:

    npm start

Try these cool commands:

    npm run assert '<yournamehere> is a human animal at (0.5, 0.5)'

    npm run select '\$who is a \$species animal at (\$, \$)'

Or maybe

    node src/util/sensor.js

![animals sensor](./images/example-sensor.png)

We have a drawing api

    draw text "the devils lettuce" at (0.5, 0.5)

    draw label freebelflorp at (0.1, 0.2)

We also have a way to output to a single display

    table: draw text "i am a table!" at (0.14, 0.15)

    whiteboard: draw a (255, 0, 255) circle at (0.5, 0.5) with radius 20
