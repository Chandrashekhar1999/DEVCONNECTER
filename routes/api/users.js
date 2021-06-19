const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

//@route POST api/users
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check(
      "password",
      "please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exits" }] });
      }
      // see if users exits

      // Get users gravater
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "m",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //encrypr password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
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
          console.log("token created", token);
          res.status(201).json({ token });
        }
      );
      //return jsonwebtoken
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
