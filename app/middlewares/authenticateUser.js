const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({ error: 'token not provided' });
    }
    try {
        let tokenData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenData.userId;
        req.role = tokenData.role;
        next();
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = authenticateUser;
