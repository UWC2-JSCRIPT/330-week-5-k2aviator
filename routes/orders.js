const { Router } = require("express");
const router = Router();

const ordersDAO = require('../daos/orders');
const itemsDAO = require('../daos/items');
const isAuthorized = require('../utils/isauthorized.js');
const isAdmin = require('../utils/isadmin.js');
const e = require("express");

router.use(isAuthorized)

router.post("/", async (req, res, next) => {
    try {
        // console.log("ITEMS POST ROUTE")
        let userId = req.user._id
        let orderItems = []
        let orderPrices = []
        let orderStatus = true;
        for (let i = 0; i < req.body.length; i++){
            const orderItem = await itemsDAO.getItem(req.body[i])
            if (!orderItem){
                orderStatus = false;
                res.status(400).send("Bad item id")
            } else {
                orderItems.push(orderItem)
            }
        }
        
        if (!orderStatus == true ){
            res.status(400).send("Bad item id")
        }
        let orderTotal = orderItems.reduce((acc, cur) => acc + cur.price,0);
        //console.log("to pass to order create function ", userId,orderItems,orderTotal, orderStatus)
        const createdOrder = await ordersDAO.createOrder(userId,orderItems,orderTotal)
        //console.log("final created order is ", createdOrder)
        return res.json(createdOrder)
        next()
    } catch(e) {
        next(e)
    }
});


router.get("/", async (req, res, next) => {
    try {
        //console.log("ORDERS GET ALL ROUTE")
        //console.log("do some administrative post function here")
        //console.log('request user is ', req.user)
        const userRoles = req.user.roles
        const isUser = userRoles.includes('user')
        const isAdmin = userRoles.includes('admin')
        const userId = req.user._id
        //console.log("is user ", isUser, " is admin ", isAdmin, " user id ", userId)
        const getOrder = await ordersDAO.getOrder(isAdmin, userId)
        //console.log("get order result ", getOrder, " is admin? ", isAdmin)
        return res.json(getOrder)
        next()
    } catch(e) {
        next(e)
    }
});


router.get("/:id", async (req, res, next) => {
    try {
        //console.log("GET BY ID ROUTE")
        const userRoles = req.user.roles
        const isUser = userRoles.includes('user')
        const isAdmin = userRoles.includes('admin')
        let userId = req.user._id
        const orderId = req.params.id
        const getOrderById = await ordersDAO.getOrderById(isAdmin, userId, orderId)
        //console.log("returned order is ", getOrderById)
        if (getOrderById == "false"){
            res.status(404).send("cannot find order")
        } else {
            return res.json(getOrderById)

        }
        next()
    } catch(e) {
        next(e)
    }
});


module.exports = router;