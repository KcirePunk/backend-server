const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');
const SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrecta - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrecta - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14000 }); // 4 horas

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });
    });
});

module.exports = app;