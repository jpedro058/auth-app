import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  console.log("Authenticating token...", req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token:", token);

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default authenticateToken;
