const http = require('http')
const express = require('express')
const axios = require('axios').default
const fs = require('fs')
const multer = require('multer')
const bodyParser = require('body-parser')

let upload = multer({dest: 'uploads/'})
let app = express()

let jsonParser = bodyParser.json()
app.use(jsonParser)
app.use(express.static('public'))

let config = {}
fs.readFile('config.json', 'utf8',function(err, data) {
    if (err) throw err
    config = JSON.parse(data)
    //setConfig(config)
    console.log(config)
})

const FACE_SEARCH_URL = config['face_search_url']
const FACE_ADD_URL = config['face_add_url']
const TOKEN = config['token']
const IMG_PATH = config['image_path']
const FILE_PATH = 'public/images/'
const IMAGE_TYPE = config['image_type']
const GROUP_ID = config['group_id']

// database
//let db = require('./db')

app.get('/test', function() {
    let img = fs.readFileSync(IMG_PATH)
    let img_base_64 = img.toString("base64")
    console.log(img)
    axios.post("", {
        "image": img_base_64,
        "image_type": "BASE64",
        "face_type": "LIVE"
    }).then(function(response) {
        console.log(response)    
    }).catch(function(error) {
        console.log(error)
    })
})

app.post('/search_face', upload.single('image'), function(req, res) {
    
    console.log(req.ip)

    let imgData = req.body.image
    let base64Data = imgData.toString().replace(/^data:image\/\w+;base64,/, "");

    console.log(config['face_search_url'])
    console.log(config['token'])
    axios.post(config['face_search_url'] + config['token'], {
        "image": base64Data,
        "image_type": config['image_type'],
        "group_id_list": config['group_id'],
        "max_face_num": 5
    }).then(function(response) {
        console.log(response.data)
        if (response.data.error_code == 0) {
            //let resdata = {}
            console.log('success')
            let face_list = response.data.result.face_list
            // face_list.forEach(face => {
            //     if (typeof(face) != "undefined") {
            //         face.user_list.forEach(user => {
            //             console.log(user)
            //         })
            //     } 
            // })
            res.json(face_list)
        } else {
            console.log("fail")
            res.send(response.data.error_msg)
        }
        
    }).catch(function(error) {
        res.json(error)
        console.log(error)
    })
    
})

app.get('/hello', function(req, res) {
    res.send('hello')
    res.end()
})
app.post('/addFace', upload.single('new_face'), function(req, res) {

    console.log('Called by ' + req.ip)
    let imgData = req.body.image
    let base64Data = imgData.toString().replace(/^data:image\/\w+;base64,/, "");
    let user_id = req.body.user_id

    axios.post(FACE_ADD_URL + TOKEN, {
        'image': base64Data,
        'image_type': config['image_type'],
        'group_id': config['group_id'],
        'user_id': user_id
    }).then(function(response) {
        let returnData = ''

        
        res.send(returnData)


    }).catch(function(error) {
        res.json(error.data)
    })

})


let server = http.createServer(app)
server.listen(8000, function() {
    //db.testConncet()
    console.log('start at 8000')
})

function setConfig(json) {
    config = json
}
