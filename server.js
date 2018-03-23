var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongodb = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var passport = require('passport')
var TwitterStrategy = require("passport-twitter").Strategy
var session = require('express-session')
var bodyParser = require('body-parser')
var MongoStore = require('connect-mongo')(session);
var db = mongoose.connection;
var User = require('/app/schema/User');
var pins;
mongoose.connect(process.env.MONGODB)
app.use((session)(
  {
    secret: 'adljndakfushfw8dsf#23r53*4184fn#$%^*H*#*', 
    resave: true, saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      activeDuration: 30 * 24 * 60 * 60 * 1000,
    },
    store : new MongoStore({
      mongooseConnection : mongoose.connection
    })
   }
));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(express.static('app'))

var consumerKey = process.env.CLIENTID,
    consumerSecret = process.env.SECRETID,
    callback = process.env.CALLBACKURL

passport.use(new TwitterStrategy({
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    callbackURL: callback
  },
  function(accessToken, refreshToken, profile, done) {
    var searchQuery = {
      name: profile.displayName,
      username: profile.username,
    };
    var updates = {
      name: profile.displayName,
      someID: profile.id,
      username: profile.username
    };
    var options = {
      upsert: true
    };
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

mongodb.connect(process.env.MONGODB2, function (err, client){
  if (err) {
    console.log(err)
  }
  var db = client.db('pins')
  var collection = db.collection('pins')
  pins = collection
})

function getByUser(req, res, newData){
  pins.find({$or: [{username: req.body.username}, {reblogged: { $in: [req.body.username]}}]}).toArray((err, data)=>{
    if (err)
      console.log(err) 
    if (newData) {
      var send = [data, newData]
      res.send(send)
    } else {
      res.send(data)
    }
  })
}
  
app.get("/login", passport.authenticate('twitter'));
app.get('/api/authorization', passport.authenticate('twitter', { successRedirect: '/home', failureRedirect: '/login' }))
app.post('/logout', function(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err)
      res.send(false)
    } else {
      res.send(true);
    }
  });
});
app.get("/authorized", function (req, res) {
  if (req.session.passport) {
    User.findById(req.session.passport.user, function(err, user) {
      if (err)
        console.log(err);
      var sendUser = {
        name: user.name,
        username: user.username
      }
      res.send(sendUser)
    });
  } else {
    res.send(false)
  }
});
app.post("/add", function (req, res) {
  pins.insert(req.body,function(err, data){
    if (err)
      console.log(err)
    var newData = data.ops[0]
    getByUser(req, res, newData);
  })
})
app.get("/getByUser", function (req, res) {
  var reqBody = {
    body: req.query
  }
  getByUser(reqBody, res);
})
app.get("/getAll", function (req, res) {
  pins.find({}).toArray((err, data)=>{
    if (err)
      console.log(err)
    res.send(data)
  })
})
app.get("/getRecent", function (req, res) {
  pins.find({}).sort({$natural:-1}).limit(5).toArray((err, data)=>{
    if (err)
      console.log(err)
    res.send(data)
  })
})
app.delete("/delete", function (req, res) {
  pins.remove({_id: ObjectId(req.query.id)}, function(err, data){
    if (err)
      console.log(err)
    var reqBody = {
      body: {username: req.query.username}
    }
    getByUser(reqBody, res);
  })
})
app.delete("/deleteReblog", function (req, res) {
  pins.update({_id: ObjectId(JSON.parse(req.query.pin)._id)}, {$pull: {reblogged:req.query.username}}, function(err, data){
    if (err)
      console.log(err)
    var reqBody = {
      body: {username: req.query.username}
    }
    getByUser(reqBody, res);
  })
})
app.put("/like", function (req, res) {
  pins.findAndModify({_id: ObjectId(req.body._id), username: {$ne: req.body.myUsername}}, {}, {$addToSet: {voted: req.body.myUsername}}, {new: true}, function(err, data){
    if (err)
      console.log(err)
    if (data.lastErrorObject.updatedExisting){
      res.send(data.value)
    } else if (!data.lastErrorObject.updatedExisting){
      res.send("No Update")
    }
  })
})
app.put("/reblog", function (req, res) {
  pins.findAndModify(
    {_id: ObjectId(req.body.pin._id), username: {$ne: req.body.username}, reblogged:{$not: { $in: [req.body.username]}}},
    {},
    {$addToSet:{reblogged: req.body.username}},
    {new: true}, 
    function(err, data){
      if (err)
        console.log(err)
      if (data.lastErrorObject.updatedExisting) {
        res.send(data.value)
      } else {
        res.send("No Update")
      }
    }
  )
})
app.get("/*", function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.listen(process.env.PORT,function () {
  console.log('Your app is listening on port ' + process.env.PORT);
});
