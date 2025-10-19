// importing the express library
// always put imports at the top
const express = require('express');

// create an instance of the express app
// just like we do with let date = new Date()
const parser = require('body-parser')
const encodedParser = parser.urlencoded( {extended: true })

const app = express()

// middleware to set up the public folder to server basic html files
app.use(express.static('assets'))
app.use(encodedParser)
// setting the templating engine to use ejs
app.set('view engine', 'ejs')


let messages = []

let posts = []

// routes always go before the app.listen
// request: data that comes from the user / client
// response: data that goes back to the user/client
app.get('/', (request, response)=>{
    // response.send('server is working')
    response.render('template.ejs', {})
})

app.get('/submit', (request,response)=>{
    // query is everything that comes 
    console.log(request.query.guest)

    let guest = request.query.guest

    // object that holds the data that comes in from ONE form request
    let messageData = {
        username: request.query.guest,
        text: request.query.message
    }

    messages.push(messageData)

    response.send('thank you for writing a message!' + guest)
})

const uploadProcessor = multer( {dest '/assets/upload/'})


app.get('/all-messages', (request, response)=>{
    let allMesssage = ''
    for(let m of messages) {
        allMessages += m.username + "says" + m.text + "<br/>"
    }
    response.send(allMessages)
})


app.get('/post', (req, res)=>{
    
    let data = {
        allPosts: posts
    }
    res.render('post.ejs', data)
})

app.post('/upload', (req, res)=>{
    console.log(req.body)

    let singlePost = {
        text: req.body.status,
    }

    let date = new Date()
    singlePost.time = date.toLocaleString()

    posts.push(singlePost)

    res.redirect('/post')
})

// sets up our server
// this should always go at the end of the file
app.listen(5001, ()=>{
    console.log('server started')
})

