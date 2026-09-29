import express from "express"
import { authenticate } from "../middleware/authenticate.js"
import { authorizeModification } from "../middleware/authorize.js"
import { getWatchlist, addMovie, updateMovie, deleteMovie } from "../utils/db.js"

const route = express.Router()
route.use(authenticate)

route.get("/:userId", (req, res) => {
    const id = req.params.userId
    // have to convert id to number for db code to work
    const watchlist = getWatchlist(Number(id))
    res.json({watchlist})
})

route.post("/:userId/movies", authorizeModification, (req, res) => {
    const userId = req.params.userId
    addMovie(Number(userId), req.body)
    res.status(201).send()
})

route.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    const userId = req.params.userId
    const movieId = req.params.movieId
    updateMovie(Number(userId), Number(movieId), req.body)
    res.json({message: "Update successful"})
})

route.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    const userId = req.params.userId
    const movieId = req.params.movieId
    deleteMovie(Number(userId), Number(movieId))
    res.json({message: "Delete successful"})
})

export default route
