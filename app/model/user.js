"use strict";
var db = require("../../config/db_config");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const moment = require("moment");

const curDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var User = function (user) {
  this.name = user.name;
  this.username = user.username;
  this.password = bcrypt.hashSync(user.password, 10);
};

User.register = function (data, callback) {
  db.query(
    `INSERT INTO user SET
    fullname = '${data.fullname}',
    email='${data.email}',
    phone = '${data.phone}',
    password = '${md5(data.password)}',
    active = 1,
    acc_status = 1,
    created = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}',
    token = '${md5(data.phone)}',
    gender='${data.gender}',
    bio='NULL',
    em_enk = '${md5(data.phone)}'
    `,
    callback
  );
};

User.findById = (id, callback) => {
  db.query(`SELECT * FROM user WHERE id= '${id}'`, callback);
};

User.findByPhone = (phone, result) => {
  db.query("SELECT * FROM user WHERE phone=? ", phone, (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, JSON.parse(JSON.stringify(res)));
    }
  });
};

User.getUserByPhoneAndPassword = (phone, password, result) => {
  this.findByPhone("089656234771");
};

User.cekPhoneAndEmail = (data, callback) => {
  db.query(
    `SELECT * FROM user WHERE  phone = '${data.phone}' AND email = '${data.email}'`,
    callback
  );
};

User.getUserResponseLogin = (data_user) => {
  return {
    error: false,
    message: "Success",
    em_enk: data_user[0].em_enk,
    user: data_user[0],
  };
};

User.insertToken = (data, callback) => {
  db.query(
    `INSERT INTO token SET
    customer_id = '${data.id}',
    customer_phone='${data.phone}',
    total_token = 0
    `,
    callback
  );
};

User.edit = (data, callback) => {
  const query = `UPDATE user SET phone='${data.phone}', email='${data.email}', updated='${curDate}' WHERE id=${data.usId}`;
  db.query(query, callback);
};

User.editPassword = (data, callback) => {
  const query = `SELECT password FROM user WHERE password='${md5(
    data.password_lama
  )}' AND id='${data.user_id}'`;
  db.query(query, callback);
};

User.editProfile = async (data, callback) => {
  let usId = data.user_id;

  let fullname = data.fullname;
  let email = data.email;
  let birth = data.birth;
  let gender = data.gender;
  let bio = data.bio;
  let link = data.img_profile;

  let user = new Promise((resolve, reject) => {
    User.findById(usId, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  let tmp = await user;

  if (tmp.length > 0) {
    var tmp2 = new Promise((resolve, reject) => {
      const query = `UPDATE user SET fullname='${fullname}', birth='${birth}', gender='${gender}', bio='${bio}', updated='${curDate}' WHERE id=${usId}`;
      db.query(query, (err, rows) => {
        if (err) {
          reject({error:true,message:'Profile failed to update.'});
        }
        resolve({error:true,message:'Profile successfully to update.'});
      });
    });
  }else{
    var tmp2 = {error:true,message:'Profile failed to update.'};
  }
  return tmp2;
};

// query return promise
// User.edit = async (data,callback)=>{
//   return new Promise((resolve,reject) => {
//     const query = `UPDATE user SET phone='${data.phone}', email='${data.email}', updated='${curDate}' WHERE id=${data.usId}`;
//     db.query(query,(err,result)=>{
//       if(err){
//         reject(err)
//       }
//       resolve("ok")
//     });
//   })
// }

module.exports = User;
