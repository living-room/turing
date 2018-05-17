#!/usr/bin/python

# Should be run on a Raspberry Pi.
# Requires 'pyosc'.

# Asserts key events to the db.
# on blackcasepi.local, is ~/client.py and run from /etc/rc.local.

# From https://stackoverflow.com/questions/5060710/format-of-dev-input-event

import struct
import time
import sys

import os
import json
from OSC import OSCClient, OSCMessage

SERVER = 'crosby.cluster.recurse.com'
c = OSCClient()
c.connect((SERVER, 41234))
def room_assert(facts):
    for fact in facts:
        msg = OSCMessage()
        msg.setAddress('/assert')
        msg.append(fact)
        c.send(msg)

mac = open("/sys/class/net/wlan0/address").readline()[0:17]
ip = os.popen("hostname -I").read().split()[0]
room_assert(['"' + mac + '" got ip "' + ip + '"'])

infile_path = "/dev/input/event" + (sys.argv[1] if len(sys.argv) > 1 else "0")

#long int, long int, unsigned short, unsigned short, unsigned int
FORMAT = 'llHHI'
EVENT_SIZE = struct.calcsize(FORMAT)

#open file in binary mode
in_file = open(infile_path, "rb")

event = in_file.read(EVENT_SIZE)

seq = 0
while event:
    (tv_sec, tv_usec, type, code, value) = struct.unpack(FORMAT, event)

    if type != 0 or code != 0 or value != 0:
        print("Event type %u, code %u, value %u at %d.%d" % \
            (type, code, value, tv_sec, tv_usec))
        sys.stdout.flush()
        room_assert(['"%s" got input event type %u with code %u and value %u @ %u' % (mac, type, code, value, seq)])
        seq = seq + 1
    else:
        # Events with code, type and value == 0 are "separator" events
        print("===========================================")

    event = in_file.read(EVENT_SIZE)

in_file.close()

