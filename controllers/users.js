const { validationResult } = require("express-validator");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res.status(200).json({ msg: "Usuarios encontrados", allUsers });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "No se pudieron encontrar los usuarios", error });
  }
};
const getOneUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const oneUser = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({ msg: "Usuario encontrado", oneUser });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo encontrar el usuario", error });
  }
};
const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const emailExist = await UserModel.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(422).json({
        msg: "El correo electrónico ingresado ya se encuentra registrado",
        status: 422,
      });
    }
    const newUser = new UserModel(req.body);
    // Implementar esta porción de código una vez creados los controladores de carrito
    // if (req.body.role !== "admin") {
    //     const newCart = new CartModel();

    //     newUser.idCart = newCart._id;
    //     newCart.idUser = newUser._id;
    //     await newCart.save();
    //   }
    const salt = bcrypt.genSaltSync();
    newUser.pass = await bcrypt.hash(req.body.pass, salt);

    await newUser.save();
    res.status(201).json({ msg: "Usuario creado correctamente", newUser });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo crear el usuario", error });
  }
};
const updateUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Usuario editado correctamente", updatedUser, status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo editar el usuario", error });
  }
};
const deleteUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete({
      _id: req.params.id,
    });

    res.status(200).json({
      msg: "Usuario eliminado correctamente",
      deletedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo eliminar el usuario", error });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const userExist = await UserModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res.status(422).json({ msg: "El usuario no existe" });
    }

    const passCheck = await bcrypt.compare(req.body.pass, userExist.pass);
    if (!passCheck) {
      return res
        .status(422)
        .json({ msg: "Correo electrónico y/o contraseña incorrectos" });
    }

    const payload_jwt = {
      user: {
        id: userExist._id,
        email: userExist.email,
        role: userExist.role,
      },
    };

    const token = jwt.sign(payload_jwt, process.env.SECRET_KEY);
    res.status(200).json({
      msg: "Sesión iniciada correctamente",
      userExist,
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo iniciar sesión", error });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
