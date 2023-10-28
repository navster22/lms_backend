const LocalStrategy = require('passport-local');
const Users = require('./models/users');
var md5 = require('md5');

const initializePassport = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(username, password, done) {
          console.log(username,password)
          Users.findOne({ email: username })
          .then(user => {
            if (!user) {
                console.log('User doesnot exist',user)
                return done(null, false, {message: 'User doesnot exist'}); 
            }
            if (user.password !== md5(password)) {
                console.log('Password doesnot match')
                return done(null, false); 
            }
            console.log('It passed successfully')
            return done(null, user);
          })
          .catch(err => { return done(err) })
        }
    ));

    passport.serializeUser((user,done) => {
        console.log('In serializeUser')
        done(null,user.id)
    })

    passport.deserializeUser(async (id,done) => {
        console.log('In deserializeUser')
        try{
            const user = await Users.findById(id)
            done(null,user)
        } catch(err) {
            done(error,false)
        }
    })

}

const isAuthenticated = (req,res,next) => {
    console.log(req.user)
    if(req.user) return next()
    res.status(403).json({
        status: 403,
        message: "User is not authorized. Please login first."
    })
}

module.exports = {
    initializePassport,
    isAuthenticated
}