juke.factory('AlbumFactory', function($q, $http, $log){
  var albumFactoryObj = {};
  albumFactoryObj.fetchAll = function(){
    return $http.get('/api/albums/');
  };
  albumFactoryObj.fetchById = function(albumId){
    return $http.get('/api/albums/' + albumId);
  };
  return albumFactoryObj;
});


juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});
