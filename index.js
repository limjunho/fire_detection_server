"use strict";

const port = 3000;
const express = require("express");
const app = express();

// Router init
const fireDetectionRouter = require("./routes/fireDetection");
const pushAlramRouter = require("./routes/pushAlram");
const userRouter = require("./routes/user");
const serviceRouter = require("./routes/service");

// 요청해독을 초기화 (default : utf-8)
app.use(express.urlencoded({ extended: false }));

// 요청 해독을 json으로 진행
app.use(express.json());

// 요청 데이터를 분석하는 미들웨어
// 미들웨어란 애플리케이션 로직과의 데이터 교환 전에 대기, 분석, 필터링 및 HTTP통신을 다루는 코드를 일컫는 일반적인 용어
app.use(function (req, res, next) {
  console.log("[Middle] ## Received HTTP Request ##");
  console.log("[Middle] Request : " + req.method + " " + req.url);
  console.log("[Middle] Content-Type : " + req.header("Content-Type"));

  next();
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

// Route start
app.use("/fire", fireDetectionRouter);
app.use("/push", pushAlramRouter);
app.use("/users", userRouter);
app.use("/service", serviceRouter);
app.use("/images", express.static("\images"));
app.use("/evacuation_guide", express.static("\evacuation_guide"));

// 서버실행
app.listen(port, function () {
  console.log("Server port : ", port);
});
