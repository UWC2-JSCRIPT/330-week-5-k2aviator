const mongoose = require('mongoose');

const { ObjectId } = require('mongodb');
const Orders = require('../models/order');
const Items = require('../models/item');



module.exports = {};



module.exports.createOrder = async (userId, items, totalPrice) => {
    //console.log("DAO  - create order")
    //console.log("pass through ", userId, items, totalPrice)
    const createdOrder = await Orders.create({userId: userId, items:items, total:totalPrice});
    return createdOrder;
}


module.exports.getOrder = async (isAdmin, userId) => {
    //console.log("DAO  - get order DAO")
    //console.log("order dao ", isAdmin, userId)
    if (!isAdmin){
        //console.log("is not admin")
        const returnOrder = await Orders.find({userId:userId}).lean();
        return returnOrder;
    } else {
        //console.log('is admin')
        const returnOrder = await Orders.find().lean();
        return returnOrder;
    }
}
    
module.exports.getOrderById = async (isAdmin, userId, orderId) => {
    let newUserId = new ObjectId(userId);
    let newOrderId = new ObjectId(orderId);
    if (!isAdmin){
        //USING LOOKUP
        //console.log("is not admin")
        let orderLookup = await Orders.findOne({_id:newOrderId})     
        let orderTotal = []
        let itemsArray = []
        for (let i = 0; i < orderLookup.items.length; i++){
            let orderItem = orderLookup.items[i];
            let currentItem = await Items.find({_id: {$in: orderLookup.items[i]}})
            let currentItemPrice = currentItem[0].price
            //console.log(currentItemPrice)
            itemsArray.push(currentItem[0])
        }
        orderTotal = itemsArray.reduce((acc, cur) => acc + cur.price,0);
        //console.log("completed items array is ", itemsArray)

        orderLookup.items = itemsArray
        //console.log("user order lookup is ", orderLookup)
        //console.log("order lookup user ", orderLookup.userId)


        const sameUser = orderLookup.userId.toString() == newUserId.toString()
        //console.log("is this order for the user? ", sameUser)
        if (!sameUser == true) {
            //console.log("skip lookup, user doesn't match")
            return "false"
        } else {
            //console.log("order to return is", orderLookup)
            return orderLookup
        }      
    } else {
        //USING LOOKUP
        //console.log("is admin")
        let orderLookup = await Orders.findOne({_id:newOrderId})     
        let orderTotal = []
        let itemsArray = []
        for (let i = 0; i < orderLookup.items.length; i++){
            let orderItem = orderLookup.items[i];
            let currentItem = await Items.find({_id: {$in: orderLookup.items[i]}})
            let currentItemPrice = currentItem[0].price
            //console.log(currentItemPrice)
            itemsArray.push(currentItem[0])
        }

        orderTotal = itemsArray.reduce((acc, cur) => acc + cur.price,0);
        //console.log("completed items array is ", itemsArray)
        orderLookup.items = itemsArray
        //console.log("admin order lookup is ", orderLookup)
        return orderLookup
    }
}
    










class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
