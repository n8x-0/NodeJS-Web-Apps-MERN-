const { dbconnect } = require("../db/db.connection")
const userModel = require("../db/db.usermodel")
const { v2 } = require("cloudinary");
const { Readable } = require("stream");
const { generateToken } = require("../helper/generateTokens");

v2.config({
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

const cache = {}

module.exports.userProfile = async (req, res) => {
    const { userid } = req.params;
    const { specificId } = req.query;

    if (specificId && cache[specificId]) {
        console.log("Cache hit for user profile");
        return res.status(200).json(cache[specificId])
    } else if (!specificId && cache[userid]) {
        console.log("Cache hit for others profile");
        return res.status(200).json(cache[userid])
    }

    try {
        await dbconnect()
        if (!specificId) {
            const user = await userModel.findById(userid)
            delete user._doc.password
            console.log("hit db for user profile");

            if (user) {
                cache[userid] = user
                setTimeout(() => {
                    delete cache[userid]
                }, 60000)
            }

            return res.status(200).json(user)
        } else {
            const user = await userModel.findById(specificId)
            // delete user._doc.password
            console.log("hit db for others profile");

            if (user) {
                cache[specificId] = user
                setTimeout(() => {
                    delete cache[specificId]
                }, 60000)
            }

            return res.status(200).json(user)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports.getAllUsers = async (req, res) => {
    if (cache.allusers) {
        console.log("cache hit for all users");
        return res.status(200).json(cache.allusers)
    }
    try {
        await dbconnect()
        const allusers = await userModel.find({})
        console.log("db hit for all users");
        allusers.forEach((data) => delete data._doc.password)
        cache.allusers = allusers
        setTimeout(() => {
            delete cache.allusers
        }, 120000)
        return res.status(200).json(allusers)
    } catch (error) {
        return res.status(500).json({ error: "Error fetching users" })
    }
}

module.exports.deleteUserById = async (req, res) => {
    const { userid } = req.params

    if (!userid) {
        return res.status(400).json({ error: "User not found" })
    }

    if (cache[deletingThisUserId]) {
        return res.status(200).json({ message: "Your account has been deleted successfully." })
    }

    try {
        await dbconnect()
        await userModel.findByIdAndDelete({ _id: userid })
        const deletingThisUserId = userid
        cache[deletingThisUserId] = true
        setTimeout(() => {
            delete cache[deletingThisUserId]
        }, 9000)
        return res.status(200).json({ message: "Your account has been deleted successfully." })
    } catch (error) {
        return res.status(500).json({ error: "Error deleting your account" })
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

        const token = await generateToken(updatedUserData._id)

        res
            .status(200)
            .cookie("session_token", token)
            .json(updatedUserData)
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong." })
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

                const token = await generateToken(updatedUser._id)

                res
                    .status(200)
                    .cookie("session_token", token)
                    .json({ message: "Profile picture has been updated." })
            } catch (error) {
                console.log("Err updatinf user image in db: ", error);
                return res.status(400).json({ error: "An error occured uploading your image, try again!" })
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