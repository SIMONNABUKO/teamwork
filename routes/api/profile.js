const express = require('express');

const router = express.Router();

// @route /profile/test
// @desc Testing /profile route
// @access public route
router.get('/test', (req, res) => {
    res.json({
        msg: `Your /profile route is working great and so no need to worry!`
    });
});

module.exports = router;