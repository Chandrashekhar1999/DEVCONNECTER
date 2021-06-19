const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route GET api/Auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await user.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route GET api/Auth
//@desc Authentication user ang get Token
router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "Password is required").exists({}),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: "In valid Credentials" }] });
      }
      // see if users exits

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ roken });
        }
      );
      //return jsonwebtoken
    } catch (err) {
      console.error(err.message);
      res.status(500), send("Server error");
    }
  }
);

module.exports = router;
