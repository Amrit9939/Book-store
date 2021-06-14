const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

require("../db/conn");
const User = require("../model/userSchema");
const Store = require("../model/storeSchema");


const router = express.Router();


// This is Home Route with signup and signin and stores navigation links are available.
router.get("/",async function(req,res){
  res.json({message:"Home page"})
});

// This is signup Route Where user can register their store and during the register store is get created with unique name.
router.post("/signup",async function(req,res){
  const {name,email,store,password,cpassword } = req.body;

  if(!name || !email || !store || !password || !cpassword){
    return res.status(420).json({error:"plese fill all"});
  }

  try {
    const userExist = await User.findOne({email:email});
    const storeExist = await User.findOne({store:store});
     if(userExist){
       return res.status(422).json({error: "Email already exist"});
     }
     else if(storeExist){
       return res.status(422).json({error: "store already exist"});
     }
     else if(password !== cpassword){
       return res.status(422).json({error: "password are not matching"});
     }
     else{
       const new_user = new User({name,email,store,password,cpassword});
       await new_user.save();
       const new_store = new Store({store});
       new_store.save();
       res.json({message:"succes"});
     }


  } catch (err) {
    console.log(err);
  }
});


//This is signin route where user can login and then create or delete their books from their stores
router.post("/signin",async function(req,res){
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(420).json({error:"plese fill all"});
  }

  try {

    const user = await User.findOne({email:email});
    if(!user){
      return res.status(400).json({error:"invalid credintial"});
    }
    else{
      if(password===user.password){

        const token = await user.generateAuthToken();
        return res.json({acces:token});
      }
      else {
        return res.status(400).json({error:"invalid credintial"});
      }
    }

  } catch (err) {
    console.log(err);
  }

});

// This route is protected this is only acces by store owner after signin, store owner can insert new books
router.post("/insert", verify ,async function(req,res){
  try {
    const store = req.body.store;
    const books = req.body.books;


    const result = await Store.update({store:store},{$push:{books:books}});
    if(result){
      res.json({message:"data inserted"});
    }

  } catch (err) {
      return res.status(401).json({error:err});
  }
});


// This route is protected this is only acces by store owner after signin, store owner can delete books
router.post("/delete",verify,async function(req,res){
  try {
    const store = req.body.store;
    const title = req.body.books[0].title;
   console.log(title);
  const result = await Store.update({ store: store },
    { $pull: { books:{title:title} }}
   );

if(result){
  res.status(200).json({message:"data deleted"});
}

  } catch (err) {
    console.log(err);
  }
})

// This is middleware for checking authorisation. for inserting and deleteing vaild owner with their token
async function verify(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token==null) return res.status(401).json({message:"no authorise"});

  await jwt.verify(token,"thisisamritkumarfromgayailovetolearnnewthingsthanku",(err,id)=>{
    if(err) return res.status(403).json({message:"no authorise"});
    console.log(id);
    next();
  });
}

// This is public route users can see all stores
router.get("/stores",async function(req,res){
    try {
      console.log(req.query);
      if(Object.keys(req.query).length === 0){
        const stores = await Store.find({});
        return res.json({data:stores});
      }else {
        const store = await Store.findOne({store:req.query.storename});
        return res.json({data:store});
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({error:err});
    }
});


// This is also public route where users can increse or decrese the stock of books
router.post("/stores",async function(req,res){
  try {
    const newstock = req.body.books[0].stock;
    const title = req.body.books[0].title;
    const store = req.query.storename;
    console.log(newstock);

    await Store.updateOne(
   { store: store,"books.title":title},
   { $set: { "books.$.stock" : newstock } }
);
res.json({message: "stock updated"})

   }

    catch (err) {
    return res.status(401).json({error:err});
  }
});











module.exports = router;
