const mongoose = require("mongoose");
const validator = require('validator');
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true,
    unique:true,
   validate: {
    validator: function (value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter a valid email");
      }
      return true;
    }
  }


  },
  password: {
    type: String,
    lowercase: true,
    required: true
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
     required: true
  },
  gender: {
    type: String,
    validate: {
      validator: function (value) {
        // Allow only male, female, or other
        return ["male", "female", "other"].includes(value);
      },
      message: props => `"${props.value}" is not a valid gender`
    }
  },
  photo: {
    type: String,
    default: "data:image/jpeg;baAAAQABAAD/2wCEAAsdB//Z"
  },
  skills: {
  type: [String],  // ✅ Capital "S" in String and wrapped in array
  validate: {
    validator: function (value) {
      if (value.length > 10) {
        throw new Error("Fekana mana hai");  // ✅ Capital "E" in Error
      }
      return true;
    }
  }
}

});

module.exports = mongoose.model("User", userSchema);
