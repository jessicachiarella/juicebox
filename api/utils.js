function requireUser(req, res, next) {
  try {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action",
      }) ;
    } else {
      next()
    }
  } catch (error) {
    console.error(error)
  }
}

function requireActiveUser(req, res, next) {
  console.log(req.user.active, "REQ USER")
  try {
    if (!req.user.active) {
      next({
        name: "InactiveUserError",
        message: "You must be an active user to perform this action",
      }) ;
    } else {
      next()
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  requireUser,
  requireActiveUser,
};
