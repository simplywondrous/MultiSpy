var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');
var PNG = require('png-js');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);


var Entity = function (name, category, id) {
  this.name = name;
  this.category = category;
  this.id = id;
  this.isFound = false;
}

var EyeSpy = function (properties) {
  //Background Image URL
  this.url = properties.url;
  
  //Hotspot properties
  this.path = properties.path;
  this.image = PNG.load(this.path);

  //Game objects
  this.entities = properties.entities.map(function (entity) {
    return new Entity(entity.name, entity.category, entity.id);
  });
  
}


//assume x,y is in pixels
EyeSpy.prototype.getPixel = function (x, y) {
  var i = (x + this.image.width * y) * 4;
  
  var data = this.image.data;
  console.log(data, i)
  return [ data.readUInt8(i), data.readUInt8(i+1), data.readUInt8(i+2) ]
}


EyeSpy.prototype.click = function (x_, y_) {
  
  var x = Math.floor(x_);
  var y = Math.floor(y_);
  
  var id = this.getPixel(x, y);
  
  console.log(id);
  var clicked = null;
  
  var isSame = function (color1, color2) {
    return color1[0] == color2[0] && 
      color1[1] == color2[1] &&  
      color1[2] == color2[2]
  }

  this.entities.forEach(function(entity) {
    if(isSame(entity.id, id))
      clicked = entity;
  })
  
  if(clicked != null)
    clicked.isFound = true;
    
  return clicked;
}

EyeSpy.prototype.makePublicState = function () {
  return {
    url : this.url,
    entities : this.entities.map(function (entity) {
      return  { name : entity.name, category : entity.category, isFound : entity.isFound };
    })
  }
}

var eyespy = new EyeSpy({
  url : "imgs/bg.jpg",
  path : "hotspots.png",
  entities : [
    { name : "froggo1", category : "frogs", id : [255, 0, 0] },
    { name : "froggo2", category : "frogs", id : [11, 10, 10] }
  ]
})


router.use(express.static(path.resolve(__dirname, 'client')));


io.on('connection', function (socket) {
  
  socket.emit("init", eyespy.makePublicState());

  socket.on('click', function (data) {
    if(eyespy.click(data.x, data.y))
      io.sockets.emit("update", eyespy.makePublicState());
  });
  
});

server.listen(8080, function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
