const mongoose = require('mongoose');
const Items = require('../models/item');


module.exports = {};


module.exports.createItem = async (userId, itemTitle, itemPrice) => {
    //console.log("DAO  - create items")
    const addedItems = await Items.create({_id:userId, title:itemTitle, price:itemPrice});
    return addedItems;
}

module.exports.updateItem = async (userId, itemTitle, itemPrice) => {
    //console.log("DAO  - update items")
    const updatedItem = await Items.updateOne({_id:userId}, {title:itemTitle, price:itemPrice});
    return updatedItem;
}

module.exports.getItem = async (userId) => {
    //console.log("DAO  - update items")
    const updatedItem = await Items.findOne({_id:userId});
    return updatedItem;
}

module.exports.getAllItems = async () => {
    //console.log("DAO  - update items")
    const returnAllItems = await Items.find().lean();
    return returnAllItems;
}







class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
