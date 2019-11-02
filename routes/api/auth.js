const express = require('express');

const gravatar = require('gravatar');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const db = require('../../dbConnection');
const giveAccess = require('../../authorize');

const { verifyUser } = giveAccess;

const router = express.Router();

// @route /auth/test
// @desc Testing auth route
// @access public route
router.get('/test', (req, res) => {
    res.json({
        msg: `Your application is working great and so no need to worry!`
    });
});

// @route /auth/signup
// @desc Admin can create user accounts/ register employees
// @access private route
router.post('/signup', verifyUser, (req, res) => {
    // define variables
    const { name, email, username, password } = req.body;
    const avatar = gravatar.url(email, {
        s: '200', // size of the image
        r: 'pg', // Image rating
        d: 'mm' // default image
    });
    // pull the data from the database where email = req.body.email
    db.query('SELECT * FROM users WHERE email = $1', [email])
        .then(result => {
            console.log(result.rows);
            if (result.rows.length > 0) {
                // user exists so throw an error
                res.status(403).json({ error: `Email already in registered` });
                console.log(`The email ${email} is already registered!`);
            } else {
                // User doesn't exist so encrypt the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (error, hash) => {
                        if (error) throw error;
                        const hashedPassword = hash;

                        db.query(
                            'INSERT INTO users (name, email,username,password,avatar) VALUES( $1, $2, $3, $4, $5)', [name, email, username, hashedPassword, avatar]
                        );
                        return res.status(200).json({
                            success: `User with email ${email} successfully inserted into the database`
                        });
                    });
                });
            }
        })
        .catch(err => console.error(err));
});

// @route /auth/signin
// @desc Admin can create user accounts/ register employees returns token
// @access private route
router.post('/signin', (req, res) => {
    // we require email and password from the user
    const { email, password } = req.body;
    // pull data from db and compare them if they match, we log in the user
    db.query('SELECT * FROM users WHERE email = $1', [email])
        .then(result => {
            // If no email, return forbidden

            if (result.rows.length <= 0) {
                res.status(403).json({ email: `User not found` });
            } else {
                // user exists. get user details from db

                const resultsFromDB = result.rows[0];

                // compare passwords using bcrypt
                bcrypt
                    .compare(password, resultsFromDB.password)
                    .then(passwordMatched => {
                        if (passwordMatched) {
                            // return jwt token
                            jwt.sign({ resultsFromDB }, 'secretkey', (error, token) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    res.json(token);
                                    console.log(token);
                                }
                            });
                        } else {
                            res.status(400).json({ password: `Passwords don't match` });
                        }
                    });
            }
        })
        .catch(err => console.error(err));
});

module.exports = router;