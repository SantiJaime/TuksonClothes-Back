const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { check } = require("express-validator");

router.get("/", getAllProducts);
router.get(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  getOneProduct
);
router.post(
  "/",
  [
    check("nombre", "El campo nombre está vacío").notEmpty(),
    check("nombre", "El campo nombre debe tener al menos 3 caracteres").isLength({
      min: 3,
    }),
    check("descripcion", "El campo descripción está vacío").notEmpty(),
    check("categoria", "El campo categoría está vacío").notEmpty(),
    check("imagen", "El campo imágen está vacío").notEmpty(),
    check("precio", "El campo precio está vacío").notEmpty(),
  ],
  createProduct
);
router.put(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  updateProduct
);
router.delete(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  deleteProduct
);

module.exports = router;
