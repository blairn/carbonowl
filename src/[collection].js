import {mongo} from './_databases.mjs'; // the underscore tells Sapper this isn't a route
import {deepMap} from './_deepMap.mjs';
import {streamResults} from './_streaming.mjs'
export async function post(req, res, next) {
	const db = 'overwatch'
  const {collection } = req.params
  let query = req.body || {}
  const q = deepMap((query instanceof Array)?[...query]:[{$match:query}])
  const cursor = await mongo.db(db).collection(collection).aggregate(q).stream()
  streamResults(req,res,cursor)
}