/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('movieApp.controllers',[]).controller('MovieListController',function($scope,$state,popupService,searchService,$window,Movie){

    $scope.movies=Movie.query();
    $scope.searchBy = "title";
    $scope.searchValue = "" ;

    $scope.deleteMovie=function(movie){
        if(popupService.showPopup('Really delete this?')){
            movie.$delete(function(){
                $window.location.href='';
            });
        }
    }

    $scope.searchMyMovie = function(){
          $scope.movies = [];
          console.log($scope.searchBy + " ll    " + $scope.searchValue) ;

          searchService.searchUserMovies($scope.searchBy, $scope.searchValue)
          .then(function(results) {
             $scope.movies = results.data;
             
          }, function(err) {
             $scope.movies = [] ;
          });
    }

}).controller('MovieViewController',function($scope,$stateParams,Movie){

    $scope.movie=Movie.get({id:$stateParams.id});

}).controller('MovieCreateController',function($scope,$state,$stateParams,Movie){

    $scope.movie=new Movie();

    $scope.addMovie=function(){
        $scope.movie.$save(function(){
            $state.go('movies');
        });
    }

}).controller('MovieEditController',function($scope,$state,$stateParams,Movie){

    $scope.updateMovie=function(){
        $scope.movie.$update(function(){
            $state.go('movies');
        });
    };

    $scope.loadMovie=function(){
        $scope.movie=Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();
}).controller('MovieSearchController',function($scope,$state,$stateParams,searchService,Movie, $q){

   $scope.title = "" ;
   $scope.movieList = [] ;
   $scope.showResults = false;

    $scope.searchMovie=function(){

        searchService.search($scope.title).then(function(movieData) {
          console.log("MOVIE DATA is = ", movieData);
          $scope.movieList = movieData.data;
          $scope.showResults = true;
        }, function(err) {
          console.err("Error while getting data = " + err);
        });

    };

    $scope.addMovie = function(index){
      var  m = new Movie();
      m.data = $scope.movieList[index];
      console.log('Movie name ' + JSON.stringify($scope.movieList[index]));

      Movie.save(m, function(err) {
         alert("Movie Added. ") ;
      })
    }
});
