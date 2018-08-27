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

// creating a HashtagStreamSet instance with a bound willDelete hook
const set = hashtagStreamSet((tag, del_streams, doDelete) => {
  console.log('set.size', set.size) // 3
  console.log('del_streams.length', del_streams.length) // 2
  // do some kind of cleanup
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
```

Note you can optionally pass a `willDelete` hook as second argument to a call of the `set.delete` method and it will override the general one (the optional hook passed to the constructor) for the current tag deletion.

***

## API

### `set = new HashtagStreamSet([willDelete(tag, del_streams, doDelete)])`

Create a `HashtagStreamSet` instance. `willDelete` is an optional function that will be called with all streams that are about to be removed from the set. Removal may be triggered by an end of a stream  ([`eos`](https://github.com/mafintosh/eos)), a call to `set.remove(stream)` or `set.delete(tag)`. Make sure to call the `doDelete` callback to perform actual deletion.

### `set.add(tag, ...streams)`

Add one or multiple streams to the set. `tag` must be a string and will be set as `stream._hashtag` for every stream added. Note that the `_hashtag` property will be removed from stream instances as they get removed from the set.

### `set.delete(tag[, willDelete(tag, del_streams, doDelete)])`

Delete all streams with their `_hashtag` property equal to `tag`. If `willDelete` is provided it will override any hook passed at instantiation.

***

## License

[MIT](./license.md)
