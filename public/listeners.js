//websockets
$(function(){
	
	socket = io.connect('http://localhost:8000');
	
	socket.on('update', function(data){
		loadBeat(data);
	});
});