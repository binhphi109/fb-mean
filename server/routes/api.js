var db = require('../accessDB'), 
    util = require('util');

// GET


exports.login = function (req, res) {
    console.log('*** login');
    var userLogin = req.body.userLogin;
    var userName = userLogin.userName;
    var password = userLogin.password;

    //Simulate login
    res.json({ status: true });
};

exports.logout = function (req, res) {
    console.log('*** logout');

    //Simulate logout
    res.json({ status: true });
};





