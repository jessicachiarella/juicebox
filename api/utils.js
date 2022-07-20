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

module.exports = {
  requireUser,
};
