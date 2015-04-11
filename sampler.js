window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new window.AudioContext();

var rowNumber = 1;
var numberOfColumns = 16;
var sounds = [];
var tempo = 120;

function getMsFromBpm() {
  return 60000/$("#tempo").val();
}

function playSound(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  var masterGain = context.createGain();
  source.connect(masterGain);
  masterGain.gain.value = 0.05;
  masterGain.connect(context.destination);
  source.start(0);
}

function addSound( object, filepath ) {
  var sound;
  var request = new XMLHttpRequest();
  request.open('GET', filepath , true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(theBuffer) {
      sound = theBuffer;
    });

    $(object).click(function() {
        playSound(sound);
    });

    //sequencer setup

    var thisRow = $("<div data-pad=\""+rowNumber+"\" class=\"sequencerrow\"></div>");
    
    $()
    $("#sequencer").append(thisRow);

    
    for (var i = 0; i < numberOfColumns; i++ ) {
      var section = $("<div class=\"seqsection\" data-pad=\""+rowNumber+"\"></div>");
      
      $(thisRow).append(section);
      section.click( function() {
        if ($(this).hasClass("playon")) {
          $(this).removeClass( "playon" );
        } else {
          $(this).addClass("playon");
        } 
      });
    } 

    object.play = function() {
      playSound(sound);
    };

    rowNumber += 1;
  }
  request.send();

  return object;
};

function playTrack() {
  function playColumn( column ) {
    $(".sequencerrow").each( function( index ) {
      var thisSection = $(this).find("div:nth-child("+column+")");
      if (thisSection).hasClass("playon") {
        var sound = sounds[index];
        sound.play();
      }
    });
  }

  function loopTrack(i){
    playColumn(i);
    if ($("#startgrid").text() === "stop") {
      setTimeout(function(){
          ++i;
          loopTrack((i % numberOfColumns) || numberOfColumns);
      }, getMsFromBpm()/4)
    }
  }

  loopTrack(1);
}

$(function(){

  var soundFilepaths = [
    "BD7525.WAV",
    "CH.WAV",
    "OH25.WAV",
    "MA.WAV",
    "BD5075.WAV",
    "SD0010.WAV",
    "RS.WAV",
    "CB.WAV"
  ];

  var soundIndex  = 0;
  

  //add sounds to the pads
  $(".pad").each( function() {
    sounds.push(addSound( this, "audio/808/"+soundFilepaths[soundIndex] ));
    soundIndex += 1;
    $(this).attr("padnumber", soundIndex );
  });

  $("#startgrid").click( function(){
    if (this.innerHTML === "play") {
        this.innerHTML = "stop";
        playTrack();
    } else {
      this.innerHTML = "play";
    }
  });

});
