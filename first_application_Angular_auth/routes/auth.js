const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validarToken');



const router = Router();




// crear user
router.post('/new',[

    check('name','Nombre obligatorio!').not().isEmpty(),
    check('email', ' El email es obligatorio').isEmail().isLength(),
    check('password', ' contraseña obligatoria!').isLength({min:6}),
    validarCampos

], createUser);




// login user
router.post('/',[
    check('email', ' El email es obligatorio').isEmail().isLength(),
    check('password', ' contraseña obligatoria!').isLength({min:6}),
    validarCampos
], loginUser);




// revalidar token
router.get('/renew',validarJWT, renewToken);

















module.exports = router;