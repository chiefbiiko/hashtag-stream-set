# hashtag-stream-set

[![build status](http://img.shields.io/travis/chiefbiiko/hashtag-stream-set.svg?style=flat)](http://travis-ci.org/chiefbiiko/hashtag-stream-set) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/hashtag-stream-set?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/hashtag-stream-set) [![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./security.md)

***

A `StreamSet` subtype whose `add` method tags all input streams in order to ensure that any time a stream gets removed from the set (manually or automatically) all streams with an equal tag are deleted as well.

***

## Get it!

```
npm install --save chiefbiiko/hashtag-stream-set
```

***

## Usage

Check out `./usage.js`:

``` js
const { PassThrough } = require('stream')
const hashtagStreamSet = require('hashtag-stream-set')

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
```

Note you can optionally pass a `willDelete` hook as first argument to the `HashtagStreamSet` constructor to have that function be used for all removals. When having such a general `willDelete` hook you can still specify one in a call of the `HashtagStreamSet.prototype.delete` method and it will override the general one for the current tag deletion.

## API

### `set = new HashtagStreamSet([willDelete(tag, del_streams, doDelete)])`

### `set.add(tag, ...streams)`

### `set.delete(tag[, willDelete(tag, del_streams, doDelete)])`

***

## API

### `hashtag-stream-set`

hashtag-stream-set

***

## License

[MIT](./license.md)
