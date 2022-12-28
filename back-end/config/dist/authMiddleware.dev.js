"use strict";

var jwt = require('jsonwebtoken');

require('dotenv').config();

var authMiddleware = function authMiddleware(req, res, next) {
  var accsessToken, token, tokenInfo;
  return regeneratorRuntime.async(function authMiddleware$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          accsessToken = req.header('Authorization');

          if (!(accsessToken == null || accsessToken == undefined)) {
            _context.next = 5;
            break;
          }

          res.status(401).json({
            success: false,
            errorMessage: 'Authrization fail (null token)'
          });
          _context.next = 17;
          break;

        case 5:
          _context.prev = 5;
          token = accsessToken.split('')[1];
          _context.next = 9;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
              if (err) {
                reject(err);
                ;
              } else {
                resolve(decoded);
              }
            });
          }));

        case 9:
          tokenInfo = _context.sent;
          req.tokenInfo = tokenInfo;
          next();
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](5);
          res.status(401).json({
            success: false,
            errorMessage: result.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 14]]);
};

module.exports = authMiddleware;