const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); // bcrypt hashcode

// Register
router.post("/register", async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);
    }
})

//login
router.post("/login", async(req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
        // const salt = await bcrypt.genSalt(10);
        // const hashedPass = await bcrypt.hash(req.body.password, salt)
        const checkPass = await bcrypt.compare(req.body.password, user.password)
        if (checkPass) {
            try {
                const { password, ...others } = user._doc;
                return res.status(200).json(others);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        return res.status(500).json("wrong...")
    }
    return res.status(500).json("wrong...")
})

module.exports = router