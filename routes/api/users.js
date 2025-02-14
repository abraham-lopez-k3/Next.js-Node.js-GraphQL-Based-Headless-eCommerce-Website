const express = require("express");
const router = express.Router();

const APP_KEYS = require("../../config/keys");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const { sendEmail } = require("../../config/helpers");
const mongoose = require('mongoose');
// user model
const User = require("../../models/User");
const ProductCat = require("../../models/ProductCat");
// @route   Post api/posts
// @desc    Registering user
// @access  public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json("Email already exists");
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>{
              res.json({
                name: user.name,
                email: user.email,
                role: user.role,
              })

              // send registration email
              mailData = {
                subject: `Welcome To Ravendel ${user.name}`, 
                mailTemplate: "template"
              }
              sendEmail(mailData, APP_KEYS.smptUser, user.email, res)
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = {};
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json("Invalid credentials");
    }
    // Check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, email: user.email }; // Create JWT Payload

        try {
          // Sign Token
          jwt.sign(
            payload,
            APP_KEYS.jwtSecret,
            { expiresIn: 36000 },
            (err, token) => {
              if(token){
                res.json({
                  success: true,
                  token: token,
                  role: user.role,
                  userId: user.id,
                  name: user.name,
                  image: user.image,
                });
              }else{
                res.json({
                  success: false,
                  token: null
                });
              }
            }
          );
        } catch (e) {
          console.log('e', e)
        }

      } else {
        return res.status(400).json("Invalid credentials");
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get("/current", auth, (req, res) => {

  res.json({
    id: req.user.id,
    name: req.user.name,
    //email: req.user.email
  });
});

// @route   GET api/users
// @desc    Get all users
// @access  Private

router.get("/", auth, (req, res) => {
  const errors = {};

  User.find()
    .select("-password")
    .then((Users) => {
      if (!Users) {
        errors.noprofile = "There is no User";
        return res.status(404).json(errors);
      }
      res.json(Users);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/users
// @desc    Get user by id
// @access  Private

router.get("/:userId", auth, (req, res) => {
  const errors = {};

  User.findOne({ _id:new mongoose.Types.ObjectId( req.params.userId  ) })
    .select("-password")
    .then((user) => {
      if (!user) {
        errors.noprofile = "There is no User";
        return res.status(404).json(errors);
      }
      res.json(user);
    })
    .catch((err) => res.status(404).json(err));
});

router.post("/cattree", async (req, res) => {
  try {
    const cats = await ProductCat.find({}).select("_id parentId name");
    var categories = [...cats];
    categories[0]["children"] = [({ name: "A" }, { name: "B" }, { name: "C" })];
    res.json(categories[0].children[0]);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

module.exports = router;
