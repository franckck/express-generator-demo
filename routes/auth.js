const express = require('express');
var passport = require('passport');
module.exports = (connection) => {
    const authRouter = express.Router();

    authRouter.post('/login', 
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
           res.json({
               error: false,
               user: req.user
           })
        });

    authRouter.post('/register', 
        function(req, res) {
            console.log('req.body', req.body);
            connection.query('INSERT INTO users (username, password) value (?, ?)', 
            [req.body.username, req.body.password], function (error, results, fields) {
                if(error) {
                    return res.json({
                        error: true,
                        message: error.message
                    });
                }
                res.json({
                    error: false,
                    results
                })
            });
        });

    return authRouter;
}
