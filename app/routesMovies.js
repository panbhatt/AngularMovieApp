var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn ;
var omdb = require('omdb');
var async = require('async') ;
var Movie = require('./models/movie');

module.exports = function(app, passport) {

// normal routes ===============================================================


    app.get('/api/v1/movies/search', function(req, res) {
        var title = req.param('q');
        console.log('TITLE RECEIVED = ' + title) ;
        var result = [] ;
        if(req.isAuthenticated() )  {
        omdb.search(title , function(err, movies) {
                if(err) {
                    return console.error(err);
                }

                if(movies.length < 1) {
                     console.log('No movies were found!');
                     res.json([]).status(200);
                } else {

                async.each(movies, function(movie,callback){
                  omdb.get({imdb:movie.imdb},function(err,mo){
                     result.push(mo);
                     callback();
                  })
                },function(er){
                  if(!err) {
                      res.json(result).status(200);
                  }
                });
              }

            });
          } else {
            res.json({}).status(401) ;
          }
    });


    app.post('/api/v1/user/movies', function(req,res){
        if(req.user && req.isAuthenticated()) {
           var data = req.body.data;

           var mov = new Movie({
             userid : req.user._id ,
             title : data.title,
             year : data.year,
             "actors" :data.actors,
             "genres" : data.genres,
             "plot" : data.plot,
             "imdbid" : data.imdb.id,
             "year" : data.year,
             "writers" : data.writers,
             "poster" :data.poster
           });

           mov.save(function(err) {
              if(err) {
                res.json({"err" : "Error occured" + err} ).status(500);
              } else {
                res.json({ }).status(200) ;
              }
           })

        } else {
          res.status(401).json({});
        }

    }) ;

    app.get('/api/v1/user/movies', function(req,res){
        if(req.user && req.isAuthenticated()) {

            var userId = req.user._id;
            Movie.find({ "userid" : userId}, function(err,movies) {
                if(err) {
                  res.json({}).status(500);
                } else {
                  res.json(movies).status(200);
                }
            })
        } else {
          res.status(401).json({});
        }

    }) ;

    app.get('/api/v1/user/movies/search',function(req,res){
      if(req.user && req.isAuthenticated() ){
         var userId = req.user._id;
         var searchBy = req.param("by");
         var value = req.param("value");
         var findQuery = {};

         if(searchBy)
         findQuery[searchBy]  = new RegExp(value,"i");


         Movie.find(findQuery,(err, results) => {
             if(!err) {
               res.json(results).status(200);
             } else {
               res.status(500).json({"err" : "Error occrued " + err}) ;
             }
         })

      } else {
        res.status(401).json({});
      }
    })



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();


    res.redirect('/');
}

function isLoggedInProfile(req, res, next) {
    if (req.isAuthenticated())
        return next();


    res.redirect('/login');
}

}
