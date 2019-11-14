const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

const { verifyUser } = require('../../authorize');
const db = require('../../dbConnection');

// @route /articles/test
// @desc Testing /articles route
// @access public route
router.get('/test', (req, res) => {
  res.json({
    msg: `Your /articles route is working great and so no need to worry!`
  });
});

router.post('', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, userData) => {
    if (err) {
      res.status(503).json({
        status: 'error!',
        msg: 'Couldnt authenticate the user'
      });
    } else {
      const { article, title } = req.body;
      db.query('INSERT INTO articles (article, title) VALUES ($1, $2)', [
        article,
        title
      ])
        .then(() => {
          res.status(200).json({
            status: 'Success',
            msg: 'The article has been posted successfully',
            user: userData
          });
        })
        .catch(error => console.log(error));
    }
  });
});

router.patch('/:id', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, userData) => {
    if (err) {
      res.status(503).json({
        status: 'Error!',
        msg: 'priblem verifying the user'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM articles WHERE id = $1', [id])
        .then(results => {
          if (results.rows.length <= 0) {
            res.status(404).json({
              status: 'error',
              error: 'article not found'
            });
          } else {
            const { article, title } = req.body;
            db.query(
              'UPDATE articles SET article = $1,title = $2 WHERE id= $3 ',
              [article, title, id]
            )
              .then(() => {
                res.status(200).json({
                  status: 'success',
                  msg: 'article updated successfully',
                  user: userData
                });
              })
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    }
  });
});

// DELETE articles('/:id')
router.delete('/:id', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, userData) => {
    if (err) {
      res.status(503).json({
        status: 'error!',
        error: 'problem verifying the user'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM articles WHERE id = $1', [id])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error!',
              error: 'article not found'
            });
          } else {
            db.query('DELETE FROM articles WHERE id = $1', [id])
              .then(() => {
                res.status(200).json({
                  status: 'success',
                  msg: 'article deleted successfully',
                  user: userData
                });
              })
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    }
  });
});
// GET article/:articleId
router.get('/:id', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, userData) => {
    if (err) {
      res.status(503).json({
        status: 'error!',
        error: 'could not verify the token'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM articles WHERE id= $1 ', [id])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error!',
              error: 'article not found'
            });
          } else {
            db.query('SELECT * FROM articles WHERE id = $1', [id])
              .then(articleData => {
                const article = articleData.rows;
                console.log(article);
                res.status(200).json({
                  status: 'success',
                  article,
                  user: userData
                });
              })
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    }
  });
});

// Add Comments
router.post('/:articleid/comment', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, data) => {
    if (error) {
      res.status(503).json({
        status: 'error',
        msg: 'Problem verifying the user information'
      });
    } else {
      const { articleid } = req.params;
      const { comment } = req.body;
      db.query('SELECT * FROM articles WHERE id = $1', [articleid])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error',
              msg: 'Not article with that id found'
            });
          } else {
            db.query(
              'INSERT INTO articlecomments (articleid, comment) VALUES ($1, $2)',
              [articleid, comment]
            )
              .then(() => {
                res.status(200).json({
                  status: 'success',
                  msg: 'Comment posted successfully',
                  data
                });
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    }
  });
});

// dELETE Comment
router.delete('/:articleid/comment/:id', verifyUser, (req, res) => {
  // verify token
  jwt.verify(req.token, 'secretkey', (err, user) => {
    if (err) {
      res.status(503).json({
        status: 'error',
        msg: 'unable to verify the user'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM articlecomments WHERE id = $1', [id])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error',
              msg: 'Comment with that id not found'
            });
          } else {
            db.query('DELETE FROM articlecomments WHERE id = $1', [id]).then(
              () => {
                res.status(200).json({
                  status: 'success',
                  msg: 'Comment deleted successfully',
                  user
                });
              }
            );
          }
        })
        .catch(error => console.log(error));
    }
  });
});

module.exports = router;
