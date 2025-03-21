var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/role')

router.get('/', async function(req, res, next) {
    let roles = await roleSchema.find({});
    res.send(roles);
});

router.get('/:id', async function(req, res, next) {
    try {
        let role = await roleSchema.findById(req.params.id);
        res.send({
            success:true,
            data:role
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
        let newRole = roleSchema({
            name:body.name,
            description:body.description?body.description:"",
        });
        await newRole.save()
        res.status(200).send({
            success:true,
            data:newRole
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
        if(body.description){
            updatedObj.description = body.description
        }
        let updatedRole =  await roleSchema.findByIdAndUpdate(req.params.id,updatedObj,{new:true})
        res.status(200).send({
            success:true,
            data:updatedRole
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
        let updatedRole =  await roleSchema.findByIdAndUpdate(req.params.id,{
            isDeleted:true
        },{new:true})
        res.status(200).send({
            success:true,
            data:updatedRole
        });
    } catch (error) {
        res.status(404).send({
            success:false,
            message:error.message
        })
    }
});

module.exports = router;