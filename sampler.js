window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new window.AudioContext();
var masterGain = context.createGain();
  
  masterGain.connect(context.destination);
var rowNumber = 0;
var seqSteps = 16;
var subdivision = 4;
var sounds = [];
var tempo = 120;

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

var loadedSoundCounter = 0;

function getMsFromBpm() {
  return 60000/tempo;
}

function playSound(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  
  source.connect(masterGain);
  source.start(0);
}

function buildSequencer() {
  var thisRow = $("<div class=\"sequencerrow\"></div>");
  var rowName = $("<div class='rowtitle'>"+$("#drumpads").find("div:nth-child("+(rowNumber+1)+")").text()+"</div>");
  
  $(thisRow).append(rowName);
  $("#sequencer").append(thisRow);
  
  for (var i = 0; i < seqSteps; i++ ) {
    var section = $("<div class=\"seqsection\" data-pad=\""+rowNumber+"\"></div>");
    
    section.css("width", 645/seqSteps);
    $(thisRow).append(section);

    var downBeatMarker = seqSteps / subdivision;
    if ( i % downBeatMarker === 0 ) {
      section.addClass("downbeat");
    }
    section.click( function() {
      if ($(this).hasClass("playon")) {
        $(this).removeClass( "playon" );
      } else {
        $(this).addClass("playon");
      } 
    });
  }

  $("#sequencer").append("<br>");

  rowNumber += 1;
} 

function addSound( object, filepath ) {
  var sound;
  var request = new XMLHttpRequest();
  request.open('GET', filepath , true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    loadedSoundCounter++;
    context.decodeAudioData(request.response, function(theBuffer) {
      sound = theBuffer;
    });

    $(object).click(function() {
        playSound(sound);
    });

    loadBeat();

    buildSequencer();
    if(loadedSoundCounter === soundFilepaths.length){
      loadedSoundCounter = 0;
    }

    object.play = function() {
      playSound(sound);
    };

    $(".seqsection").click(function(){
      saveBeat();
    });

    loadBeat()
    
  }

  request.send();


  return object;
};

function playTrack() {
  function playColumn( column ) {
    $(".seqsection").removeClass("playing");
    $(".sequencerrow").each( function( index ) {
      var thisSection = $(this).find(".seqsection:eq("+column+")");
      thisSection.addClass("playing");
      if (thisSection.hasClass("playon")) {
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
        if (i > seqSteps - 1){
          i = 0;
        }
        loopTrack(i);
      }, 
      getMsFromBpm()/4)
    }
  }

  loopTrack(0);
}

function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function saveBeat() {
  if (!supportsLocalStorage()) { alert("storage not supported :(") }
  localStorage.clear();
  var savedBeat = {};
  savedBeat["tempo"] = $("#tempo").val();
  savedBeat.sequencersteps =  $("#seqsteps").val();
  savedBeat.subdivision = $("#subdivision").val();
  $(".sequencerrow").each(function(count) {
    savedBeat["sequence"+count] = [];
    $('*[data-pad=\"'+count+'\"]').each(function(index){
      if ($(this).hasClass("playon")) {
        savedBeat["sequence"+count].push(true);
      } else {
        savedBeat["sequence"+count].push(false);
      }
    });
  });
  localStorage["savedBeat"] = JSON.stringify(savedBeat);
  return localStorage;
} 

function loadBeat() {
  if (!supportsLocalStorage()) { return false; }
  if (!localStorage["savedBeat"]) { return false; }
  
  var savedBeat = JSON.parse(localStorage["savedBeat"]);

  $("#tempo").val(savedBeat.tempo); 
  tempo = $("#tempo").val();
  $("#seqsteps").val(savedBeat.sequencersteps);
  seqSteps = $("#seqsteps").val();
  $("#subdivision").val(savedBeat.subdivision);
  subdivision = $("#subdivision").val();
  $(".sequencerrow").each(function(count) {  
    $('*[data-pad=\"'+count+'\"]').each(function(index) {
      if (savedBeat["sequence"+count][index]) {
        $(this).addClass("playon");
      } else $(this).removeClass("playon");
    });
  });
}

$(function(){

  var soundIndex  = 0;
  

  //add sounds to the pads
  $(".pad").each( function() {
    sounds.push(addSound( this, "audio/808/"+soundFilepaths[soundIndex] ));
    $(this).attr("padnumber", soundIndex );
    soundIndex += 1;
  });

  $("#startgrid").click( function(){
    if (this.innerHTML === "play") {
        this.innerHTML = "stop";
        playTrack();
    } else {
      this.innerHTML = "play";
    }
  });

  $('#mastervolume').change(function(){
    masterGain.gain.value = $(this).val();
  });

  $("#tempo, #seqsteps, #subdivision").change(function(){
    tempo = $("#tempo").val();
    seqSteps = $("#seqsteps").val();
    subdivision = $("#subdivision").val();
    saveBeat();
  });

  $('#seqsteps').change(function(){
    saveBeat();
    $("#sequencer").empty();
    seqSteps = $(this).val();
    rowNumber = 0;
    $(".pad").each(function(){
      buildSequencer();
    });
    loadBeat();
  });

  $('#subdivision').change(function(){
    saveBeat();
    $("#sequencer").empty();
    subdivision = $(this).val();
    rowNumber = 0;
    $(".pad").each(function(){
      buildSequencer();
    });
    loadBeat();
  });

});