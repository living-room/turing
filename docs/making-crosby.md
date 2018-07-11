# crosby log

First, add your ssh public key to

    ~room/.ssh/authorized_keys

// TODO: can we just have recursers group all authorized to ssh in as room?

Next is update to the latest living room repo

    cd ~/lovelace
    git stash
    git pull --rebase --recurse-submodules
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

For some reason npm start failed... (so we had to manually open localhost:5000/displays/table.html
