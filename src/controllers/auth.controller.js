const authService = require('../services/auth.service');
//recibe email y password Registro
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
//recibe email y password Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
//se refresca el token cuando expira en backend 
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }
    const result = await authService.refreshToken(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
//cierra sesion
const logout = async (req, res) => {
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};
//obtiene el usuario actual
const getCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};
//exporta las funciones
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
};
