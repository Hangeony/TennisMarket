function route(pathname, handle, res, productId){
    console.log(`pathname 은 : ${pathname}`);


    if(typeof handle[pathname] === 'function'){
        handle[pathname](res, productId);
    } else {
        res.writeHead(404, {'Content-Type' : 'text/html'});
        res.write('Not Found page.');
        res.end();
    }
}

exports.route = route;