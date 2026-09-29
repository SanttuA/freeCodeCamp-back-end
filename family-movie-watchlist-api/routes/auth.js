import express from "express"
import jwt from "jsonwebtoken"
import {findByUsername} from "../utils/db.js"

const route = express.Router()

route.post("/login", (req, res) => {
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({error: "Username or password missing"})
    }
    const user = findByUsername(username)
    if(!user){
        return res.status(401).json({error: "Invalid user"})
    }
    //users already have hashes without pre-existing hashing/secret
    //compare raw password? unclear..
    if(user._password !== password){
        return res.status(401).json({error: "Invalid user"})
    }

    // make token with user
    const payload = {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
    }

    const options = { expiresIn: "1h"}
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)
    return res.json({message: "Logged in successfully", token})
})

export default route
