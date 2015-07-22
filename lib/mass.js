var blessed = require('blessed');

function Mass(options) {
  var self = this;

  self.x = options.x;
  self.y = options.y;
  self.b = options.b;
  self.o = false;
  self.cColor = options.style.bg;
  self.oColor = options.oColor;
  self.cursorColor = options.cursorColor;
  // This is debug code
  /*
  if(self.b){
    options.content = 'b';
  }
  */
  self.box = blessed.box(options);

};

Mass.prototype.open = function(cnt){
  if(this.o){ return; }
  this.o = true;
  this.box.style.bg = this.oColor;
  this.box.content = cnt+'';
  if(this.b){
    this.box.content = 'b';
  }
  this.box.render();
};

Mass.prototype.moveFrom = function(){
  if(this.o){ 
    this.box.style.bg = this.oColor;
    return; 
  }
  this.box.style.bg = this.cColor;
  this.box.render();
}

Mass.prototype.moveTo = function(){
  //if(this.o){ return; }
  this.box.style.bg = this.cursorColor;
  this.box.render();
}

module.exports = Mass;
