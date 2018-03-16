'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fetch = _interopDefault(require('node-fetch'));
var io = _interopDefault(require('socket.io-client'));

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {uri} location Location to connect (defaults to localhost:3000)
 */
function getEnv (key) {
  if (typeof process !== 'undefined') return process.env[key]
}

class Room {
  constructor (uri) {
    this.uri = uri || getEnv('LIVING_ROOM_URI') || 'http://localhost:3000';
    this._sockets = new Map();
    this._data = null;
    this._endpoint = null;
  }

  subscribe (facts) {
    const subscriptionName = facts.toString();
    if (this._sockets.has(subscriptionName)) {
      return this._sockets.get(subscriptionName)
    }

    const socket = io.connect(this.uri);
    socket.emit('updateSubscription', facts);

    this._sockets.set(subscriptionName, socket);
    return {
      on(callback) {
        socket.on('subscriptionFacts', callback);
      }
    }
  }

  _db () {
    if (!(this._data || this._endpoint)) {
      throw new Error(`please set _data and _endpoint using assert(), retract(), or select()`)
    }
    const endpoint = this.uri + '/' + this._endpoint;

    const post = {
      method: 'POST',
      body: JSON.stringify(this._data),
      headers: { 'Content-Type': 'application/json' }
    };

    return fetch(endpoint, post)
      .then(response => {
        this._data = null;
        this._endpoint = null;
        return response
      })
  }

  facts () {
    this._data = {};
    this._endpoint = 'facts';
    return this
  }

  select (facts) {
    this._data = {facts};
    this._endpoint = 'select';
    return this
  }

  do (callbackFn) {
    this._db()
      .then( _ => _.json() )
      .then( json => {
        console.log(json);
        const {solutions} = json;
        solutions.forEach(callbackFn);
      });
  }

  assert (fact) {
    this._data = {fact};
    this._endpoint = 'assert';
    this._db();
    return this
  }

  retract (fact) {
    this._data = {fact};
    this._endpoint = 'retract';
    this._db();
    return this
  }

/*
  async retractEverythingAbout (name) {
    this._data = {name}
    this._endpoint = 'retractEverythingAbout'
    await this._db()
  }
  */
}

module.exports = Room;
//# sourceMappingURL=room.js.map
