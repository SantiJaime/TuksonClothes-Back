const { model, Schema } = require("mongoose");

const ProductSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    default: 1,
  },
  categoria: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: true,
  },
});

ProductSchema.methods.toJSON = () => {
    const { __v, ...product } = this.toObject();
    return product;
  };
  
  const ProductModel = model("productos", ProductSchema);
  
  module.exports = ProductModel;