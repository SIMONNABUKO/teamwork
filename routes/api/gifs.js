const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const { verifyUser } = require('../../authorize');
const db = require('../../dbConnection');

// @route /gifs/test
// @desc Testing /gifs route
// @access public route
router.post('', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, data) => {
    if (error) {
      res.status(500).json({
        status: 'error',
        msg: 'Token verification problem'
      });
    } else {
      const { title, imageurl } = req.body;
      const createdon = new Date(Date.now()).toISOString();
      db.query(
        'INSERT INTO gifs (title, imageurl,createdon) VALUES ($1, $2, $3)',
        [title, imageurl, createdon]
      )
        .then(() => {
          res.status(200).json({
            status: 'success',
            message: 'Gif image successfully posted',
            data
          });
        })
        .catch(err => console.log(err));
    }
  });
});
// Get one gif
router.get('/:id', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, user) => {
    if (err) {
      res.status(503).json({
        status: 'error',
        msg: 'Problem verifying user token'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM gifs WHERE id = $1', [id]).then(result => {
        if (result.rows.length <= 0) {
          res.status(404).json({
            status: 'error',
            msg: 'gif not found'
          });
        } else {
          const gif = result.rows;

          db.query('SELECT * FROM gifcomments WHERE gifid = $1', [id]).then(
            result2 => {
              const comment = result2.rows;

              res.status(200).json({
                status: 'success',
                gif,
                comment,
                user
              });
            }
          );
        }
      });
    }
  });
});

router.delete('/:id', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, user) => {
    if (err) {
      res.status(403).json({
        status: 'error',
        message: 'Error verifying user token'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM gifs WHERE id = $1', [id])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error!',
              msg: 'Item with such an ID not found'
            });
          } else {
            db.query('DELETE FROM gifs WHERE  id = $1', [id])
              .then(() => {
                res.status(200).json({
                  status: 'success',
                  message: 'gif post successfully deleted',
                  user
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
router.post('/:gifid/comment', verifyUser, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, data) => {
    if (error) {
      res.status(503).json({
        status: 'error',
        msg: 'Problem verifying the user information'
      });
    } else {
      const { gifid } = req.params;
      const { comment } = req.body;
      db.query('SELECT * FROM gifs WHERE id = $1', [gifid])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error',
              msg: 'Not gif with that id found'
            });
          } else {
            db.query(
              'INSERT INTO gifcomments (gifid, comment) VALUES ($1, $2)',
              [gifid, comment]
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
router.delete('/:gifid/comment/:id', verifyUser, (req, res) => {
  // verify token
  jwt.verify(req.token, 'secretkey', (err, user) => {
    if (err) {
      res.status(503).json({
        status: 'error',
        msg: 'unable to verify the user'
      });
    } else {
      const { id } = req.params;
      db.query('SELECT * FROM gifcomments WHERE id = $1', [id])
        .then(result => {
          if (result.rows.length <= 0) {
            res.status(404).json({
              status: 'error',
              msg: 'Comment with that id not found'
            });
          } else {
            db.query('DELETE FROM gifcomments WHERE id = $1', [id]).then(() => {
              res.status(200).json({
                status: 'success',
                msg: 'Comment deleted successfully',
                user
              });
            });
          }
        })
        .catch(error => console.log(error));
    }
  });
});

module.exports = router;
