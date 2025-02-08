const { dbconnect, disconnectDB } = require("../db/db.connection")
const userModel = require("../db/db.usermodel")
const { v2 } = require("cloudinary");
const { Readable } = require("stream");
const sessionUpdate = require("../helper/sessionupdate")

v2.config({
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

module.exports.userProfile = async (req, res) => {
    const { userid } = req.params
    
    try {
        await dbconnect()
        const user = await userModel.findById(userid)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong" })
    } finally {
        await disconnectDB()
    }
}

module.exports.getAllUsers = async (req, res) => {
    console.log(req.params);

    try {
        await dbconnect()
        const allusers = await userModel.find({})
        return res.status(200).json(allusers)
    } catch (error) {
        return res.status(500).json({ error: "Error fetching users" })
    } finally {
        await disconnectDB()
    }
}

module.exports.deleteUserById = async (req, res) => {
    const { userid } = req.params

    if (!userid) {
        return res.status(400).json({ error: "User not found" })
    }

    try {
        await dbconnect()
        const delUser = await userModel.findByIdAndDelete({ _id: userid })
        return res.status(200).json(delUser)
    } catch (error) {
        return res.status(500).json({ error: "Error deleting your account" })
    } finally {
        await disconnectDB()
    }
}

module.exports.logout = (req, res) => {
    try {
        res.clearCookie("session_token", { path: "/" });
        return res.redirect("/auth/login");
    } catch (error) {
        return res.status(500).json({ error: "Unable to logout" });
    }
};

module.exports.updateUser = async (req, res) => {
    const body = req.body

    if (!body.id) {
        return res.status(400).json({ error: "Can't find your account id please login again" })
    }

    for (let key in body) {
        if (!body[key] || body[key] == undefined) {
            delete body[key]
        }
    }

    try {
        await dbconnect()
        const updatedUserData = await userModel.findByIdAndUpdate({ _id: body.id }, { ...body }, { new: true })

        if (updatedUserData) {
            sessionUpdate(updatedUserData, res)
        }
        return res.status(200).json(updatedUserData)
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong." })
    } finally {
        await disconnectDB()
    }
}

module.exports.followController = async (req, res) => {
    const { userid, tofollow } = req.params

    if (!userid || !tofollow) {
        return res.status(400).json({ messsage: "Bad request" })
    }

    try {
        await dbconnect()

        const currUserFollowing = await userModel.findById(userid)

        if (currUserFollowing.followings.includes(tofollow)) {
            currUserFollowing.followings = currUserFollowing.followings.filter((data) => data.toString() != tofollow)
        } else {
            currUserFollowing.followings.push(tofollow)
        }

        const followerUpdate = await userModel.findById(tofollow)

        if (followerUpdate.followers.includes(userid)) {
            followerUpdate.followers = followerUpdate.followers.filter((data) => data.toString() != userid)
        } else {
            followerUpdate.followers.push(userid)
        }

        await currUserFollowing.save()
        await followerUpdate.save()

        return res.status(200).json({ message: `${currUserFollowing.name} started following ${followerUpdate.name}` })
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong` })
    }
}

module.exports.uploadProfileImage = async (req, res) => {
    const file = req.file
    const { userid } = req.params;

    try {
        const buffer = file.buffer
        const stream = Readable.from(buffer)

        try {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = v2.uploader.upload_stream({ resource_type: "auto" }, (err, res) => err ? reject(err) : resolve(res))
                stream.pipe(uploadStream)
            })
            const { secure_url } = uploadResult

            try {
                await dbconnect()
                const updatedUser = await userModel.findByIdAndUpdate(userid, { image: secure_url }, { new: true })
                
                if(updatedUser){
                    sessionUpdate(updatedUser, res)
                }

                return res.status(200).json({ message: "Profile picture has been updated." })
            } catch (error) {
                console.log("Err updatinf user image in db: ", error);
                return res.status(400).json({ error: "An error occured uploading your image, try again!" })
            } finally {
                await disconnectDB()
            }
        } catch (error) {
            console.log("Err uploading to cloudinary: ", error);
            return res.status(400).json({ error: "An error occured uploading your image, try again!" })
        }
    } catch (error) {
        console.log("Err generating stram: ", error);
        return res.status(400).json({ error: "An error occured uploading your image, try again!" })
    }
}