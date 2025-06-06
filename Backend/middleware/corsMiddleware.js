// middleware/corsMiddleware.js

const setCORSHeaders = (req, res, next) => {
  // Set CORS headers for all requests
  res.header(
    "Access-Control-Allow-Origin",
    req.headers.origin || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "Content-Disposition, Content-Type, Content-Length, Set-Cookie"
  );

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

const setFileDownloadHeaders = (req, res, next) => {
  // Additional headers specifically for file downloads
  res.header(
    "Access-Control-Allow-Origin",
    req.headers.origin || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Expose-Headers",
    "Content-Disposition, Content-Type, Content-Length"
  );

  next();
};

module.exports = {
  setCORSHeaders,
  setFileDownloadHeaders,
};
