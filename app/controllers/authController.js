'use strict';
const User = require("../model/user");
const md5 = require('md5');
const jwt = require("jsonwebtoken");

module.exports = {
    authentication:function(req,res){
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            console.log(req.body);
            res.status(400).send({ error: true, message: 'Please provide all required field' });
        } else {
            User.findByPhone(req.body.phone, function (err, data_user) {
                if (err) {
                    res.send(err);
                } else {
                    if (data_user.length > 0 && md5(req.body.password) === data_user[0].password) {
                        const token = jwt.sign({ id: data_user[0].id }, process.env.secret , { expiresIn: '1h' });
                        res.json({ error:false, message: "user found!!!", data: { user: User.getUserResponseLogin(data_user), token: token } });
                    } else {
                        res.json({ error:true, error_msg: "Invalid phone/password!!!", data: null });
                    }
    
                }
            });
        }
    }
}

