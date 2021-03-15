import urls from './urls.json'
import bson from 'bson'

const {serviceUrl} = urls

const get_headers = async () => ({
    'Content-Type': 'application/json'
})

const onServer = (typeof window == 'undefined')
const nothing = Promise.resolve([])

export const db_url = (dbName, collectionName) => `/api/${dbName}/${collectionName}`
export const fetch_ejson = async (method, url, body) => onServer? await nothing : await fetch(url, {method, headers: await get_headers(), body: body?bson.EJSON.stringify(body):undefined})
    .then(async response => {
        return bson.EJSON.parse(JSON.stringify(await response.json()))
    })

export const api_url = (service) => `/api/${service}`
export const admin_url = (service) => `/admin/${service}`
export const query = (dbName, collectionName, q) => fetch_ejson('POST', db_url(dbName,collectionName), q)

export const post_api = (service,q) => fetch_ejson('POST', api_url(service),q)

export const normalise = (q) => bson.EJSON.serialize(q)

export const queryRunnerFor = (uri) => (q) => fetch_ejson('post', uri, q)