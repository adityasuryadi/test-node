"use strict";
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const moment = require("moment");
var db = require("../../config/db_config");
const curDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

exports.register = function (req, res) {
  const data = req.body;
  const form_data = {
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    password: md5(data.password),
    token: md5(data.phone),
    date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    gender: data.gender,
  };
  

  // User.findByPhone(form_data.phone, function (err, data_user) {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     if (data_user.length > 0) {
  //       res.json({error:true, message: "Your Telephone or email has already been used" });
  //     } else {
  //       User.register(form_data,function(err,rows){
  //         if(err){
  //           res.json({error:true, message: err });
  //         }else if(rows){
  //           res.json({error:flase, message: "User Created" });
  //         }
  //       });

  //     }
  //   }
  // });
  User.cekPhoneAndEmail(form_data, (err, data_user) => {
    if (err) {
      res.json({ error: true, message: "Error Backend" });
    } else if (data_user && data_user.length >= 1) {
      res.json({ error: true, message: "User Exist" });
    } else if (data_user && data_user.length == 0) {
      User.register(form_data, function (err, rows) {
        if (err) {
          res.json({ error: true, message: err });
        } else if (rows) {
          User.findById(rows.insertId, (err, dta) => {
            if (err) {
              res.json({ error: true, message: err });
            } else if (dta) {
              // console.log(dta[0])
              // res.json({ error: false, message: "User Created" ,data_user:dta});
              User.insertToken(dta[0], (error, response) => {
                if (error) {
                  res.json({ message: error });
                } else {
                  res.json({ error: false, message: "User Created" });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.authenticate = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log(req.body);
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    User.findByPhone(req.body.phone, function (err, data_user) {
      if (err) {
        res.send(err);
      } else {
        if (
          data_user.length > 0 &&
          md5(req.body.password) === data_user[0].password
        ) {
          const token = jwt.sign({ id: data_user[0].id }, process.env.secret, {
            expiresIn: "1h",
          });
          res.json({
            error: false,
            message: "user found!!!",
            data: { user: data_user, token: token },
          });
        } else {
          res.json({
            error: true,
            error_msg: "Invalid phone/password!!!",
            data: null,
          });
        }
      }
    });
  }
};

exports.updatePassword = (req, res) => {
  const data = req.body;
  User.editPassword(data, (err, rows) => {
    if (err) {
      res.json({ erorr: true, message: "Query Failed" });
    } else if (rows.length == 0) {
      res.json({ erorr: true, message: "Old password incorrect." });
    } else if (rows.length > 0) {
      db.query(
        `UPDATE user SET password='${md5(
          data.password_baru
        )}', updated='${curDate}' WHERE password='${md5(
          data.password_lama
        )}' AND id='${data.user_id}'`,
        (err, response) => {
          if (err) {
            res.json({
              erorr: true,
              message: "Password account failed to updated.",
            });
          } else if (response) {
            res.json({
              erorr: false,
              message: "Password account successfully updated",
            });
          }
        }
      );
    }
  });
};

exports.editProfile = async (req, res) => {
  const data = req.body;
  let response  =await User.editProfile(data, (err, rows) => {});
  res.json(response)
};

exports.test = (req, res) => {
  User.findByPhone(req.params.phone, (err, user) => {
    res.json({
      status: "success",
      message: "user found!!!",
      data: { user: user },
    });
  });
};

exports.edit = (req, res) => {
  const data = req.body;
  let response = User.edit(data, (err) => {
    if (err) {
      res.json({ error: true, message: "Error Update" });
    } else {
      res.json({ error: false, message: "Succes Update" });
    }
  });
};
