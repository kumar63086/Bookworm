
const User = require('../model/User.model')
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const genareteToken = (userId) => {
  return  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })

}
exports.register = async (req, res) => {

    try {
        const { Username, email, password } = req.body
        // Check for required fields first
        if (!Username || !email || !password) {
            return res.status(400).send("All fields are required")
        }
        // Then check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).send("Email already exists")
        }
        if (Username.length < 3) {
            return res.status(400).json({ message: "Username should be at least 3 characters" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters" })
        }
        //then check the username
        const existingUsername = await User.findOne({ Username })
        if (existingUsername) {
            return res.status(400).send("Username already exists")
        }
        // get random avatar
        const ProfileImages = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Username}`

        // Hash password and save user
        const hashpassword = await bcryptjs.hash(password, 10)
        const user = new User({ Username, email, password: hashpassword, ProfileImage: ProfileImages })
        await user.save()
        const token = genareteToken(user._id)
        //console.log(token)
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                Username: user.Username,
                email: user.email,
                ProfileImage: user.ProfileImage
            },
            message: "Registered Successfully"
        })

    } catch (error) {
        console.log("error:", error.message);
        res.status(500).send("Server error")
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send("All fields are required")
        }
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).send("User not found")
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send("Invalid Credentials")
        }
        const token = genareteToken(user._id)
        //console.log(token)
        res.status(200).json({
        token,
            user: {
                _id: user._id,
                Username: user.Username,
                email: user.email,
                ProfileImage: user.ProfileImage
            },
            message: "Logged In Successfully"
        })
    } catch (error) {
        console.log("error:", error.message);
        res.status(500).send("Server error")
    }

}