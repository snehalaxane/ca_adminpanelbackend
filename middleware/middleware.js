const adminAuth = (req, res, next) => {
      console.log("ADMIN AUTH SESSION:", req.session);
  if (req.session && req.session.admin) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};




module.exports = adminAuth;
