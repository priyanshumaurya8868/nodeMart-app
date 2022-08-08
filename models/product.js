const getDB = require("../utils/database").getDb;
const MongoDb = require('mongodb')
class Product {
  constructor(title, price, description, imageUrl,id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? MongoDb.ObjectId(id) : null
  }

  save() {
     const db = getDB();
     let dbOp;
    if(this._id){
      dbOp = db.collection('products')
      .updateOne({_id : this._id},{$set :this})
      console.log("updating..........")
    }else{
    dbOp= db
      .collection("products")
      .insertOne(this)
      console.log("inserting..........")
    }
      return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection("products")
      .find() //return cursor
      .toArray() //get all docs at once in an array
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDB();
    return db
      .collection("products")
      .find({ _id: MongoDb.ObjectId(id) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(id){
    const db = getDB();
    return db.collection('products')
    .deleteOne({_id : MongoDb.ObjectId(id)})
    .then(result=>{
      console.log("Deleted!!")
    })
    .catch(err=>console.log(err))
  }

}

module.exports = Product