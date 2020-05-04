"use strict";
const http = require("http");
const pug = require("pug");
const qs = require("querystring");
const server = http.createServer((req,res) => {
    const now = new Date();
    console.info(
        '[' + now + '] Requested by ' + req.connection.remoteAddress
    );
    
    res.writeHead(200,{
        "Contesnt-Type":"text/html; charset=utf-8"
    });

    switch(req.method){
        case "GET":
            if(req.url === "/enquetes/yaki-shabu"){
                res.write(pug.renderFile("./form.pug",{
                    path:req.url,
                    firstItem:"焼き肉",
                    secondItem:"しゃぶしゃぶ"
                }));    
            }else if(req.url === "/enquetes/rice-bread"){
                res.write(pug.renderFile("./form.pug",{
                    path:req.url,
                    firstItem:"ごはん",
                    secondItem:"ぱん"
                }));    
            }
            res.end();
            break;
        case "POST":
            let rawData = "";
            req.on("data",chunk => {
                rawData = rawData + chunk;
            }).on("end", () => {
                const decoded = decodeURIComponent(rawData);
                const answer = qs.parse(decoded);
                const name = answer["name"];
                const ans = answer["favorite"];
                console.info("[" + now + "] 投稿: " + name + " / " + ans);
                res.write('<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8" /></head><body><h1>' + name +"さんは" + ans + 'に投票しました</h1></body></html>');
                res.end();
            });
            break;
        default:
            break;
    }
})
.on('error', e => {
  console.error('[' + new Date() + '] Server Error', e);
})
.on('clientError', e => {
  console.error('[' + new Date() + '] Client Error', e);
});

const port = process.env.PORT || 8000;
server.listen(port,() => {
    console.info('[' + new Date() + "] listen:"+port);
});