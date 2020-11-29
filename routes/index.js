var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let redirectUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/users/' + req.oidc.user.sub;
  console.log(redirectUrl);
  req.oidc.isAuthenticated() ? res.redirect(redirectUrl) : res.render('index', { title: 'Express' });
});

module.exports = router;
