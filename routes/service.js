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

// service list 조회 GET API
router.get("/service-list", function (req, res) {
  sql = "SELECT service_index, location FROM service_list";
  connection.query(sql, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send(rows);
    }
  });
});

// service 조회 GET API
router.get("/serviceinfo", function (req, res) {
  sql = "SELECT location, evacuation_guide FROM service_list WHERE service_index = ?";
  insert_params = [
    req.query.service_index,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send(rows);
    }
  });
});

// service list POST API
router.post("/service-list", function (req, res) {
  sql =
    "INSERT INTO service_list(service_index, location, notification_range, evacuation_guide, latitude, longitude) VALUES(?,?,?,?,?,?)";
  insert_params = [
    ,
    req.body.location,
    req.body.notification_range,
    req.body.evacuation_guide,
    req.body.latitude,
    req.body.longitude,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  });
});

// service list DELETE API
router.delete("/service-list", function (req, res) {
  sql = "DELETE FROM service_list WHERE service_index=?";
  insert_params = [
    req.query.service_index,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  });

  sql = "DELETE FROM detect_information WHERE service_index=?";
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  });

  sql = "DELETE FROM cctv_list WHERE service_index=?";
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  });
});

// CCTV POST API
router.post("/CCTV", function (req, res) {
  sql =
    "INSERT INTO cctv_list(CCTV_index, service_index, area) VALUES(?,?,?)";
  insert_params = [
    ,
    req.body.service_index,
    req.body.area,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  });
});


module.exports = router;