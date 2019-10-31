const express = require('express');

const router = express.Router();

// @route /auth/test
// @desc Testing auth route
// @access public route
router.get('/test', (req, res) => {
    res.json({
        msg: `Your application is working great and so no need to worry!`
    });
});

module.exports = router;