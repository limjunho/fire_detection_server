"use strict";

const express = require("express");
const request = require("request");

// Router init
const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// DB Connection init
const connection = require("../database/dbConn");
let sql;
let insert_params;

// multer init
const multer = require('multer')
const upload = multer({ dest: '\images' }) //dest : 저장 위치

// 화재 감지 정보조회 API(선택 정보 조회)
router.get("/detectinfo", function (req, res) {
  insert_params = [req.query.service_index];

  sql = "SELECT * FROM (SELECT detect_information.*, cctv_list.area FROM cctv_list INNER JOIN detect_information ON cctv_list.CCTV_index = detect_information.CCTV_index) AS result WHERE service_index = ?";
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send(rows);
    }
  });
});

// image post API
router.post('/detectinfo', upload.single('img'), (req, res) => {
  // 감지 데이터 저장
  sql = "INSERT INTO detect_information(idx, service_index, CCTV_index, image_path, detect_time, isFire) VALUES(?,?,?,?,?,?)";
  insert_params = [
    ,
    req.body.service_index,
    req.body.CCTV_index,
    req.file.path,
    req.body.detect_time,
    req.body.isFire,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  })
  
  // 푸시알림 메시지 작성 및 범위 내 유저를 특정하기 위한 정보 조회
  let event = "화재";
  if(req.body.isFire != 1){
    event = "연기";
  }

  sql = "SELECT *, (SELECT area FROM cctv_list WHERE CCTV_index = ?) AS area, (SELECT image_path FROM detect_information WHERE detect_time = ?) AS image_path FROM service_list WHERE service_index = ?";
  insert_params = [
    req.body.CCTV_index,
    req.body.detect_time,
    req.body.service_index,
  ];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      request({
        uri :"http://127.0.0.1:3000/push/",
        method: "POST",
        body: {
          title: event + "발생",
          body: "[" + req.body.detect_time + "] " + rows[0].location + " " + rows[0].area + "에 " + event + "가 발생했습니다.",
          notification_range: rows[0].notification_range,
          latitude: rows[0].latitude,
          longitude: rows[0].longitude,
          service_index: req.body.service_index,
          isFire: req.body.isFire,
          image_path: rows[0].image_path,
        },
        json: true
      });
    }
  })
})

router.delete("/detectinfo", function (req, res) {
  sql = "DELETE * FROM detect_information WHERE service_index = ?";
  insert_params = [req.query.service_index];
  connection.query(sql, insert_params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("server error");
    } else {
      res.status(200).send("success");
    }
  });
});

router.delete("/All-detectinfo", function (req, res) {
  sql = "DELETE FROM detect_information";
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