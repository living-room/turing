# crosby log

First, add your ssh public key to

    ~room/.ssh/authorized_keys

// TODO: can we just have recursers group all authorized to ssh in as room?

Next is update to the latest living room repo

    cd ~/lovelace
    git stash
    git pull --rebase --recurse-submodules
    git submodule update --init --recursive
    npm install

Let's check that it runs

    npm start

> you may get an UnhandledPromiseRejectionWarning, do not worry, this is okay.
> We have some race conditions when starting up the processes

Turn on the projector


    startx

> we got authentication required to create a color profile
> and added the following to /etc/polkit-1/localauthority.conf.d/02-allow-colord.conf

    polkit.addRule(function(action, subject) {
      if ((action.id == "org.freedesktop.color-manager.create-device"  ||
           action.id == "org.freedesktop.color-manager.create-profile" ||
           action.id == "org.freedesktop.color-manager.delete-device"  ||
           action.id == "org.freedesktop.color-manager.delete-profile" ||
           action.id == "org.freedesktop.color-manager.modify-device"  ||
           action.id == "org.freedesktop.color-manager.modify-profile"
          ) && (
           subject.isInGroup("{nogroup}")
          )
         )
      {
        return polkit.Result.YES;
      }
    });

Now startx works

# open the table visualizer

For some reason npm start failed, so we had to manually open the visualizer

    DISPLAY=:0 firefox http://localhost:5000/displays/table.html

# build the keyboardTracker

   git submodule update --init --recursive
   export OF_ROOT=$HOME/openFrameworks
   cd $HOME/lovelace
   rm -rf $OF_ROOT/apps/roomSensors/keyboardTracker && cp -r sensors/keyboardTracker $_
   cd $_
   make


# install openframeworks dependencies

   GSTREAMER_VERSION=1.0
   GSTREAMER_FFMPEG=gstreamer1.0-libav
   GTK_VERSION=-3
   GLFW_PKG=libglfw3-dev

   sudo apt install curl libjack-jackd2-0 libjack-jackd2-dev freeglut3-dev libasound2-dev libxmu-dev libxxf86vm-dev g++${CXX_VER} libgl1-mesa-dev${XTAG} libglu1-mesa-dev libraw1394-dev libudev-dev libdrm-dev libglew-dev libopenal-dev libsndfile-dev libfreeimage-dev libcairo2-dev libfreetype6-dev libssl-dev libpulse-dev libusb-1.0-0-dev libgtk${GTK_VERSION}-dev libopencv-dev libassimp-dev librtaudio-dev libboost-filesystem${BOOST_VER}-dev libgstreamer${GSTREAMER_VERSION}-dev libgstreamer-plugins-base${GSTREAMER_VERSION}-dev  ${GSTREAMER_FFMPEG} gstreamer${GSTREAMER_VERSION}-pulseaudio gstreamer${GSTREAMER_VERSION}-x gstreamer${GSTREAMER_VERSION}-plugins-bad gstreamer${GSTREAMER_VERSION}-alsa gstreamer${GSTREAMER_VERSION}-plugins-base gstreamer${GSTREAMER_VERSION}-plugins-good gdb ${GLFW_PKG} liburiparser-dev libcurl4-openssl-dev libpugixml-dev
