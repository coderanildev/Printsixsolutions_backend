const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "defaultSecretKey";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    
    if(decoded?.role === "ADMIN"){
      req.user = decoded;
      next();
    }else{
      return res.status(401).json({ message: "You are not authodrised." });
    }
    
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
