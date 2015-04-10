window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new window.AudioContext();


function addSound( object, filepath ) {
  var sound;
  var request = new XMLHttpRequest();
  request.open('GET', filepath , true);
  request.responseType = 'arraybuffer';

  var rowNumber = 1;


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
    

    numberOfColumns = 4;

    $("#sequencer").append("<div data-pad=\""+rowNumber+"\" class=\"sequencerrow\"></div>")

    rowNumber += 1;

    for (var i = 0; i < numberOfColumns; i++ ) {
      $("#sequencer").append("<div class=\"seqsection\"></div>");
    } 

    object.play = function() {
      playSound(sound);
    };
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
  
  //add/remove playon class in the sequencer
  $(".seqsection").click( function(){
console.log(".seqsection");
    if ($(this).hasClass("playon")) {
        $(this).removeClass( "playon" );
    } else {
      $(this).addClass("playon");
    }
  });

  $("#startgrid").click( function(){
    

  });

});

