const tape = require('tape')
const { PassThrough } = require('stream')
const hashtagStreamSet = require('./index.js')

tape('add', t => {
  var set = hashtagStreamSet()
  set.add('#fraud', new PassThrough())
  set.add('#fraud', new PassThrough())
  set.add('#money', new PassThrough())
  t.equal(set.size, 3, 'size 3')
  set.forEach((stream, i) => {
    t.ok(stream._hashtag, 'set a _hashtag prop')
    if (i === set.size - 1) t.end()
  })
})

tape('delete', t => {
  var set = hashtagStreamSet()
  const a = new PassThrough()
  const b = new PassThrough()
  const c = new PassThrough()
  set.add('#fraud', a, b)
  set.add('#money', c)
  t.equal(set.size, 3, 'size 3')
  set.delete('#fraud')
  t.equal(set.size, 1, 'size 1')
  set.delete('#money')
  t.equal(set.size, 0, 'size 0')
  var pending = 3
  ;[ a, b, c ].forEach(stream => {
    t.notOk(stream._hashtag, '_hashtag prop undefined')
    if (!--pending) t.end()
  })
})

tape('willDelete', t => {
  var set = hashtagStreamSet()
  const a = new PassThrough()
  const b = new PassThrough()
  const c = new PassThrough()
  set.add('#fraud', a, b)
  set.add('#money', c)
  set.delete('#money', (tag, rm_streams, doDelete) => {
    t.equal(rm_streams.length, 1, 'rm_streams.length 1')
    t.equal(set.size, 3, 'set size still 3')
    rm_streams.forEach(stream => stream.destroy())
    doDelete()
    t.equal(set.size, 2, 'set size down to 2')
    t.end()
  })
})
