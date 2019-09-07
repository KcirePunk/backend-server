const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../models/usuario');
const mdAutenticacion = require('../middlewares/autenticacion');
//const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

// ===========================================
// Obeter todos los usuarios
// ===========================================
app.get('/', (req, res, next) => {

    Usuario.find({}, "nombre email img role")
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando usuario',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    usuarios
                });
            });
});

// ==================================
// Verificar token
// ==================================

// app.use('/', (req, res, next) => {

//     let token = req.query.token;
//     jwt.verify(token, SEED, (err, decoded) => {

//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 message: 'Token incorrecto',
//                 errors: err
//             });
//         }

//         next();

//     });

// });

// ===========================================
// Crear usuario
// ===========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });


});

// ===========================================
// Actualizar Usuario
// ===========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe',
                errors: {
                    message: 'No existe un usuario por un id'
                }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ===========================================
// Borrar Usuario por id
// ===========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe usuario con ese id'
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;