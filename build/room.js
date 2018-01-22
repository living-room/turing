(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch')) :
	typeof define === 'function' && define.amd ? define(['node-fetch'], factory) :
	(global.room = factory(global.fetch));
}(this, (function (fetch) { 'use strict';

fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;

class Room {
  constructor (uri) {
    this._uri = uri || `http://localhost:3000`;
    this._id = null;
  }

  _db (endpoint, data) {
    const body = Object.assign(data, {id: this._id});
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(this._uri + '/' + endpoint, options)
      .then(response => response.json())
      .then(json => {
        this._id = json.id;
        return json
      })
  }

  async select (...facts) {
    return this._db('select', {facts})
  }

  // filler values not implemented
  async assert (fact, _) {
    return this._db('assert', {fact})
  }

  // filler values not implemented
  async retract (fact, _) {
    return this._db('retractj', {fact})
  }
}

return Room;

})));
//# sourceMappingURL=room.js.map
