const express=require('express');
var bodyParser = require('body-parser')
const app= new express();
const http=require('http').Server(app);
const io = require('socket.io')(http)
const mongoose=require('mongoose');


const PORT =process.env.PORT||3000;

app.use(express.static(__dirname));//load html
app.use(bodyParser.json());//to parse the body of the request
app.use(bodyParser.urlencoded({extended: false}))

//creating the collection Message
var Message = mongoose.model('Message',{
    name : String,
    message : String
})

//db url
const dbUrl='mongodb+srv://chatdb:chat123456@cluster0-kznoh.mongodb.net/test?retryWrites=true&w=majority'


app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user},(err, messages)=> {
      res.send(messages);
    })
})

app.post('/messages', async (req, res) => {
    try{
      var message = new Message(req.body);
        console.log(message);
        
      var savedMessage = await message.save()
        console.log('saved');
  
        io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error){
      res.sendStatus(500);
      return console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
  
})
  
  
  
io.on('connection', () =>{
    console.log('a user is connected')
})
  
mongoose.connect(dbUrl ,(err) => {
    console.log('mongodb connected',err);
})


http.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});