

function requireUser(req, res, next) {
    try {
        if (!req.user) {
            console.log("hello world")
            throw(
                {
                        name: "MissingUserError",
                        message: "You must be logged in to perform this action"
                      }
            ) 
        
        }
    
        
    } catch (error) {
        console.log("inside utils")
    next(error);
    }
}
  module.exports = {
    requireUser
  }