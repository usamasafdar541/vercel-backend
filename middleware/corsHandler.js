// corsMiddleware.js

const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000, http://localhost:4000, http://localhost:5000, http://localhost:5001');
  
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    res.header('Access-Control-Allow-Credentials', true);
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(204); // No content for OPTIONS requests
    } else {
      next();
    }
  };
  
  module.exports = corsMiddleware;
  