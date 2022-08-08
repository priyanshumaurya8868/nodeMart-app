const MongoDB = require("mongodb");
const getDb = require("../utils/database").getDb;
class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    (this.cart = cart), //{item : []}
      (this._id = _id);
  }

  save() {
    const _db = getDb();
    return _db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("User regesitered!!");
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    //getting index
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    //increment qty or update existing one
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } // make new entry
    else {
      updatedCartItems.push({
        productId: new MongoDB.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    // { items : [] }
    const updatedCart = {
      items: updatedCartItems,
    };
    // update user
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: MongoDB.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => i.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  deleteItemsFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: MongoDB.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then(result=>
        console.log(result))
        .catch(err=> console.log(err));
  }

  addOrder() {
    const db = getDb();
   return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: MongoDB.ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        return db
          .collection("users")
          .updateOne(
            { _id: MongoDB.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": MongoDB.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: MongoDB.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
