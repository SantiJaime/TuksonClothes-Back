const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  pass: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user"
  },
  idCart: {
    type: String,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, pass, ...user } = this.toObject();
  return user;
};

const UserModel = model("usuarios", UserSchema);

module.exports = UserModel;