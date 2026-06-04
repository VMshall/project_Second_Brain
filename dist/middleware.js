import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
export const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header, JWT_PASSWORD);
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "you're not logged in "
            });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: "You're not logged in"
        });
    }
};
//# sourceMappingURL=middleware.js.map