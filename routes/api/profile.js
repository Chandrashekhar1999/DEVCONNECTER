const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validatorResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route GET api/Profile/me
// get currrrent user profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return (
        res.status(400), json({ msg: "There is no profile for this user" })
      );
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});
//@route GET api/Profile/me
// get currrrent user profile
router.post(
  "/",
  auth,
  [check("status", "Status is required").not().isEmpty()],
  (req, res) => {}
);

module.exports = router;
