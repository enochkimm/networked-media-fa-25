## cookies (finished)

1. install library

```sh
npm install cookie-parser
```

2. add library import

```js
const cookieParser = require("cookie-parser");
```

3. add middleware

```js
app.use(cookieParser());
```

4. in our `app.get('/')`:

add:

```js
if(req.cookies.visits){
    let newVisits = parseInt(req.cookies.visits) + 1
    const hundredyears = 100 * 385 * 24 * 60 * 60 * 1000
    response.cookie("visits", 1, {expires: new Date(Date.now() + hundredyears)
} else{
    response.cookie("visits", 1, {expires: new Date(Date.now() + hundredyears)})
}
```

and update our `res.render` to use the cookie:

```js
res.render('index.ejs', {messages: data, visitsToSite:newVisits})
```

5. in our `app.get('/like')`

```js
if(req.cookies[messageId] == "set"){
    res.redirect('/')
} else {
    // move other code updating likes in db 
    // update cookie
    response.cookie(messageId, "set", expires: new Date(Date.now() + 1000000000000)})
}
```

## authentication

1. install libraries

```sh
npm install express-session nedb-promises-session-store bcrypt
```

2. import libraries

```js
// ****************************************************************
// NEW libraries to handle sessions, auth, encryption
// ****************************************************************
const expressSession = require('express-session')
const nedbSessionStore = require('nedb-promises-session-store')
const bcrypt = require('bcrypt')
```

3. setup middleware

```js
// ****************************************************************
// NEW middleware to handle sessions, auth, encryption
// ****************************************************************
const nedbSessionInit = nedbSessionStore({
  connect: expressSession,
  filename: 'sessions.txt'
})
app.use(expressSession({
  store: nedbSessionInit,
  cookie: {
	maxAge: 365 * 24* 60 * 60 * 1000
  },
  secret: 'supersecret123'
}))
```

4. under library configurations, create a second database just for users:

```js
let userdatabase = new nedb({
  filename: 'userdb.txt',
  autoload: true
})
```

5. create new routes to render new pages

```js
app.get("/register", (req, res) => {
  res.render("register.ejs", {});
});

app.get('/login', (req, res)=>{
  res.render('login.ejs', {})
})
```

6. add `app.post('/signup')`

```js
app.post('/signup', upload.single('profPic'), (req, res)=>{

  let hashedPassword = bcrypt.hashSync(req.body.password, 10)

  let data = {
	username: req.body.username,
	fullname: req.body.fullname,
	// never store passwords in plaintext
	password: hashedPassword
  }

  userdatabase.insert(data, (err, insertedData)=>{
	console.log(insertedData)
	res.redirect('/login')
  })
})

```

7. add `app.post('/authenticate')`

```js
app.post("/authenticate", (req, res) => {
  let data = {
  	username: req.body.username,
  	password: req.body.password
  }

  let searchedQuery = {
  	username: data.username
  }

  userdatabase.findOne(searchedQuery, (err, user) =>{
  	console.log('attempt login')
  	if(err || user == null){
      	res.redirect('/login')
  	} else{
      	console.log('found user')
      	let encPass = user.password
      	if(bcrypt.compareSync(data.password, encPass)){
          	let session = req.session
          	session.loggedInUser = data.username
          	console.log('successful login')
          	res.redirect('/')
      	} else{
          	res.redirect('/login')
      	}
  	}
  })
```

8. add `app.get('/logout')`

```js
app.get('/logout', (req, res)=>{
    delete req.session.loggedInUser
    res.redirect('/login')
})
```

9. optional: if we want to add custom middleware to ensure the site is locked only to users to have an account

```js
function requiresAuthentication(req, res, next){
    if(req.session.loggedInUser){
        next()
    } else{
        res.redirect('/login')
    }
}

app.get('/', requiresAuthentication, (req, res) =>{
// remove if statement
}
```