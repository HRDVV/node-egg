const fs = require('fs')
const { resolve } = require('path')
module.exports = {
    addCart () {
        let path = resolve(__dirname, '../', 'shopCart.txt')
        let num = fs.readFileSync(path, 'utf8')
        num++
        fs.writeFileSync(path, num)
    }
}