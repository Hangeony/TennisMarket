let http = require('http');
let url = require('url');

function start(route, handle) { //스타트 함수가 실행되면서 route함수를 받고
    function onRequst(req, res) { // 요청 객체 이름 수정 (기본적으로 'onRequest'가 더 일반적임)

        let pathname = url.parse(req.url).pathname; //requst를 받아서 url의 경로를 확인해서
        let queryData = url.parse(req.url, true).query; // request의 url에서 쿼리 데이터 추출

        route(pathname, handle, res, queryData.productId); //url경로를 route함에 넣어둔다.
    }
    
    http.createServer(onRequst).listen(8888);
    //여기까지가 서버를 만들어줌
    //localhost:8888    
}
exports.start = start; //밖에서도 스타트 함수를 실행시키는 문장.