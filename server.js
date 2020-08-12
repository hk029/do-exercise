const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const fs = require('fs');
const router = require('koa-router')();
let data = fs.readFileSync('./mock/answer.json');
data = JSON.parse(data);

app.use(serve(__dirname + "/dist"));

const getQuestions = async (ctx) => {
    let json = { code: 200, data }
    ctx.cookies.set('cookieName', 'cookieValue');//cookie
    ctx.status = 200;//设置状态码
    ctx.body = json;//发送数据
}

router.get('/api/questions', getQuestions);

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());

app.listen(3000);