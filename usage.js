const { PassThrough } = require('stream')
const hashtagStreamSet = require('./index.js')

const set = hashtagStreamSet()
const a = new PassThrough()
const b = new PassThrough()
const c = new PassThrough()

set.add('#fraud', a)
set.add('#money', b, c)

set.delete('#money', (tag, del_streams, doDelete) => { // willDelete hook...
  console.log('set.size', set.size) // 3
  console.log('del_streams.length', del_streams.length) // 2
  // do some kind of cleanup
  del_streams.forEach(stream => stream.unpipe().destroy())
  // must do this call to perform actual deletion
  doDelete()
})

console.log('set.size', set.size) // 1
