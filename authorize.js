const verifyUser = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // call next middleware
        next();
    } else {
        res.status(403).json({ msg: `unathorized` });
    }
};
module.exports = {
    verifyUser
};