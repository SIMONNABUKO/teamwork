const express = require('express');

const router = express.Router();

// @route /articles/test
// @desc Testing /articles route
// @access public route
router.get('/test', (req, res) => {
    res.json({
        msg: `Your /articles route is working great and so no need to worry!`
    });
});

module.exports = router;