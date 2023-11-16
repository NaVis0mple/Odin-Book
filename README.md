session : I use mongodb atlas to store the session data, is also can store at local disk use mongodb or other ,
store handled by 'connect-mongo' 
```js
// in session store , connect-mongo 
 app.use(session({
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.mongodbURL })
}))
```
```js
// mongodb connect
main().catch(err => console.log(err))
async function main () {
  await mongoose.connect(process.env.mongodbURL)
}
```
the session will auto update when relogin with save user,and if expire will auto delete fron db, so its good
