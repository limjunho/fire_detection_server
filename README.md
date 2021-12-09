# fire_detection_server

화재 감지 알림 시스템의 Back-end server.  
화재 감지 클라이언트 및 애플리케이션은 본 repo에 포함하지 않는다.  
[application github](https://github.com/yang2968/FIAS_front-end)

## summary
서비스 제공 지역에서 화재가 발생하는 경우 화재 감지 이미지를 데이터베이스에 저장하고 범위내의 유저에게 화재가 발생했음을 푸시알림을 통해 알린다.  
* **유저에게 제공하는 데이터**
    * 대피도
    * 감지 이미지
    * 화재 또는 연기 발생 시각
    * 화재 또는 연기 발생 장소 ex) 2공장 204호
    * 화재 또는 연기 감지여부
    * 지난 감지 데이터
이때 사전에 서비스 지역을 세팅하는데 세팅 정보에는 서비스 구역의 위,경도 값과 알림 범위를 포함한다.  
화재 감지는 YOLOv5를 사용하며 화재감지 시 서버 API에 request를 보낸다. 

## 프로젝트 관련 문서 path
* **/documents/.**
    * 테이블정의서
    * API 명세서
    * ERD
    * 요구사항정의서
    * workbench mwb

## Environment
* OS - Ubuntu 20.04 LTS
* DBMS - MySQL 8.0.27
* package - npm 6.14.4
* language - Node.js 10.19.0
* framework - express 4.17.1
