import { Schema, model } from 'mongoose';

const adhaarUser = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  }
})

const panUser = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  }
})

const AdhaarUser = model('AdhaarUser', adhaarUser);
const PanUser = model("PanUser", panUser);

export {AdhaarUser, PanUser}
