How to build your own room

Use this as a template, and fork to a make log, like we have done with [making-crosby.md](making-crosby.md)

# what it will look like when you are done

// picture of people interacting with the table

# provisioning a room

you will need:

1. a table
2. a computer
3. a projector
4. a kinect

// picture of lovelace

put the kinect and projector directly above the table

// picture

connect the computer to the projector and kinect

stretch!

# installing the software

there are two pieces of software to setup

1. the living room service
2. sensor software

All of the software needed are in this repository

    git clone --recursive https://github.com/living-room/lovelace
    cd lovelace
    npm install

Let's test that it works without any sensors

    npm start

You should see

  ![picture of server running]()

 > you may see an UnhandledPromiseRejectionWarning, do not worry, this is okay.
 > we have some race conditions when starting up the processes

Open a display

  firefox http://localhost:5000/displays/table.html
