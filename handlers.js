module.exports = function(app, express, io) {
	// static files
	app.use(express.static('public'));

	//websockets
	io.on('connection', function(socket){

		socket.on('updateBeat', function(data){
			app.set('beat', data);
			io.emit('update', data);
		});

	});

	

};