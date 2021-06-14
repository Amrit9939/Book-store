const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  store:{
    type:String
  },
  books:[
    {
      title:{
        type:String
      },
      stock:{
        type:Number
      }
    }
  ]
});

const Store = mongoose.model("store",storeSchema);
module.exports = Store;
