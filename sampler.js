window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new window.AudioContext();

var rowNumber = 1;
var numberOfColumns = 4;

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


    function playSound(buffer) {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    }

    $(object).click(function() {
        playSound(sound);
    });

    //sequencer setup
    

    

    $("#sequencer").append("<div data-pad=\""+rowNumber+"\" class=\"sequencerrow\"></div>")

    for (var i = 0; i < numberOfColumns; i++ ) {
      var section = $("<div class=\"seqsection\" data-pad=\""+rowNumber+"\"></div>");
      $("#sequencer").append(section);
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
    addSound(this, "audio/808/"+soundFilepaths[soundIndex] );
    soundIndex += 1;
    $(this).attr("padnumber", soundIndex );
  });
  
  

  $("#startgrid").click( function(){
    var startTime = new Date();
    setInterval( playTrack)

  });
  
  
});

