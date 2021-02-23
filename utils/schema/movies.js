const joi = require("@hapi/joi")

const movieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)
const movietitleSchema = joi.string().max(80)
const movieYearSchema = joi.number().min(1888).max(2077)
const movieCoverSchema = joi.string().uri()
const movieDescriptionSchema = joi.string().max(300) 
const movieDurationSchema = joi.number().min(1).max(300)
const movieContentRatingSchema = joi.number().max(5)
const movieTagsSchema = joi.array().items(joi.string().max(50))

const createMovieSchema = {
    title: movietitleSchema.required(),
    year: movieYearSchema.required(),
    cover: movieCoverSchema.required(),    
    description: movieDescriptionSchema.required(),
    duration: movieDurationSchema.required(),
    contentRating: movieContentRatingSchema.required(),
    tags: movieTagsSchema,
}

const updateMovieSchema = {
    title: movietitleSchema,
    year: movieYearSchema,
    cover: movieCoverSchema,    
    description: movieDescriptionSchema,
    duration: movieDurationSchema,
    rating: movieContentRatingSchema,
    tags: movieTagsSchema,
}

module.exports = {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
}