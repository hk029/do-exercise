const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const fs = require('fs');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
let data = fs.readFileSync('./mock/answer.json');
let users = fs.readFileSync('./mock/users.json');
data = JSON.parse(data);
users = JSON.parse(users);

app.use(serve(__dirname + "/dist"));

const getQuestions = async (ctx) => {
    let json = { code: 200, data }
    ctx.cookies.set('cookiename', 'cookievalue');//cookie
    ctx.status = 200;//设置状态码
    ctx.body = json;//发送数据
}

const merge = (a,b) => [...new Set([...a, ...b])]

const getUser = async (ctx) => {
    const rb = ctx.request.body;
    let name = rb.name;
    let json = { code: 200, data: users }
    // console.log(ctx.request, rb);
    ctx.cookies.set('cookiename', 'cookievalue');//cookie
    if(!name) {
        json.code = 400;
        json.error = '请输入同步码'
    } else {
        let info = users[name];
        // 合并数据
        if(users[name]) {
            // 取最大的index
            info.index = Math.max(info.index, rb.info.index);
            // 合并
            info.errorList = merge(info.errorList, rb.info.errorList);
            info.correctList = merge(info.correctList, rb.info.correctList);
        } else {
            info = rb.info;
            users[name] = rb.info;
        }
        console.log('user', name, info);
        json.data = {name, info};
        fs.writeFileSync('./mock/users.json', JSON.stringify(users));
    }
    ctx.status = 200;//设置状态码
    ctx.body = json;//发送数据
}
router.get('/api/questions', getQuestions);

router.post('/api/user', getUser);

app.use(bodyParser());
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());

app.listen(9002);