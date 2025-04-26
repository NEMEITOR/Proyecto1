const authService = require('../services/auth.service');

// Inicio de sesion
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await authService.loginUser(email, password);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};