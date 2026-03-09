const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid email address : "  + value);
        }
      }
    },
    passWord: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Enter a strong password : " + value);
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    photoUrl: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.LsepWx6o3jwZ-iFTRvUrNgHaHa?w=191&h=191&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("This is not the correct url " + value);
            }
        }
    },
    about: {
      type: String,
      default: "This is the default about of this user!!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
