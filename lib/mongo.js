const {MongoClient, ObjectId} = require("mongodb")
const {config} = require("../config/index")

const USER = encodeURIComponent(config.db_user)
const PASSWORD = encodeURIComponent(config.db_password)
const DB_NAME = encodeURIComponent(config.db_name)
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.db_host}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib{
    constructor(){
        this.client = new MongoClient(MONGO_URI, {useNewUrlParser: true}, {useUnifiedTopology: true})
        this.db_name = DB_NAME
    }
    connect(){
        if(!MongoLib.connection){
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if(err){
                        reject(err)
                    }
                    console.log("Connected succesfully to mongo :)")
                    resolve(this.client.db(this.db_name))
                })
            })
        }
        return MongoLib.connection 
    }

    getAll(collection, query){
        return this.connect().then(db => {
            return db.collection(collection).find(query).toArray()
        })
    }
    get(collection, id){
        return this.connect().then(db => {
            return db.collection(collection).findOne({_id: ObjectId(id)})
        })
    }
    create(collection, data){
        return this.connect().then(db => {
            return db.collection(collection).insertOne(data)
        }).then(result => result.insertedId)
    }
    update(collection, id, data){
        return this.connect().then(db => {
            return db.collection(collection).updateOne({_id: ObjectId(id)}, {$set: data}, {upsert: true})
        }).then(result => result.upsetedId || id)
    }
    delete(collection, id){
        return this.connect().then(db => {
            return db.collection(collection).deleteOne({_id: ObjectId(id)})
        }).then(() => id)
    }
}

module.exports = MongoLib