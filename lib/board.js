var blessed = require('blessed'), 
    Mass = require('./mass'), 
    _ = require('lodash');

function Board(options){
  var self = this;
  self.massNum = options.massNum;
  self.bombNum = options.bombNum;
  self.nPos = {
    x:0, 
    y:0, 
  };
  self.nScr = 0;
  self.screen = blessed.screen({
    autoPadding: true,
    smartCSR: true
  });

  var m = _.range(1, self.massNum*self.massNum);

  self.bombPos = [];
  while(self.bombPos.length<=self.bombNum){
    var r = Math.floor(Math.random()*
                      self.massNum*self.massNum);
    if(self.bombPos.indexOf(r)<0){
      self.bombPos.push(r);
    }
  }
  self.boxlh = 1;
  self.boxlw = 2;
  self.box = blessed.box({
    top: 'center',
    left: 'center',
    width: 'shrink',
    height: 'shrink',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
      border: {
        fg: 'white'
      },
    }
  });

  self.massBoxes = [];
  for(var i=0;i<self.massNum;i++){
    self.massBoxes[i] = [];
    for(var j=0;j<self.massNum;j++){
      var bgc = 'white';
      var bom = false;
      if((i*self.massNum+(j+1))%2===1){
        bgc = '#a9a9a9';
      }
      if(self.bombPos.indexOf((i*self.massNum+(j+1)))
         >=0){
           bom = true;
      }
      self.massBoxes[i][j] = new Mass({
        top: self.boxlh*i, 
        left: self.boxlw*j, 
        width: self.boxlw, 
        height: self.boxlh, 
        style: {
          fg: 'red', 
          bg: bgc, 
        }, 
        x: j, 
        y: i, 
        b: bom, 
        oColor: 'navy', 
        cursorColor: 'blue', 
      });
      self.box.append(self.massBoxes[i][j].box);
    }
  }
  self.screen.append(self.box);
  self.screen.render();
  self.text = 'Close: ctrl-c, q, esc' + ' ' +
              'Move: <, ^, >, v' + ' ' +
              'Enter: Check';
  self.mesTxt = blessed.text({
    align: 'center', 
    width: '100%', 
    height: 'shrink', 
    content: self.text, 
    border: {
      type: 'line'
    }, 
    style: {
      fg: 'white', 
      bg: 'navy', 
      border: {
        fg: 'green'
      }
    }
  });
  self.screen.append(self.mesTxt);

  self.screen.append(self.box);
  self.screen.render();
  self.box.focus();
  self.massBoxes[self.nPos.y][self.nPos.x].moveTo();
  self.screen.render();

  // Quit on Escape, q, or Control-C. 
  self.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  self.screen.key(['right'], function(ch, key){
    if(self.nPos.x >=self.massNum-1){ return; }
    self.massBoxes[self.nPos.y][self.nPos.x].moveFrom();
    self.nPos.x++;
    self.massBoxes[self.nPos.y][self.nPos.x].moveTo();
    self.screen.render();
  });

  self.screen.key(['left'], function(ch, key){
    if(self.nPos.x <=0){ return; }
    self.massBoxes[self.nPos.y][self.nPos.x].moveFrom();
    self.nPos.x--;
    self.massBoxes[self.nPos.y][self.nPos.x].moveTo();
    self.screen.render();
  });

  self.screen.key(['down'], function(ch, key){
    if(self.nPos.y >=self.massNum-1){ return; }
    self.massBoxes[self.nPos.y][self.nPos.x].moveFrom();
    self.nPos.y++;
    self.massBoxes[self.nPos.y][self.nPos.x].moveTo();
    self.screen.render();
  });

  self.screen.key(['up'], function(ch, key){
    if(self.nPos.y <=0){ return; }
    self.massBoxes[self.nPos.y][self.nPos.x].moveFrom();
    self.nPos.y--;
    self.massBoxes[self.nPos.y][self.nPos.x].moveTo();
    self.screen.render();
  });

  self.screen.key(['enter'], function(ch, key){
    self.checkFail(self.nPos.x, self.nPos.y);
    self.open(self.nPos.x, self.nPos.y);
    self.checkClear(self.nPos.x, self.nPos.y);
    //console.log(self.nScr);
    self.screen.render();
  });

}

Board.prototype.open = function(x, y){
  var f = this.openMass(x, y);
  if(f>0) { return; }
  for(var i=-1;i<=1;i++){
    if((y+i)<0 || (y+i)>=this.massNum){
      continue;
    }
    for(var j=-1;j<=1;j++){
      if((x+j)<0 || (x+j)>=this.massNum ||
          (i==0 && j==0) ||
          this.massBoxes[y+i][x+j].o){
        continue;
      }
      this.open(x+j, y+i);
    }
  }
}

Board.prototype.getContent = function(x, y){
  var bomCnt = 0;
  for(var i=-1;i<=1;i++){
    if((y+i)<0 || (y+i)>=this.massNum){
      continue;
    }
    for(var j=-1;j<=1;j++){
      if((x+j)<0 || (x+j)>=this.massNum ||
          (i==0 && j==0)){
        continue;
      }
      if(this.massBoxes[y+i][x+j].b){
        bomCnt++;
      }
    }
  }
  return bomCnt;
}

Board.prototype.openMass = function(x, y){
  var bomCnt = this.getContent(x, y);
  this.nScr++;
  if(bomCnt>0){
    this.massBoxes[y][x].open(bomCnt);
    return bomCnt;
  }
  this.massBoxes[y][x].open('');
  return bomCnt;
}

Board.prototype.show = function(){
  for(var i=0; i < this.massNum; i++){
    for(var j=0; j < this.massNum; j++){
      if(this.massBoxes[i][j].b){
        this.openMass(j, i);
      }
    }
  }
}

Board.prototype.checkFail = function(x, y){
  if(this.massBoxes[this.nPos.y][this.nPos.x].b){
    this.fail();
    return this.show();
  }
  if(this.nScr == this.massNum*this.massNum-this.bombNum){
    this.clear();
    return ;
  }
}

Board.prototype.checkClear = function(x, y){
  if(this.nScr == this.massNum*this.massNum-this.bombNum){
    return process.exit(0);
  }
}

Board.prototype.clear = function(){
  this.mesTxt.content = 'CLEAR!!!!';
}
Board.prototype.fail = function(){
  this.mesTxt.content = 'FAIL!!';
  this.screen.render();
}
module.exports = Board;
