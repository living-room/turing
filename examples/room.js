(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch')) :
	typeof define === 'function' && define.amd ? define(['node-fetch'], factory) :
	(global.room = factory(global.fetch));
}(this, (function (fetch) { 'use strict';

fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {uri} location Location to connect (defaults to localhost:3000)
 */
class Room {
  constructor (uri) {
    this._uri = uri || `http://localhost:3000`;
    this._id = null;
  }

  _db (endpoint, data) {
    const body = Object.assign(data, {id: this._id});
    const post = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    };

    return fetch(this._uri + '/' + endpoint, post)
      .then(response => response.json())
      .then(json => {
        this._id = json.id;
        return json
      })
  }

  async facts () {
    return this._db('facts', {})
  }

  // todo: refactor to allow for easier callbacks
  async select (...facts) {
    return this._db('select', {facts})
  }

  // filler values not implemented
  async assert (fact, _) {
    return this._db('assert', {fact})
  }

  // filler values not implemented
  async retract (fact, _) {
    return this._db('retract', {fact})
  }
}

return Room;

})));
//# sourceMappingURL=room.js.map
