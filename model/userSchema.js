const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  cpassword:{
    type:String,
    required:true
  },
  store:{
    type:String,
    required:true
  },
  tokens: [
    {
      token: {
        type:String,
        required:true
      }
    }
  ]
});

userSchema.methods.generateAuthToken = async function(){
  try {
      const token = jwt.sign({_id:this._id},"thisisamritkumarfromgayailovetolearnnewthingsthanku");
      this.tokens = this.tokens.concat({token:token})
      await this.save();
      return token;
  } catch (error) {
    res.send(error);
    console.log(error);
  }
}


const User = mongoose.model("detail",userSchema);
module.exports = User;
