const StreamSet = require('stream-set')
const { inherits } = require('util')

const isTruthyString = x => x && typeof x === 'string'

function HashtagStreamSet (willDelete) {
  if (!(this instanceof HashtagStreamSet))
    return new HashtagStreamSet(willDelete)
  StreamSet.call(this)
  this.on('remove', stream => this._delete(stream._hashtag, willDelete))
}

inherits(HashtagStreamSet, StreamSet)

HashtagStreamSet.prototype._delete = function (tag, willDelete) {
  if (typeof willDelete !== 'function')
    willDelete = (tag, streams, doDelete) => doDelete()

  const doDelete = () => {
    var rm_stream
    while ((rm_stream = this.streams.find(stream => stream._hashtag === tag))) {
      rm_stream._hashtag = undefined
      this.remove(rm_stream)
    }
  }

  const rm_streams = this.streams.filter(stream => stream._hashtag === tag)

  if (rm_streams.length) {
    willDelete(tag, rm_streams, doDelete)
    return true
  } else {
    return false
  }
}

HashtagStreamSet.prototype.add = function (tag, ...streams) {
  if (!isTruthyString(tag)) throw new Error('tag is not a truthy string')
  streams
    .map(stream => {
      stream._hashtag = tag
      return stream
    })
    .forEach(StreamSet.prototype.add.bind(this))
}

HashtagStreamSet.prototype.delete = function (tag, willDelete) {
  if (!isTruthyString(tag)) throw new Error('tag is not a truthy string')
  return this._delete(tag, willDelete)
}

module.exports = HashtagStreamSet
