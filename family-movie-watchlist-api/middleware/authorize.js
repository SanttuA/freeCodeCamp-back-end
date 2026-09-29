// feedback: user story for this is not clear
export function authorizeModification(req, res, next){
    const {role, id} = req.user
    
    /*
        rules:
        if parent -> ok
        if child and ids match -> ok
    */
    if(role === "parent"){
        next()
    }
    else if(role === "child" && req.params.userId == id){
        next()
    }
    else{
        return res.status(403).json({error: "Access denied"})
    }
}
