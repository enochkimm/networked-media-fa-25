// importing the express library
// always put imports at the top
const express = require('express')

// create an instance of the express app
// just like we do with let date = new Date()
const app = express()

// middleware to set up the public folder to serve basic html files
app.use(express.static('htmls'))

// routes always go before the app.listen
// request: data that comes from the user / client
// response: data that goes back to the user/client
app.get('/', (request, response)=>{
    response.send('server is working')
})

app.get('/submit', (request, response)=>{
    // query is everything that comes after the ? in the url
    // ?guest=sam&message=hi+this+is+a+cool+site%21&submitbtn=write
    console.log(request.query.guest)

    let guest = request.query.guest
    response.send('<html><head><title>💖</title></head><body><h1>thank you</h1> for writing a message, ' + guest+"</body></html>") 
})

// sets up our server
// this should always go at the end of the file
app.listen(5001, ()=>{
    console.log('server started')
})