exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
};

exports.getsignUp = (req, res, next) => {
  res.send("This signup works");
};
