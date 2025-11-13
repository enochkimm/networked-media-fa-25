const express = require('express')

const app = express()

app.use(express.static('public'))

app.get('/all-posts', (req, res)=>{
    let allPosts = [
        {text: "post 1"},
        {text: "post 2"},
        {text: "post 3"},
    ]

    // send data back as json
    res.json({posts: allPosts})
})

app.listen(7001, ()=>{
    console.log('server running on http://127.0.0.1:7001')
})