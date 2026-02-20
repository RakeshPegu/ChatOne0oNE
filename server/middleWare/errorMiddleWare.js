const errorMid = async(err, req, res, next)=>{
    const statusCode = err.statusCode
    const message = err.message || "Internal Error"
    res.status(statusCode|| 500).json({success:false, message:message})

}
export default errorMid