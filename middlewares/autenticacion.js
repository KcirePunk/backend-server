const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

exports.verificaToken = function(req, res, next) {
    let token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
}