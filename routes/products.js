var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let products = await productSchema.find({});
    res.send(products);
});

router.get('/:id', async function(req, res, next) {
    try {
        let product = await productSchema.findById(req.params.id);
        res.send({
            success:true,
            data:product
        });
    } catch (error) {
        res.status(404).send({
            success:false,
            message:error.message
        })
    }
});

router.post('/', async function(req, res, next) {
    try {
        let body = req.body;
        let newProduct = productSchema({
            name:body.name,
            price:body.price?body.price:1000,
            quantity:body.quantity?body.quantity:10,
            category: body.category
        });
        await newProduct.save()
        res.status(200).send({
            success:true,
            data:newProduct
        });
    } catch (error) {
        res.status(404).send({
            success:false,
            message:error.message
        })
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        let body = req.body;
        let updatedObj = {}
        if(body.name){
            updatedObj.name = body.name
        }
        if(body.quantity){
            updatedObj.quantity = body.quantity
        }
        if(body.price){
            updatedObj.price = body.price
        }
        if(body.category){
            updatedObj.category = body.category
        }
        let updatedProduct =  await productSchema.findByIdAndUpdate(req.params.id,updatedObj,{new:true})
        res.status(200).send({
            success:true,
            data:updatedProduct
        });
    } catch (error) {
        res.status(404).send({
            success:false,
            message:error.message
        })
    }
});
router.delete('/:id', async function(req, res, next) {
    try {
        let body = req.body;
        let updatedProduct =  await productSchema.findByIdAndUpdate(req.params.id,{
            isDeleted:true
        },{new:true})
        res.status(200).send({
            success:true,
            data:updatedProduct
        });
    } catch (error) {
        res.status(404).send({
            success:false,
            message:error.message
        })
    }
});


module.exports = router;
