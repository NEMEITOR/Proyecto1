const User = require('../models/user.model'); 
const bcrypt = require('bcryptjs');

exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            throw new Error('El usuario ya existe');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol_id,
            administrador_id
        });

        return newUser;
    } catch (err) {
        throw new Error(`Error al crear el usuario: ${err.message}`);
    }
};

exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
    try {
        const user = await User.findByPk(id);
        if (user.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este usuario no esta bajo su administración');
        }

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                throw new Error('El email ya está en uso');
            }
        }
        await user.update({
            nombre,
            email,
            rol_id,
            administrador_id
        });

        return user;
    } catch (err) {
        throw new Error(`Error al actualizar el usuario: ${err.message}`);
    }
};

exports.getAllUsersByAdministradorId = async (administrador_id, email) => {
    try {
        const whereClause = { administrador_id };
        if (email) {
            whereClause.email = email;
        }
        const users = await User.findAll({ where: whereClause, attributes: { exclude: ['password'] } });
        return users;
    } catch (err) {
        throw new Error(`Error al obtener los usuarios: ${err.message}`);
    }
}


exports.getAllUsersByRolId = async (rol_id) => {
    try {
        const users = await User.findAll({ where: { rol_id }, attributes: { exclude: ['password'] }});
        return users;
    } catch (err) {
        throw new Error(`Error al obtener los usuarios: ${err.message}`);
    }
}

