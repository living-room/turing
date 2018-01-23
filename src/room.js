'use strict'

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {uri} location Location to connect (defaults to localhost:3000)
 */
import fetch from 'node-fetch'

export default class Room {
  constructor (uri) {
    this._uri = uri || `http://localhost:3000`
    this._id = null
    this._data = {}
    this._endpoint = ''
  }

  _db () {
    const body = Object.assign(this._data, {id: this._id})
    const post = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }

    return fetch(this._uri + '/' + this._endpoint, post)
      .then(response => response.json())
      .then(json => {
        this._id = json.id
        return json
      })
  }

  async facts () {
    return this._db('facts', {})
  }

  // todo: refactor to allow for easier callbacks
  select (...facts) {
    this._data = {facts}
    this._endpoint = 'select'
    return this
  }

  async do (callbackFn) {
    const {solutions} = await this._db()
    solutions.forEach(callbackFn)
  }

  async doAll (callbackFn) {
    callbackFn(await this._db())
  }

  // filler values not implemented
  assert (fact, _) {
    this._data = {fact}
    this._endpoint = 'assert'
    this._db()
    return this
  }

  // filler values not implemented
  async retract (fact, _) {
    return this._db('retract', {fact})
  }
}
