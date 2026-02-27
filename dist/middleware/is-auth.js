import jwt from "jsonwebtoken";
;
export const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid authorization format." });
    }
    ;
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Your token has expired. Please login again." });
        }
        ;
        return res.status(401).json({ message: "Invalid token, Please login." });
    }
    req.userId = decodedToken.userId;
};
