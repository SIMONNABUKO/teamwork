const express = require('express');

const router = express.Router();

// @route /gifs/test
// @desc Testing /gifs route
// @access public route
router.get('/test', (req, res) => {
    res.json({
        msg: `Your /gifs route is working great and so no need to worry!`
    });
});

module.exports = router;