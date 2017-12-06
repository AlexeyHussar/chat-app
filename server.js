const mongo = require('mongodb').MongoClient;
const io = require('socket.io').listen(3000).sockets;

mongo.connect('mongodb://127.0.0.1/chatapp', (err, db) => {
  if (err) console.log(err);
  console.log('Connected to mongoDB');

  io.on('connection', (socket) => {
    let chat = db.collection('chats')

    chat.find()
      .limit(100)
      .sort({ _id: -1 })
      .toArray((err, result) => {
        if (err) console.log(err);
        socket.emit('output', result);
      });
    
    socket.on('input', (data) => {
      let name = data.name;
      let message = data.message;

      chat.insertOne({ name, message }, (err) => {
        if (err) console.log(err);
        io.emit('output', [data]);
      });
    });

    socket.on('clear', (data) => {
      chat.remove({}, () => {
        socket.emit('cleared');
      });
    });
  });
});