"use strict";

// Router init
const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// DB Connection init
const connection = require("../database/dbConn");
let sql;
let insert_params;

// FCM init
const admin = require("firebase-admin");


let serviceAccount = require("../firen-68a36-firebase-adminsdk-awc9s-37f6758659.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// push API
router.post('/', (req, res, next) => {
  let notification_range = req.body.notification_range;
  let target_token = new Array();

  // 유저 찾는 비즈니스 로직
  console.log(req.body.title);
  console.log(req.body.body);
  notification_range = notification_range / 1000;

  // 위,경도 범위 내에 있는 유저를 찾는 SQL문
  sql = "SELECT *,(6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude) -radians(?))+sin(radians(?))*sin(radians(latitude)))) AS distance FROM user HAVING distance <= ? ORDER BY distance LIMIT 0,300";
  insert_params = [
    req.body.latitude,
    req.body.longitude,
    req.body.latitude,
    notification_range
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      for(let i = 0; i < Object.keys(rows).length; i++){
        target_token.push(rows[i].device_token);
      }

      let message = {
        notification: {
          title: req.body.title,
          body: req.body.body,
        },
        data: {
          service_index: req.body.service_index,
          isFire: req.body.isFire,
          image_path: req.body.image_path,
        },
        tokens: target_token,
        priority: "high",
      }
     
      admin
        .messaging()
        .sendMulticast(message)
        .then(function (response) {
          res.status(200).send("push success");
          console.log('Successfully sent message: : ', response)
        })
        .catch(function (err) {
          console.log('Error Sending message!!! : ', err)
          res.status(500).send("push fail");
        })
    }
  });
})

module.exports = router;
