import jwt from 'jsonwebtoken'
export const authenticate = (req , res , next) => {
    const { token } = req.cookies;
    if(!token){
        return res.status(401).send({message : "You need to login first" , success : false});
    }
    jwt.verify(token , process.env.SECRET_KEY_JWT , (err , decode)=> {
        if(err){
            return res.status(401).send({message : "Token not valid , Please Contact Admin" , success : false});
        }
        req.user = decode.user;
        next()
    })
}