const bcrpyt = require("bcrypt")
const { dbconnect } = require("../db/db.connection")
const userModel = require("../db/db.usermodel")
const sessionUpdate = require("../helper/sessionupdate")

const cache = {}

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please fill all the required fields." })
    }
    if (cache[email]) {
        console.log("cache hit");
        return res.status(409).json({ error: "This email is already in use" })
    }

    const hashPassword = bcrpyt.hashSync(password, 10)

    const userobj = { username, email, password: hashPassword }

    try {
        await dbconnect()
        const existingUser = await userModel.findOne({ email })
        console.log("hit db");

        if (existingUser) {
            cache[email] = existingUser;

            setTimeout(() => {
                delete cache[email]
            }, 30000)

            return res.status(409).json({ error: "This email is already in use" })
        }

        const newUser = await userModel.create({ ...userobj })

        if (newUser) {
            sessionUpdate(newUser, res)
        }

        delete newUser._doc.password

        console.log("register seccses");
        return res.status(200).json({ _id: newUser._id, message: "User registered." })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." })
    }


    try {
        let isUser
        if (!cache[email]) {
            await dbconnect();
            isUser = await userModel.findOne({ email })
            console.log("hit db");

            if (isUser) {
                cache[email] = isUser;
                setTimeout(() => {
                    delete cache[email]
                }, 30000)
            }
        } else {
            console.log("cache hit");
            isUser = cache[email]
        }

        if (!isUser) {
            return res.status(401).json({ error: "Invalid Credentials" })
        }
        const isMatch = bcrpyt.compareSync(password, isUser.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" })
        }

        if (isUser) {
            sessionUpdate(isUser, res)
        }

        console.log("login success");
        return res.status(200).json({ _id: isUser._id, message: "Login Succes :)" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong, please try again letter." })
    }
}