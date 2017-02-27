/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('movieApp.services',[]).factory('Movie',function($resource,$http){
    return $resource('/api/v1/user/movies/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
}).service('searchService',function($window, $q,$http){


    this.search = function(movie) {
      console.log("FROM SERVICE " + movie) ;
    return $http.get('/api/v1/movies/search?q=' + movie )
           .then(
              function (response) {
                    console.log("Response = " + response);
                    return response;
              },function(error){
                  console.error("An Erorr occured. ") ;
                    return error;
              });
      };

      this.searchUserMovies = function(searchBy, value) {
        return $http.get('/api/v1/user/movies/search?by=' + searchBy +"&value="+value )
               .then(
                  function (response) {
                        console.log("Response = " + response);
                        return response;
                  },function(error){
                      console.error("An Erorr occured. ") ;
                        return error;
                  });
          };
      }
);
