const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')





const createUser = async (req, res = response) => {

    const { email, name, password } = req.body;

    try {

        //verificar Email
        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: '¡El email ya esta en uso!'
            });
        }

        //crear user con modelo
        const dbUser = new Usuario(req.body);

        //Hash password
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //generar jsonwebToken
        const token = await generarJWT(dbUser.id, name);

        //crear user
        await dbUser.save();

        //gneerar respuesta exitosa 
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token,
            email
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'se rompio el sv'
        });
    }
}


const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email })

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Email erroeno'
            });
        }

        // confirmar password

        const validPass = bcrypt.compareSync(password, dbUser.password)


        if (!validPass) {
            return res.status(400).json({
                ok: false,
                msg: 'Pass no valido'
            });
        }


        // Generar JWT
        const token = await generarJWT(dbUser.id, dbUser.name);
        // REspuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token,
            email
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'problemaintero'
        });

    }
}


// renovar token
const renewToken = async (req, res) => {

    const { uid} = req;
//lerr database
const dbUser = await Usuario.findById(uid);



    const token = await generarJWT(uid, dbUser.name);
    console.log(res);
    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        token,
        email: dbUser.email
        
        
    });


}


module.exports = {
    createUser,
    loginUser,
    renewToken
}