const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { check, body } = require("express-validator");
const { upload } = require("../utils/multer");
const auth = require("../utils/auth");

router.get("/", getAllProducts);
router.get(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  getOneProduct
);
router.post(
  "/",
  auth("admin"),
  upload.single("imagen"),
  [
    check("nombre", "El campo nombre está vacío").notEmpty(),
    check(
      "nombre",
      "El campo nombre debe tener al menos 3 caracteres"
    ).isLength({
      min: 3,
    }),
    check("descripcion", "El campo descripción está vacío").notEmpty(),
    check("categoria", "El campo categoría está vacío").notEmpty(),
    check("precio", "El campo precio está vacío").notEmpty(),
    body("imagen").custom((value, { req }) => {
      if (!req.file) {
        throw new Error(
          "El campo imagen está vacío o no tiene un archivo adjunto"
        );
      }
      return true;
    }),
  ],
  createProduct
);
router.put(
  "/:id",
  auth("admin"),
  [check("id", "Formato ID inválido").isMongoId()],
  updateProduct
);
router.delete(
  "/:id",
  auth("admin"),
  [check("id", "Formato ID inválido").isMongoId()],
  deleteProduct
);

module.exports = router;
