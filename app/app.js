const egg = require('../egg-core')
const Koa = require('koa')
const app = new Koa()

egg(app)

app.use(async (ctx, next) => {
    ctx.service.shopCart.addCart()
    console.log(ctx.config)
    console.log(ctx.service)
    ctx.body = ctx.service.user.getUserInfo()
})



app.listen(3000, () => {
    console.log('server started')
})

