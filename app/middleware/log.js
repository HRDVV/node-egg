module.exports = config => async (ctx, next) => {
    console.log(`logger level is ${config.level}`)
    await next()
}