const bcrpyt = require("bcrypt")
const { dbconnect, disconnectDB } = require("../db/db.connection")
const userModel = require("../db/db.usermodel")
const sessionUpdate = require("../helper/sessionupdate")

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please fill all the required fields." })
    }

    const hashPassword = bcrpyt.hashSync(password, 10)

    const userobj = { username, email, password: hashPassword }

    try {
        await dbconnect()
        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ error: "This email is already in use" })
        }

        const newUser = await userModel.create({ ...userobj })

        if(newUser){
            sessionUpdate(newUser, res)
        }
        return res.status(200).json({ newUser, message: "User registered." })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" })
    } finally {
        await disconnectDB()
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." })
    }

    try {
        await dbconnect()
        const isUser = await userModel.findOne({ email })
        
        if (!isUser) {
            return res.status(401).json({ error: "Invalid Credentials" })
        }
        const isMatch = bcrpyt.compareSync(password, isUser.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" })
        }

        if(isUser){
            sessionUpdate(isUser, res)
        }
        return res.status(200).json({ message: "Login Succes :)" })
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong, please try again letter." })
    } finally {
        await disconnectDB()
    }
}