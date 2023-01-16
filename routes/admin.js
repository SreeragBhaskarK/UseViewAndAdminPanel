var express = require('express');
var router = express.Router();
const productHelper = require("../helpers/product-helpers")
const adminHelper = require('../helpers/admin-helpers');
const userViewHelpers = require('../helpers/userView-helper');

let nav = {}



/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.admin) {
    let adminSession = req.session.admin
    productHelper.getAllProducts().then((products) => {

      res.render('admin/view-products', { admin: true, products, adminSession, nav: { allProducts: true } })

      nav.allProducts = false
      console.log(nav.allProducts, '////////////');

      console.log(products)
    })


  } else {
    res.render('admin/login', { admin: true, noShow: true })

  }

});

router.get('/add-product', function (req, res) {


  if (req.session.admin) {
    let adminSession = req.session.admin

    res.render('admin/add-product', { admin: true, adminSession })
  } else {
    res.render('admin/login', { admin: true, noShow: true })

  }

})

router.post('/add-product', (req, res) => {
  productHelper.addProduct(req.body).then((id) => {

    if (req.files) {
      let image = req.files.Image
      image.mv("./public/product-images/" + id + '.jpg', (err) => {

        if (!err) {
          res.render('admin/add-product', { admin: true })
        }
      })
    } else {
      res.render('admin/add-product', { admin: true })
    }



  })

})





router.get('/delete-product/:id', (req, res) => {


  let proId = req.params.id
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })

})

router.get('/edit-product/:id', async (req, res) => {

  if (req.session.admin) {
    let adminSession = req.session.admin
    let product = await productHelper.getProductDetails(req.params.id)

    res.render('admin/edit-product', { product, admin: true, adminSession })

  } else {
    res.render('admin/login', { admin: true, noShow: true })

  }


})



router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id
  productHelper.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin',)

    if (req.files) {
      let image = req.files.Image
      image.mv("./public/product-images/" + id + '.jpg')

    }



  })





})

router.get('/login', (req, res) => {


  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/login', { "loginErr": req.session.adminLoginErr, admin: true, noShow: true })
    req.session.adminLoginErr = false
  }

})

router.post('/login', (req, res) => {
  adminHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminLoggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin')

    } else {
      req.session.adminLoginErr = "Invalid email and password"
      res.redirect('/admin/login')

    }


  })

})

router.get('/logout', (req, res) => {

  req.session.admin = null
  res.redirect('/admin/login')


})

router.get('/all-user', (req, res) => {
  userViewHelpers.doUserView().then((userView) => {
    if (req.session.admin) {
      let adminSession = req.session.admin

      nav.allUsers = true
      res.render('admin/view-user', { admin: true, adminSession, nav: { allUsers: true }, userView })
      nav.allUsers = false
    } else {
      res.render('admin/login', { admin: true, noShow: true })

    }

  })


})


router.get('/delete-userView/:id', (req, res) => {

  let userId = req.params.id
  userViewHelpers.deleteUserView(userId).then((response) => {
    res.redirect('/admin/all-user')
  })

})

module.exports = router;
