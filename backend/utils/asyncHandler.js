export const asyncHandler = (fn) => async (req , res , next) => {
    try {
        await fn(req , res , next)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message : "Internal Server Error",
            success : false
        })
    }
}