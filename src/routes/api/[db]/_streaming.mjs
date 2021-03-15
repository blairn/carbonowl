import  { Transform, Readable } from 'stream'
import BSON from 'bson';
const {EJSON} = BSON;

const pipeMap = (fn, options = {}) => new Transform({
  objectMode: true,
  ...options,
  transform(chunk, encoding, callback) {
    let res;
    try {
      res = fn(chunk);
    } catch(e) {
      return callback(e);
    }
    callback(null, res);
  }
})

const createEJsonStream = (options = {}) => {
  return new Transform({
    objectMode: true,
    ...options,
    transform: function (chunk, encoding, callback) {
      if (!this.not_first) {
          this.not_first = true
          this.push('[' + EJSON.stringify(chunk))
      } else {
          this.push(',\n' + EJSON.stringify(chunk))
      }
      callback();
    },
    flush: function (callback) { this.push(']'); callback() }
  })
}

const streamEJSON = (res, cursor) => {
  res.setHeader('Content-Type', 'application/json')
  cursor.pipe(createEJsonStream()).pipe(res)
}

export const streamResults = (req, res, cursor) => {
  streamEJSON(res, cursor)
}

export const streamObject = (req, res, obj) => {
  res.setHeader('Content-Type', 'application/json')
  Readable.from([obj]).pipe(pipeMap(EJSON.stringify)).pipe(res)
}
