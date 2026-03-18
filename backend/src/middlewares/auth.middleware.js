import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  const token = req.cookies?.accessToken || headerToken;

  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    next();
  } catch {
    res.sendStatus(403);
  }
};
