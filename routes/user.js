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

// user join POST API
router.post("/join", function (req, res) {
  sql =
    "INSERT INTO user(user_index, device_token, latitude, longitude) VALUES(?,?,?,?)";
  insert_params = [
    ,
    req.body.device_token,
    req.body.latitude,
    req.body.longitude,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      sql = 
        "SELECT user_index FROM user ORDER BY user_index DESC LIMIT 1;";
      connection.query(sql, insert_params, function (err, rows, fields) {
        res.status(200).send(rows[0]);
      });
    }
  });
});

// device token update API
router.put("/devicetoken", function (req, res) {
  sql =
    "UPDATE user SET device_token = ? WHERE user_index = ?";
  insert_params = [
    req.body.device_token,
    req.body.user_index,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      res.status(200).send("device token update success");
    }
  });
});

// position update API
router.put("/position", function (req, res) {
  sql =
    "UPDATE user SET latitude = ?, longitude = ? WHERE user_index = ?";
  insert_params = [
    req.body.latitude,
    req.body.longitude,
    req.body.user_index,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      res.status(200).send("position update success");
    }
  });
});

module.exports = router;
