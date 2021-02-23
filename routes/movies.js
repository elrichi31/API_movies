const express = require("express")
const MoviesService = require("../services/movies")
const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require("../utils/schema/movies")
const validationHandler = require("../utils/middlewares/validationHandler")
const cacheResponse = require("../utils/cacheResponse")
const {FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS} = require("../utils/time")

const moviesApi = (app) => {
    const router = express.Router()
    app.use("/api/movies", router)
    const MoviesServices = new MoviesService()

    router.get('/', async function(req, res, next) {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS)

        const {tags} = req.query
        try {
            const movies = await MoviesServices.getMovies({tags})
            res.status(200).json({
                data: movies,
                msg: "movies listed"
            })
        } catch (err){
            next(err)
        }
    })
    router.get('/:movieId',validationHandler({movieId: movieIdSchema}, 'params'), async function(req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
        const {movieId} = req.params
        try{
            const movie = await MoviesServices.getMovie({movieId})
            res.status(200).json({
                data: movie,
                msg: 'movie retrived'
            })
        } catch (err){
            next(err)
        }
    })
    router.post('/', validationHandler(createMovieSchema), async function(req, res, next) {
        const {body: movie} = req
        try{
            const createMovieId = await MoviesServices.createMovie({movie})
            res.status(201).json({
                data: createMovieId,
                msg: 'movie created'
            })
        } catch (err){
            next(err)
        }
    })
    router.put('/:movieId', validationHandler({movieId: movieIdSchema}, 'params'), validationHandler(updateMovieSchema) ,async function(req, res, next) {
        const {body: movie} = req
        const {movieId} = req.params
        try{
            const updatedMovieId = await MoviesServices.updateMovie({movieId, movie})
            res.status(200).json({
                data: updatedMovieId,
                msg: 'movie updated'
            })
        } catch (err){
            next(err)
        }
    })
    router.delete('/:movieId', validationHandler({movieId: movieIdSchema}, 'params'), async function(req, res, next) {
        const {movieId} = req.params
        try{
            const deletedMovie = await  MoviesServices.deleteMovie({movieId})
            res.status(200).json({
                data: deletedMovie,
                msg: 'movie deleted'
            })
        } catch (err){
            next(err)
        }
    })
}

module.exports = moviesApi 