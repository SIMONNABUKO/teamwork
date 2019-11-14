const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

const { verifyUser } = require('../../authorize');
const db = require('../../dbConnection');

router.get('', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, userData) => {
    if (error) {
      res.status(503).json({
        status: 'error!',
        error: 'problem verifying user'
      });
    } else {
      db.query('SELECT * FROM gifs')
        .then(gifs => {
          if (gifs.rows.length <= 0) {
            res.status(404).json({
              status: 'error!',
              error: 'returned empty results'
            });
          } else {
            const Allgifs = gifs.rows;
            db.query('SELECT * FROM articles')
              .then(articles => {
                if (articles.rows.length <= 0) {
                  res.status(404).json({
                    status: 'error!',
                    error: 'returned empty results'
                  });
                } else {
                  const allArticles = articles.rows;
                  res.json({
                    status: 'success',
                    allArticles,
                    Allgifs,
                    userData
                  });
                }
              })
              .catch(err => console.log(err));

            // res.status(200).json({
            //   status: 'success',
            //   gifs
            // });
          }
        })
        .catch(err => console.log(err));
    }
  });
});
module.exports = router;
