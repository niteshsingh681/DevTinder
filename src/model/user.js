const mongoose = require("mongoose");
const validator = require("validator");
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
    unique:true
  },
  //password: { type: String, required: true, select: false },

  password: {
    type: String,
    //Lowercase: true, => This is not needed as bcrypt will handle the case and it conflict to hashing 
    required: true,
    unique:true
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
     default: 18,
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
    default: "https://media.licdn.com/dms/image/v2/D5603AQHZSFpBd4Iq6Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723209063568?e=1758153600&v=beta&t=XbK9MvXCRxaeSM2EiEh4s4dd4xe-FB16VRS-8pCYHpw"
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
},
about:{
  type:String,
  default:"hello this is default value of about section "
}

});

module.exports = mongoose.model("User", userSchema);
