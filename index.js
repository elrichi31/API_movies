const express = require("express")
const app = express()
const {logErrors, errorHandler} = require("./utils/middlewares/errorHandler")
// Configuraciones
const {config} = require("./config/index")
const moviesApi = require("./routes/movies")
const { wrapError } = require("./utils/middlewares/errorHandler")
const notFoundHandler = require("./utils/middlewares/notFoundHandler")
// Middlewares
app.use(express.json())
// Routes
moviesApi(app);
app.use(notFoundHandler)
// Error mangers
app.use(logErrors)
app.use(wrapError)
app.use(errorHandler)
// Puerto
app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`)
}) 