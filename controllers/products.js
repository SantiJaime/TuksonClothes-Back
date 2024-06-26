const { validationResult } = require("express-validator");
const ProductModel = require("../models/product");
const cloudinary = require("../utils/cloudinaryConfig");

const getAllProducts = async (req, res) => {
  try {
    const allProds = await ProductModel.find();
    const serializedProds = allProds.map((prod) => prod.toObject());

    res
      .status(200)
      .json({ msg: "Productos encontrados", allProds: serializedProds });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "No se pudieron encontrar los productos", error });
  }
};
const getOneProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const oneProd = await ProductModel.findOne({ _id: req.params.id });
    res.status(200).json({ msg: "Producto encontrado", oneProd });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo encontrar el producto", error });
  }
};
const createProduct = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const buffer = Buffer.from(req.file.buffer);
    const newProd = new ProductModel(req.body);

    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
        if (error) {
          console.error(
            "Hubo un error al subir la imagen a Cloudinary:",
            error
          );
          res
            .status(500)
            .json({ msg: "Error al subir la imagen a Cloudinary", error });
          return;
        }
        newProd.imagen = result.secure_url;
        await newProd.save();
        res.status(201).json({
          msg: "Producto creado correctamente",
          newProd: newProd.toObject(),
          status: 201,
        });
      })
      .end(buffer);

  } catch (error) {
    res.status(500).json({ msg: "No se pudo crear el producto", error });
  }
};
const updateProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const editedProduct = await ProductModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Producto actualizado correctamente", editedProduct });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo actualizar el producto", error });
  }
};
const deleteProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    // AGREGAR LA PARTE DE ELIMINAR LA IMG DE CLOUDINARY AL BORRAR PRODUCTO!!!
    await ProductModel.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({ msg: "Producto eliminado correctamente", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo eliminar el producto", error });
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
