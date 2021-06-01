const express = require("express")
const app = express()
const {logErrors, errorHandler} = require("./utils/middlewares/errorHandler")
// Configuraciones
const {config} = require("./config/index")
const moviesApi = require("./routes/movies")
const userMoviesApi = require("./routes/userMovies")
const { wrapError } = require("./utils/middlewares/errorHandler")
const notFoundHandler = require("./utils/middlewares/notFoundHandler")
const authApi = require("./routes/auth")
// Middlewares
app.use(express.json())
// Routes
authApi(app)
moviesApi(app);
userMoviesApi(app)
// Error mangers
app.use(notFoundHandler)
app.use(logErrors)
app.use(wrapError)
app.use(errorHandler)
// Puerto
app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`)
}) 