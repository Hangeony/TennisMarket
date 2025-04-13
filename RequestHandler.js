const mariadb = require('./database/connet/mariadb'); // db 연동
const fs = require('fs'); //fs module 
const mainView = fs.readFileSync('./main.html', 'utf-8'); // mainpage 연동
const orderlistView = fs.readFileSync('./orderList.html', 'utf-8');// order list 연동

function main(res){
    // sql 던질 수 있다.
    mariadb.query("SELECT * FROM product", function(err, rows){
        console.log(`product ${rows}`);
        console.log(`product ${err}`);
    });

    res.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8;'});
    // res.write('한건희');
    res.write(mainView);
    res.end();
}

function redRacket(res){
    fs.readFile('./img/redRacket.png', function(err, data) {
        res.writeHead(200, {'Content-Type' : 'text/html;'});
        res.write(data);
        res.end();
    });
}
function blueRacket(res){
    fs.readFile('./img/blueRacket.png', function(err, data) {
        res.writeHead(200, {'Content-Type' : 'text/html;'});
        res.write(data);
        res.end();
    });
}
function blackRacket(res){
    fs.readFile('./img/blackRacket.png', function(err, data) {
        res.writeHead(200, {'Content-Type' : 'text/html;'});
        res.write(data);
        res.end();
    });
}
function mainCss(res){
    fs.readFile('./main.css', function(err, data) {
        res.writeHead(200, {'Content-Type' : 'text/css;'});
        res.write(data);
        res.end();
    });
}

function order(res, productId){
    res.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8;'});
    const orderDate = new Date().toLocaleDateString();

    let name, description, price;

    if(productId == '1'){
        name = 'Red Racket';
        description = 'Hot Red!';
        price = 30000;
    } else if(productId == '2'){
        name = 'Blue Racket';
        description = 'Cool Blue';
        price = 35000;
    } else {
        name = 'Black Racket';
        description = 'Dark Black';
        price = 50000;
    }

    const sql = "INSERT INTO orderlist (productId, orderDate, name, description, price) VALUES (?, ?, ?, ?, ?)";
    const value =  [productId, orderDate, name, description, price];
  
    mariadb.query(sql,value, function(err, rows){
        console.log(`Insert ${rows}`);
        console.log(`err ${err}`);
    });

    res.write('주문해주셔서 감사합니다 ! <br> 주문상세 페이지에서 확인 할 수 있습니다. <br>');
    res.write('<a href="/">Go Home!</a>');
    res.end();

}

function orderlist(res){
    res.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8;'});
    mariadb.query("SELECT * FROM orderlist", function(err, rows) {
        res.write(orderlistView);
    
            rows.forEach(element => {
                res.write(
                    "<tr>" 
                        + "<td>"+element.productId+"</td>"
                        + "<td>"+element.name+"</td>"
                        + "<td>"+element.description+"</td>"
                        + "<td>"+element.price+"</td>"
                        + "<td>"+element.orderDate+"</td>"
                        + "</tr>"
                    );
                }
            );

            res.write("</table>");
            res.end();

            console.log(`orderlist ${rows}`);
            console.log(`orderlist ${err}`);
        }
    );
}

function favicon(){
}

let handle = {}; // key:value 쌍으로 이루워진 변수
// key  = value
handle['/'] = main;
handle['/order'] = order;
handle['/orderlist'] = orderlist;

// image directory
handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;
handle['/main.css'] = mainCss;

handle['/favicon.ico'] = favicon;
exports.handle = handle;