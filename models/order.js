const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//follwing embedded doc approch instead ref one
const orderSchema = Schema({
    products : [
        {
            product : {type : Object, required : true},
            quantity : {type : Number , required : true }
        }
    ],
    user :{
        name : {
            type : String,
            // required : true
        },
        userId :{
            type : Schema.Types.ObjectId,
            required :true,
            ref : 'User'
        }
    }
})

module.exports = mongoose.model('Order', orderSchema);
