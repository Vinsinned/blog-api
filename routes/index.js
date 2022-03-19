var express = require('express');
var router = express.Router();

const { body, validationResult, check } = require('express-validator');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const user = require('../models/user');
const app = require('../app');

/* GET home page. */
router.get('/', function (req, res, next) {
  if(req.user){
   //if user exists then go to next middleware
    console.log('YES!')
  } else {
    console.log('null')
  }
  res.render('index', { title: 'Express' });
});

router.get("/sign-up", (req, res) => {
  return res.render('sign_up', { title: 'Sign Up' });
});

router.post('/sign-up', [
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
  check('username').normalizeEmail().isEmail(),
  check('password').exists(),
  check(
    'confirmPassword',
    'Password confirmation field must have the same value as the password field',
  )
  .exists()
  .custom((value, { req }) => value === req.body.password),

  (req, res, next) => { 

    const errors = validationResult(req);

    //Call bcrypt first to avoid having a undefined password!
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) { return next(err) }

      const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword
      })

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('sign_up', { title: 'Sign Up', user: user, errors: errors.array() });
        return;
      }
      else {
        // Data from form is valid.

        // Save author.
        user.save(function (err) {
          if (err) { return next(err); }
          // Successful - redirect to new author record.
          //res.redirect(user.url);
          return res.redirect('/posts');
        });
      }
    });

  }
]);

router.get("/log-in", (req, res) => {
  return res.render('log_in', { title: 'Log In' });
});

//password authenticate is in the middle in order to be verified first before proceeding
router.post("/log-in", passport.authenticate("local"), function (req, res, next) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) { 
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    bcrypt.compare(req.body.password, user.password, (err, rest) => {
      if (rest) {
        // passwords match!
        const secret = "SECRET_KEY" //normally stored in process.env.secret
        const usernameJWT = user.username;
        const token = jwt.sign({ usernameJWT }, secret);
        res.redirect('/')
      } else {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
    })
  });
});

router.get("/log-out", protectRoute, (req, res) => {
  req.logout();
  res.redirect("/");
});

function protectRoute(req,res,next){
  // if user exists the token was sent with the request
  if(req.user){
   //if user exists then go to next middleware
     next();
  }
// token was not sent with request send error to user
  else{
     res.status(500).json({error:'login is required'});
  }
}


module.exports = router;
