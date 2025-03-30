import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const token = req.cookies.token;
     
    if(!token){
        res.status(400).json({ message: "Not Authorized" });
    }

    try {
        const passDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!passDecoded){
            res.status(400).json({ message: "Not Authorized" });
        }

        req.body.userId = passDecoded.id;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export default userAuth;