
const notFound = (req, res, next) => {
    const error = new Error(`${req.protocol}://${req.hostname}:${process.env.port}${req.url} - Not Found`)
    res.status(404)
    next(error)
}

module.exports = {
    notFound
}