'use strict'

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {uri} location Location to connect (defaults to localhost:3000)
 */
import fetch from 'node-fetch'

function getEnv(key) {
  if (typeof process !== 'undefined') return process.env[key]
}

export default class Room {
  constructor (uri) {
    this.uri = uri || getEnv('ROOMDB_URI') || 'http://localhost:3000'
    this.id = null
    this._data = null
    this._endpoint = null
  }

  _db () {
    if (!(this._data || this._endpoint)) {
      throw new Error(`please set _data and _endpoint using assert(), retract(), select(), or do()`)
    }
    const endpoint = this.uri + '/' + this._endpoint

    const post = {
      method: 'POST',
      body: JSON.stringify(Object.assign(this._data, {id: this.id})),
      headers: { 'Content-Type': 'application/json' }
    }

    return fetch(endpoint, post)
      .then(response => response.json())
      .then(json => {
        this.id = this.id || json.id
        this._data = null
        this._endpoint = null
        return json
      })
  }

  select (facts) {
    this._data = facts
    this._endpoint = 'select'
    return this
  }

  async do (callbackFn) {
    const {solutions} = await this._db()
    solutions.forEach(callbackFn)
  }

  async doAll (callbackFn) {
    const {solutions} = await this._db()
    callbackFn(solutions)
  }

  // todo: implement filler values
  assert (fact, _) {
    this._data = {fact}
    this._endpoint = 'assert'
    this._db()
    return this
  }

  // todo: implement filler values
  retract (fact, _) {
    this._data = {fact}
    this._endpoint = 'retract'
    this._db()
    return this
  }
}
