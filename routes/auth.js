const express = require('express')
const passport = require('passport')
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const ApiKeysService = require('../services/apiKeys')
const {config} = require('../config')
const UsersService = require('../services/users')
const validationHandler = require('../utils/middlewares/validationHandler')
const {createUserSchema, createProviderUserSchema} = require('../utils/schema/users')

//Basic stategy
require('../utils/auth/strategies/basic')

function authApi(app){
    const router = express.Router()
    app.use('/api/auth', router)
    const apiKeysService = new ApiKeysService()
    const userservice = new UsersService
    router.post('/sign-in', async function(req, res, next){
        const {apiKeyToken} = req.body
        if(!apiKeyToken){
            next(boom.unauthorized('Api key token is required'))
    
        }
        passport.authenticate('basic', function(error, user){
            console.log(user)
            try{
                if (error || !user){
                    next(boom.unauthorized())
                }
                req.logIn(user, {session: false}, async function(error){
                    if(error){
                        next(error)
                    }
                    const apiKey = await apiKeysService.getApiKey({token: apiKeyToken})
                    if(!apiKey){
                        next(boom.unauthorized())
                    }
                    const {_id: id, name, email} = user
                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }
                    const token = jwt.sign(payload, config.authJwtSecret,{
                        expiresIn: '15m'
                    })
                    return res.status(200).json({token, user: {id, name, email}})
                })
            } catch(error){
                next(error)
            }
        })(req, res, next)
    })

    router.post('/sign-up', validationHandler(createUserSchema), async function(req, res, next) {
        const {body: user} = req
        try{
            const createUserId = await usersService.createUser({user})
            res.status(201).json({
                data: createUserId,
                msg: 'user created'
            })
        }catch(error){
            next(error)
        }
    })
    router.post('/sign-provider', validationHandler(createProviderUserSchema), async function (req, res, next) {
        const {body} = req
        const {apiKeyToken, ...user} = body
        if(!apiKeyToken){
            next(boom.unauthorized('api key token is required'))
        }
        try {
            const queriUser = await usersService.getOrCreateUser({user})
            const apiKey = await apiKeysService.getApiKey({token: apiKeyToken})
            if(!apiKey){
                next(boom.unauthorized())
            }
            const {_id: id, name, email} = queriUser
            const payload = {
                sub: id,
                name,
                email,
                scopes: apiKey.scopes
            }
            const token = jwt.sign(payload, config.authJwtSecret, {
                expiresIn: '15m'
            })
            return res.status(200).json({token, user: {id, name, email}})
        } catch (error) {
            next(error)
        }
    })

}
module.exports = authApi 