let server = require('./server'); //server 모듈을 index가 생성
let router = require('./router'); //router 모듈도 index가 생성
let requestHandler = require('./RequestHandler');

const mariadb = require('./database/connet/mariadb');
mariadb.connect();

server.start(router.route, requestHandler.handle); //server모듈의 srtart함수를 실행 시킬떄 router모듈에 있는 route를 전달 해줌  

