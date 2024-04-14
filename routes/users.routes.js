const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { check } = require("express-validator");

router.get("/", getAllUsers);
router.get(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  getOneUser
);
router.post(
  "/",
  [
    check("name", "Campo nombre vacío").notEmpty(),
    check("email", "Campo correo electrónico vacío").notEmpty(),
    check("email", "Formato de correo electrónico inválido").isEmail(),
    check("pass", "Campo contraseña vacío").notEmpty(),
    check(
      "pass",
      "Formato de contraseña inválido. Mínimo de 8 caracteres"
    ).isLength({ min: 8 }),
  ],
  createUser
);
router.post(
  "/login",
  [
    check("email", "Campo correo electrónico vacío").notEmpty(),
    check("email", "Formato de correo electrónico inválido").isEmail(),
    check("pass", "Campo contraseña vacío").notEmpty(),
    check(
      "pass",
      "Formato de contraseña inválido. Mínimo de 8 caracteres"
    ).isLength({ min: 8 }),
  ],
  loginUser
);
router.put(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  updateUser
);
router.delete(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  deleteUser
);

module.exports = router;
