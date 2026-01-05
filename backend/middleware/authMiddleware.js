const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // Check Authorization header OR the 'token' query parameter for video streaming
    let token = req.headers.authorization || req.query.token;

    if (token) {
        try {
            // If the token comes from the header, it usually has 'Bearer ' prefix
            if (token.startsWith('Bearer ')) {
                token = token.split(' ')[1];
            }
            
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user data to the request object
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ msg: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ msg: "No token provided, authorization denied" });
    }
};

// Middleware to restrict access based on user roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                msg: `Role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };