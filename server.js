var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const execute  =    require('child_process').exec
,    fs        =    require("fs")
,    log       =    'log'
,    script    =    'sh deploy.sh'

app.use('/deploy', function(req, res) {
   execute([script, '>>', log, '2>&1'].join(' '));
   res.writeHead(200);
   return res.end('Okay');
})

app.use('/log', function(req, res) {
   res.writeHead(200);
   return fs.createReadStream(log).pipe(res);
})


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});
