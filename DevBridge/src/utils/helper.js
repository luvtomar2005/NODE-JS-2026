const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName , lastName, emailId , passWord} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email id is not valid");
    }
    else if(!validator.isStrongPassword(passWord)){
        throw new Error("Enter a strong password");
    }
}


const validateEditProfileData = (data) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "photoUrl",
    "age",
    "gender",
  ];

  const isUpdateAllowed = Object.keys(data).every((field) =>
    allowedUpdates.includes(field)
  );

  return isUpdateAllowed;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData
}