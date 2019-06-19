let path = require('path');
let globby = require('globby');

module.exports = app => {
    /**
     * 对项目目录进行约定，app根目录下有config,middleware,service等
     * 项目启动时，装载koa的应用实例，加载config，service并挂载到ctx上, 自动注册中间件
     */
    const appPath = path.resolve(__dirname, '../', 'app')
    const context = app['context']
    const fileKeyList = ['config', 'middleware', 'service']
    const fileAbsoluteMapping = fileKeyList.reduce((prevMapping, curKey) => {
        prevMapping[curKey] = path.resolve(appPath, curKey)
        return prevMapping
    }, {})

    /**
     * 搜索fileAbsoluteMapping下的所有js文件，以实现自动导入，自动注册
     */
    fileKeyList.forEach(dir => {
        let autoWiredDir = dir
        if (dir !== 'middleware') {
            context[autoWiredDir] = {}
        }
        let autoWiredFiles = globby.sync('**/*.js', {
            cwd: fileAbsoluteMapping[dir]
        })
        autoWiredFiles.forEach(filename => {
            let autoWiredFile = path.parse(filename).name
            let code = require(path.resolve(fileAbsoluteMapping[dir], autoWiredFile))
            if (autoWiredDir === 'config' && code) {
                context[autoWiredDir] = Object.assign({}, context['config'], code)
                return
            }
            if (autoWiredDir === 'middleware') {
                let middleware = code(autoWiredFile in context['config'] ? context['config'][autoWiredFile] : undefined)
                app.use(middleware)
                return
            }
            context[autoWiredDir][autoWiredFile] = Object.assign({}, code)
        })
    })
}