const { PassThrough } = require('stream')
const hashtagStreamSet = require('./index.js')

// creating a HashtagStreamSet instance with a bound willDelete hook
const set = hashtagStreamSet((tag, del_streams, doDelete) => {
  console.log('set.size', set.size) // 3
  console.log('del_streams.length', del_streams.length) // 2
  // do some kind of cleanup...
  del_streams.forEach(stream => stream.unpipe().destroy())
  // must do this call to perform actual deletion
  doDelete()
})

const a = new PassThrough()
const b = new PassThrough()
const c = new PassThrough()

set.add('#fraud', a)
set.add('#money', b, c)

set.delete('#money')

console.log('set.size', set.size) // 1
