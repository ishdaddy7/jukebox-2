'use strict';

juke.factory('PlayerFactory', function($rootScope){
  // non-UI logic in here
  var playerFactoryObj = {}
  var audio = document.createElement('audio');
  audio.progress=0;
  audio.playing = false;

  audio.addEventListener('ended', function () {
    playerFactoryObj.next();
    // $scope.$apply(); // triggers $rootScope.$digest, which hits other scopes
    $rootScope.$evalAsync(); // likely best, schedules digest if none happening
  });
  //audio.queue = [];
  audio.addEventListener('timeupdate', function () {
    audio.progress = audio.currentTime / audio.duration;
    console.log(audio.currentTime, audio.duration);
    // $scope.$digest(); // re-computes current template only (this scope)
    $rootScope.$evalAsync(); // likely best, schedules digest if none happening
  });


    playerFactoryObj.start = function (song, songList) {

/*      if (songList === undefined) {
        audio.queue.push(song);
      } else {
        audio.queue.concat(songList);
      }*/
      this.pause();
      if(songList) audio.songList = songList;
      audio.currentSong = song; //audio.queue[0];
      audio.playing = true;
      audio.src = song.audioUrl;
      audio.load();
      audio.play();

    };
    playerFactoryObj.pause = function () {
      audio.playing = false;
      audio.pause();
    };
    playerFactoryObj.resume = function () {
      audio.playing = true;
      audio.play();
    };
    playerFactoryObj.isPlaying = function () {
      return audio.playing || false;
    };
    playerFactoryObj.getCurrentSong = function () {
      return audio.currentSong || null;
    };
    playerFactoryObj.next = function () {
      var currentSongIndex = audio.songList.indexOf(audio.currentSong);
      var nextSongIndex = currentSongIndex + 1;
      if(audio.songList[nextSongIndex]) this.start(audio.songList[nextSongIndex]);
      else this.start(audio.songList[0]);
/*      if (audio.queue.length !== 0) {
        currentSong = audio.queue.shift();
      }
      audio.queue.push(currentSong);
      audio.currentSong = audio.queue[0];
      audio.src = '/api/songs/' + audio.queue[0].id + '/audio';
      audio.resume();*/
    };
    playerFactoryObj.previous = function(){
      var currentSongIndex = audio.songList.indexOf(audio.currentSong);
      var prevSongIndex = currentSongIndex - 1;
      if(audio.songList[prevSongIndex]) this.start(audio.songList[prevSongIndex]);
      else this.start(audio.songList[audio.songList.length-1]);
    };
    playerFactoryObj.getProgress = function(){
      if(audio.playing){
        return audio.progress;
      }
      return audio.progress;
    }
  return playerFactoryObj;
});
