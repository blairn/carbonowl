import urls from './urls.json'
import {csv} from 'd3-fetch'
import bson from 'bson'

const {serviceUrl} = urls

const get_headers = async () => ({
    'Content-Type': 'application/json'
})

const onServer = (typeof window == 'undefined')
const nothing = Promise.resolve([])

export const db_url = (dbName, collectionName) => `${serviceUrl}/api/${dbName}/${collectionName}`
export const fetch_csv = async (method, url, body) => onServer? await nothing : await csv(url, {method, headers: {Accept:"text/csv", ...await get_headers()}, body: body?bson.EJSON.stringify(body):undefined})
export const fetch_json = async (method, url, body) => onServer? await nothing : await fetch(url, {method, headers: await get_headers(), body: body?bson.EJSON.stringify(body):undefined}).then(response => response.json())

export const api_url = (service) => `${serviceUrl}/api/${service}`
export const admin_url = (service) => `${serviceUrl}/admin/${service}`
export const query = (dbName, collectionName, q) => fetch_csv('POST', db_url(dbName,collectionName), q)

export const get_api = (service) => fetch_json('GET', api_url(service))
export const post_api = (service,q) => fetch_json('POST', api_url(service),q)

export const normalise = (q) => bson.EJSON.serialize(q)

export const queryRunnerFor = (uri) => (q) => fetch_csv('post', uri, q)