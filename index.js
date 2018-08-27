const StreamSet = require('stream-set')
const { inherits } = require('util')

const isTruthyString = x => x && typeof x === 'string'

function HashtagStreamSet (willDel) {
  if (!(this instanceof HashtagStreamSet)) return new HashtagStreamSet(willDel)
  StreamSet.call(this)
  this._willDel = willDel
  this._onremove = function (willDel, stream) {
    this._delete(stream._hashtag, willDel)
  }.bind(this, this._willDel)
  this.on('remove', this._onremove)
}

inherits(HashtagStreamSet, StreamSet)

HashtagStreamSet.prototype._doDel = function (tag) {
  var del_stream
  while ((del_stream = this.streams.find(stream => stream._hashtag === tag))) {
    del_stream._hashtag = undefined
    this.removeListener('remove', this._onremove)
    this.remove(del_stream)
    this.on('remove', this._onremove)
  }
}

HashtagStreamSet.prototype._delete = function (tag, willDel) {
  if (typeof willDel !== 'function') willDel = (tag, streams, doDel) => doDel()
  const del_streams = this.streams.filter(stream => stream._hashtag === tag)
  if (!del_streams.length) return false
  willDel(tag, del_streams, this._doDel.bind(this, tag))
  return true
}

HashtagStreamSet.prototype.add = function (tag, ...streams) {
  if (!isTruthyString(tag)) throw new Error('tag is not a truthy string')
  streams
    .map(stream => {
      stream._hashtag = tag
      return stream
    })
    .forEach(StreamSet.prototype.add.bind(this))
    return true
}

HashtagStreamSet.prototype.delete = function (tag, willDel) {
  if (!isTruthyString(tag)) throw new Error('tag is not a truthy string')
  return this._delete(tag, willDel || this._willDel)
}

module.exports = HashtagStreamSet
