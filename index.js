var blessed = require('blessed');
 
// Create a screen object. 
var screen = blessed.screen({
  autoPadding: true,
  smartCSR: true
});
 
screen.title = 'my window title';

var width = screen.width;
var height = screen.height;
var bwidth, bheight;
var massNum = 9;
var massBox = [];
var cmass = {x:0, y:0};
if(width > height){
  bwidth = width / width * 50;
  bheight = width / 2 / height *50;
}else{
  bwidth = height / 2 / width * 50;
  bheight = height / height * 50;
}
 
// Create a box perfectly centered horizontally and vertically. 
var box = blessed.box({
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
 
// Append our box to the screen. 
console.log(box.padding);
var boxlw = 2;
var boxlh = 1;
var boxp = 1;
var boxc = 1;
var massNum = 9;
for(var i = 0;i< massNum; i++){
  massBox[i] = [];
  for(var j=0; j< massNum; j++){
    var bgc = 'white';
    if((i*massNum+(j+1))%2===1){
      bgc='#a9a9a9';
    }
    massBox[i][j] = blessed.box({
      top: (boxlh+0)*i, 
      left: (boxlw+0)*j, 
      width: boxlw, 
      height: boxlh, 
      content: i*massNum+(j+1)+'', 
      style: {
        fg: 'red', 
        bg: bgc, 
      }
    });
    boxc++;
    box.append(massBox[i][j]);
  }
}

screen.append(box);

// If our box is clicked, change the content. 
box.on('click', function(data) {
  screen.render();
});
 
// If box is focused, handle `enter`/`return` and give us some more content. 
box.key('enter', function(ch, key) {
  screen.render();
});
 
// Quit on Escape, q, or Control-C. 
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key(['right'], function(ch, key){
  if(cmass.x>=massNum-1) { return; }
  var color = 'white';
  if((cmass.y*massNum+(cmass.x+1)) % 2===1){
    color = '#a9a9a9';
  }
  massBox[cmass.y][cmass.x].style.bg = color;
  cmass.x ++;
  massBox[cmass.y][cmass.x].style.bg = 'red';
  screen.render();
});

screen.key(['left'], function(ch, key){
  if(cmass.x<=0) { return; }
  var color = 'white';
  if((cmass.y*massNum+(cmass.x+1)) % 2===1){
    color = '#a9a9a9';
  }
  massBox[cmass.y][cmass.x].style.bg = color;
  cmass.x --;
  massBox[cmass.y][cmass.x].style.bg = 'red';
  screen.render();
});

screen.key(['up'], function(ch, key){
  if(cmass.y<=0) { return; }
  var color = 'white';
  if((cmass.y*massNum+(cmass.x+1)) % 2===1){
    color = '#a9a9a9';
  }
  massBox[cmass.y][cmass.x].style.bg = color;
  cmass.y --;
  massBox[cmass.y][cmass.x].style.bg = 'red';
  screen.render();
});

screen.key(['down'], function(ch, key){
  if(cmass.y>=massNum-1) { return; }
  var color = 'white';
  if((cmass.y*massNum+(cmass.x+1)) % 2===1){
    color = '#a9a9a9';
  }
  massBox[cmass.y][cmass.x].style.bg = color;
  cmass.y ++;
  massBox[cmass.y][cmass.x].style.bg = 'red';
  screen.render();
});
 
// Focus our element. 
box.focus();
 
// Render the screen. 
screen.render();
