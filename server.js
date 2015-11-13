var mongoose = require('mongoose');
var request = require('request');
var _ = require('underscore');

var weight = 5;

var positiveUrl = 'https://raw.githubusercontent.com/dipanjanS/MyShinyApps/master/twitter-analysis/positive_words.txt';

var negativeUrl = 'https://raw.githubusercontent.com/dipanjanS/MyShinyApps/master/twitter-analysis/negative_words.txt';

mongoose.connect('mongodb://localhost/learning');

function arrayToObject(element, index, array){
  // This is taking the wordArray
  // and making each element of
  // it into an object with
  // the element's value being the
  // word, and weight coming from Global
  array[index] = {
    word: element,
    weight: weight
  };
}

function fileToObject(content){

  // take the long list of words,
  // split them at the \n character
  var wordArray = content.split('\n');
  // If we have any empty ones, erase those
  wordArray = _.compact(wordArray);
  // for loop, calling arrayToObject
  // for each element in wordArray
  wordArray.forEach(arrayToObject);

  // _.isString
  return wordArray;
}

function insertObject(object){
  // making object insertable
  /// might just be able to say
  // object.save()?
  var word = new Word({
    word: object.word,
    weight: object.weight
  });

  word.save();
}


var WordSchema = new mongoose.Schema({
  word: String,
  weight: Number
}, {collection: 'words'});

var Word = mongoose.model('Word', WordSchema);

function getWords (url){
    request(url, function (error, response, body) {

      // If we dont have errors and if the
      // status is 200 (a good one),
      if (!error && response.statusCode == 200) {

        // set objectResults equal to whatever
        // fileToObject(body) returns,
        // which should be an array of
        // objects
        var objectResults = fileToObject(body);
        console.log(objectResults);
        objectResults.forEach(insertObject);

        // Since we are only getting two things,
        // We can just the weight to -5 for
        // the negative words. We should have it
        // to the weight is set in the function
        // instead of from Global
        weight = -5;
      }
  });
}

// Get words from this url,
// Whic is going to perform a
// request for those words and
// run through our maze of functions

getWords(positiveUrl);

getWords(negativeUrl);




