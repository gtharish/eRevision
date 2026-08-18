import jwt from "jsonwebtoken";

const fetchUser = async (req, res, next) => {
  const authtoken = req.header("Authorization");
    if (!authtoken || !authtoken.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "no token provided, access denied"
        });
    }
    const token = authtoken.split(" ")[1];
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "invalid or expired token"
        });
    }
};

export default fetchUser;
