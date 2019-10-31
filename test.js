const fs = require('fs')

fs.readFile('config.json', 'utf8',function(err, data) {
    if (err) throw err
    let json = JSON.parse(data)
})