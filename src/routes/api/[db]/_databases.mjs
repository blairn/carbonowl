import dotenv from 'dotenv'
import mongodb from 'mongodb'
const {MongoClient} = mongodb

dotenv.config()
const {MONGO_URI, MONGO_LOG_URI} = process.env;

export const mongo = new MongoClient(MONGO_URI, { poolSize:10, useNewUrlParser: true, useUnifiedTopology:true });
mongo.connect();