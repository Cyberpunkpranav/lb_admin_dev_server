import jwt from 'jsonwebtoken'
import { error_response } from '../config/config.js';

export const verifyToken = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token || token === undefined) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }else{
    try {
      token = token.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
      
    } catch (err) {
      
    if (err.name === 'TokenExpiredError') {
      // Handle token expiration
      error_response.data = []
      error_response.message = 'Token expired'
      error_response.status = 401
      return res.status(401).json(error_response);
    }

    if (err.name === 'JsonWebTokenError') {
      error_response.data = []
      error_response.message = err.name
      error_response.status = 403
      return res.json(error_response);
    }
    // Handle other unexpected errors
    error_response.data = []
    error_response.message = err
    error_response.status = 500
    res.status(500).json(error_response);
    }

  }

  // Remove 'Bearer ' from the token if it exists

};
