const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = Schema({
  email :{
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  resetToken: String,
  resetTokenExpiration: Date,
   cart : {
    items : [
      {
        productId : {
          type : Schema.Types.ObjectId,
          ref : 'Product',
          required: true
        },
        quantity : {type : Number, required : true}
      }
    ],
   }
})

userSchema.methods.addToCart= function(product){
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
        productId: product,
        quantity: newQuantity,
      });
    }
    // { items : [] }
    const updatedCart = {
      items: updatedCartItems,
    };
    // update user
      this.cart = updatedCart;
    return this.save()
}

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};


userSchema.methods.clearCart = function(){
  this.cart = {items : []}
  return this.save()
}
module.exports = mongoose.model('User', userSchema);
