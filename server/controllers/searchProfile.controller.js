import { userModel } from "../lib/db.js"

export const searchProfile =async(req, res)=>{
    
    try {
            const username = String(req.query.username ?? "").trim()
            console.log('this is the username', username)
            if (!username) {
                return res.status(400).json({
                    message: "Username is required",
                });
            }
            const matchedUsers = await userModel.find({
            username: {
                $regex: username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i",
            },
            })
            .select("_id username email")
            .limit(20)
            .lean();
        console.log('this is the searchUserList', matchedUsers)

        res.status(200).json({success:true, message:matchedUsers})

        
    } catch (error) {
        res.status(500).json({success:false, message:'Something went wrong'})
        
    }
}