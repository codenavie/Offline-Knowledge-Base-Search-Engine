const authService = require("../services/authService");

function register(req, res, next) {
  try {
    const result = authService.register(req.body || {});
    res.status(201).json(result);
  } catch (error) {
    error.status = 400;
    next(error);
  }
}

function login(req, res, next) {
  try {
    const result = authService.login(req.body || {});
    res.json(result);
  } catch (error) {
    error.status = 401;
    next(error);
  }
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  me
};
