const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelper = require("../helpers/product-helpers")
const userHelpers = require('../helpers/user-helpers')

const verifyLogin = (req, res, next) => {

  if (req.session.userLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }

}

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  productHelper.getAllProducts().then((products) => {

    res.render('user/view-products', { products, user })

  })

});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr, noShow: true })
    req.session.userLoginErr = false
  }


})

router.get('/signup', (req, res) => {

  if(req.session.user){
    res.redirect('/')
  }else{
    signUpErrors = { signupErr: 'An account is already registered with your ', email:req.session.errEmail , signupErrEndLine: ' address Please log in.' }
  
    if (req.session.signUpErrorsShow) {
  
      res.render('user/signup', { signUpErrors, noShow: true })
      req.session.signUpErrorsShow = false
  
    } else {
      res.render('user/signup', { noShow: true })
    }

  }





})

router.post('/signup', (req, res) => {
  userHelpers.doSignUp(req.body).then((response) => {


    if (response) {
      req.session.userLoggedIn = true
      req.session.user = response.user

      res.redirect('/')


    } else {
      req.session.signUpErrorsShow = true
      req.session.errEmail = req.body.email

      res.redirect('/signup')
      


      /*signUpErrors = { signupErr: 'An account is already registered with your ', email: req.body.email, signupErrEndLine: ' address Please log in.' }
       
        res.render('user/signup', { signUpErrors, noShow: true })
       signUpErrors=false
       console.log(signUpErrors); */


      /* "signUpErrors":{'signupErr': 'An account is already registered with your', 'email': req.body.email ,'signupErrEndLine':'address Please log in.'} */


    }




  })

})


router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userLoggedIn = true
      req.session.user = response.user
      res.redirect('/')

    } else {
      req.session.userLoginErr = "Invalid email and password"
      res.redirect('/login')

    }

  })
  console.log(req.body);

})

router.get('/logout', (req, res) => {

  req.session.user = null
  req.session.userLoggedIn = false
  res.redirect('/')


})

router.get('/cart', verifyLogin, (req, res) => {

  res.render('user/cart')
})




module.exports = router;
