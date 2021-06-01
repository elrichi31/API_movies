const mongoLib = require('../lib/mongo')
const bcrypt = require('bcryptjs')

class UsersService {
    constructor(){
        this.collection = 'users'
        this.mongoDB = new mongoLib()
    }

    async getUser({email}){
        const [user] = await this.mongoDB.getAll(this.collection, {email})
        return user
    }
    async createUser({user}){
        const {name, email, password} = user
        const hashedPassword = await bcrypt.hash(password, 10)
        const createUserId = await this.mongoDB.create(this.collection, {
            name,
            email,
            password: hashedPassword
        })
        return createUserId
    }
    async getOrCreateUser({user}){
        const queriUser = await this.getUser({email: user.email})
        if(queriUser){
            return queriUser
        }
        await this.createUser({user})
        return await this.getUser({email: user.email})
    }
}

module.exports = UsersService