const StreamSet = require('stream-set')
const { inherits } = require('util')

const isTruthyString = x => x && typeof x === 'string'

function HashtagStreamSet (willDelete) {
  if (!(this instanceof HashtagStreamSet))
    return new HashtagStreamSet(willDelete)
  StreamSet.call(this)
  this.on('remove', this._onremove.bind(this, willDelete))
}

inherits(HashtagStreamSet, StreamSet)

HashtagStreamSet.prototype._onremove = function (willDelete, stream) {
  this._delete(stream._hashtag, willDelete)
}

HashtagStreamSet.prototype._doDelete = function (tag) {
  var rm_stream
  while ((rm_stream = this.streams.find(stream => stream._hashtag === tag))) {
    rm_stream._hashtag = undefined
    this.off('remove', this._onremove)
    this.remove(rm_stream)
    this.on('remove', this._onremove)
  }
}

HashtagStreamSet.prototype._delete = function (tag, willDelete) {
  if (typeof willDelete !== 'function')
    willDelete = (tag, streams, doDelete) => doDelete()
  const rm_streams = this.streams.filter(stream => stream._hashtag === tag)
  if (!rm_streams.length) return false
  willDelete(tag, rm_streams, this._doDelete.bind(this, tag))
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

HashtagStreamSet.prototype.delete = function (tag, willDelete) {
  if (!isTruthyString(tag)) throw new Error('tag is not a truthy string')
  return this._delete(tag, willDelete)
}

module.exports = HashtagStreamSet
