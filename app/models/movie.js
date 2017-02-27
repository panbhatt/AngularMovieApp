// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var movieSchema = mongoose.Schema({
  "userid" : "String",
  "title": {
      "type": "String"
    },
  "actors" :[ String],
  "genres" : [String],
  "plot" : String,
  "imdbid" : String,
  "year" : Number,
  "writers" : [String],
  "poster" : String

});


// checking if password is valid
movieSchema.methods.sampleMethod = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Movie', movieSchema);
