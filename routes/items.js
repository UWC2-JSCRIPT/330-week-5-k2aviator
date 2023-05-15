const { Router } = require("express");
const router = Router();

const itemsDAO = require('../daos/items');
const isAuthorized = require('../utils/isauthorized.js');
const isAdmin = require('../utils/isadmin.js');


router.use(isAuthorized)

router.use(async (req, res, next) => {
    //console.log("ITEMS MIDDLEWARE FUNCTION")
    // console.log("request user is ", req.user)
    // console.log("request body is ", req.body)
    if (req.url === "/logout") {
        res.status(404).send()
    }
    next()
 });


 router.post("/", isAdmin, async (req, res, next) => {
    try {
        // console.log("ITEMS POST ROUTE")
        const createdItem = await itemsDAO.createItem(req.user._id, req.body.title, req.body.price)
        //console.log("created item is ", createdItem)
        return res.json(createdItem)
        next()
    } catch(e) {
        next(e)
    }
});


router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        //console.log("ITEMS PUT ROUTE")
        //console.log("request body is ", req.body)
        const updatedItem = await itemsDAO.updateItem(req.user._id, req.body.title, req.body.price)
        return res.json(updatedItem)
        next()
    } catch(e) {
        next(e)
    }
});


router.get("/", async (req, res, next) => {
    try {
        //console.log("ITEMS GET ALL ROUTE")
        //console.log("do some administrative post function here")
        const getAllItems = await itemsDAO.getAllItems()
        //console.log('received item is ', getAllItems)
        return res.json(getAllItems)
        next()
    } catch(e) {
        next(e)
    }
});



router.get("/:id", async (req, res, next) => {
    try {
        //console.log("ITEMS GET ID ROUTE")
        //console.log("do some administrative post function here")
        //console.log("request params are ", req.params.id)
        const getItem = await itemsDAO.getItem(req.params.id)
        //console.log('received item is ', getItem)
        return res.json(getItem)
        next()
    } catch(e) {
        next(e)
    }
});





module.exports = router;