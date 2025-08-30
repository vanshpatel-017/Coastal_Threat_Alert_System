// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ msg: "No token, access denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified.id;
//     next();
//   } catch (err) {
//     res.status(400).json({ msg: "Token is not valid" });
//   }
// };

// module.exports = auth;


// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1]; // "Bearer <token>"
//   if (!token) return res.status(401).json({ message: "Invalid token format" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = auth;


const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).json({ data: false, message: "Access denied.No token provied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ data: false, message: "Invalid token." })
    }
}

module.exports = auth;

