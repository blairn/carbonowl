import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import cors from 'cors'
// import {json} from 'body-parser'
const { json } = require('body-parser');
import {ejsonBodyParser} from './_ejsonBodyParser.mjs'

const { PORT, NODE_ENV } = process.env;

polka()
  .use(
    cors({}),    
    compression({ threshold: 0 }),
    json(),
    ejsonBodyParser,
    sirv("static", { dev: NODE_ENV === "development" }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
