var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/user')
let roleSchema = require('../schemas/role');


router.get('/', async function (req, res, next) {
  let query = req.query;
  console.log(query);
  let objQuery = {};
  if (query.username) {
    objQuery.username = new RegExp(query.username, 'i')
  } else {
    objQuery.username = new RegExp("", 'i')
  }
  if (query.fullname) {
    objQuery.fullname = new RegExp(query.fullname, 'i')
  } else {
    objQuery.fullname = new RegExp("", 'i')
  }
  if (query.loginCount) {
    objQuery.loginCount = {};
    if (query.loginCount.$gte) {
      objQuery.loginCount.$gte = parseInt(query.loginCount.$gte);
    }
    if (query.loginCount.$lte) {
      objQuery.loginCount.$lte = parseInt(query.loginCount.$lte);
    }
  }
  let users = await userSchema.find(objQuery).populate(
    { path: 'role', select: 'name' }
  );
  res.send(users);
});

router.get('/:id', async function (req, res, next) {
  try {
    let user = await userSchema.findById(req.params.id);
    res.send({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let role = await roleSchema.findById({ name: body.role });
    if (role) {
      let newUser = userSchema({
        username: body.username,
        password: body.password,
        email: body.email,
        fullname: body.fullname || "",
        role: role._id,
        avatarURL: body.avatarURL || "",
        status: false,
        loginCount: 0,
        isDeleted: false
      });
      await newUser.save();
      await newUser.populate('role');
      res.status(200).send({
        success: true,
        data: newUser
      });
    }
    else {
      res.status(404).send({
        success: false,
        message: "Role not found"
      })
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body;
    let updatedObj = {}
    if (body.username) {
      updatedObj.username = body.username
    }
    if (body.email) {
      updatedObj.email = body.email
    }
    if (body.fullname) {
      updatedObj.fullname = body.fullname
    }
    if (body.role) {
      updatedObj.role = body.role
    }
    let updatedUser = await userSchema.findByIdAndUpdate(req.params.id, updatedObj, { new: true })
    res.status(200).send({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let updatedUser = await userSchema.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    }, { new: true })
    res.status(200).send({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

router.post('/activate', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    let user = await userSchema.findOneAndUpdate(
      {
        email: email,
        username: username,
        isDeleted: false
      },
      { status: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found or credentials incorrect'
      });
    }
    res.status(200).send({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;