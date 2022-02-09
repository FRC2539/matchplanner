window.onload = () => {
  'use strict';

  // if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/{repository}/sw.js', {scope: '/{repository}/'});
  // }
  //update
//sidebar
var showhide = document.getElementById("showhide");
var drCbox = document.getElementById("drawingCbox");
var lineWidth = document.getElementById("thickSlider");
var h = document.getElementById("hueSlider");
var s = document.getElementById("satSlider");
var v = document.getElementById("valSlider");
var alpha = document.getElementById("alphaSlider");
var randcol = document.getElementById("randcol");
var chaos = document.getElementById("chaos");
var teamnum = document.getElementById("teamnhumber");
var bgimg = document.getElementById("bgimg");
var robots = []
var robotsize = 90;



// create canvas element and append it to document body

var canvas = document.createElement('canvas');
document.getElementById("coolestdivever").appendChild(canvas);

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;
canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
resize();


scale()
//screen.orientation.addEventListener("change",scale)

// // last known position
// var pos = { x: 0, y: 0 };
// window.addEventListener('resize', resize);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mousedown', setPosition);
// canvas.addEventListener('mouseenter', setPosition);

// // new position from mouse event
// function setPosition(e) {
//   pos.x = e.offsetX;
//   pos.y = e.offsetY;
// }

// resize canvas
function resize() {
  ctx.canvas.width = window.innerWidth * (showhide.value == "Hide sidebar" ? .8 : 1);
  ctx.canvas.height = window.innerHeight;
}

function scale(e) {
  if ((e && screen.orientation.type == "portrait-primary") || (!e && window.innerWidth < window.innerHeight)) {
    bgimg.src = "./images/RapidReactField_sm_portrait.png";
    bgimg.style.width = "95%"
  } else {
    bgimg.src = "./images/RapidReactField_sm.png";
    bgimg.style.height = "95%"
  }
  robots.forEach(function(v){(["width","height"]).forEach(function(x){v.style[x] = robotsize+"px"}); console.log(v.firstChild); v.firstChild.style.fontSize = (robotsize/5)+"px"}) // the line of code designed specifically to confuse you
}

// do that but save the canvas
var drawPoints = [];
function canvasRetainingResize() {
  //var offset = (showhide.value == "Hide sidebar" ? .8 : 1);
  var offset = 1;
  var lastSize = [ctx.canvas.width, ctx.canvas.height]
  ctx.canvas.width = window.innerWidth * offset;
  ctx.canvas.height = window.innerHeight;
  drawPoints.forEach(function (lineData, index) {
    if (index == 0) lastPos = [lineData[0] - ctx.canvas.width * 1.25 * (1 - offset), lineData[1] + (30 * (1 - offset) * 5)];
    drawLine(lineData[0] - ctx.canvas.width * 1.25 * (1 - offset), lineData[1] + (30 * (1 - offset) * 5), lineData[2], lineData[3], lineData[4], true);
  })
}

function booleansAreAwesome() {
  var val = showhide.value == "Hide sidebar"
  showhide.value = val ? "Show sidebar" : "Hide sidebar"
  document.getElementById("sidebar").style.visibility = val ? "hidden" : "visible";
  document.getElementById("sidebar").style.display = val ? "none" : "block";
  document.getElementById("sidebar").style.width = val ? "0%" : "20%";
  //document.getElementById("coolestdivever").style.width = val ? "100%" : "80%";
  //canvas.style.top = val ? "30px" : "0%"
  canvasRetainingResize()
}

booleansAreAwesome(); // it should be hidden on launch
showhide.addEventListener('click', booleansAreAwesome)

function randCool(chaos) {
  lineWidth.value = chaos == "CHAOS" ? Math.random() * 50 : lineWidth.value
  h.value = Math.random() * 360
  s.value = Math.random() * 100
  v.value = Math.random() * 50
  alpha.value = chaos == "CHAOS" ? Math.random() * 100 : alpha.value
}

randcol.addEventListener('click', randCool)

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimaitonFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

// Set up mouse events for drawing
var drawing = false;
var mousePos = { x: 0, y: 0 };
var lastPos = mousePos;
canvas.addEventListener("mousedown", function (e) {
  drawing = true;
  lastPos = getMousePos(canvas, e);
}, false);
canvas.addEventListener("mouseup", function (e) {
  drawing = false;
}, false);
canvas.addEventListener("mousemove", function (e) {
  mousePos = getMousePos(canvas, e);
}, false);

// Set up touch events for mobile, etc

canvas.addEventListener("touchstart", function (e) {
  mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, { passive: false });
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, { passive: false });
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, { passive: false });

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
    //yo
  };
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

function drawLine(xPos,yPos,col,thic,alph,doNotSave) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.strokeStyle = col;
  ctx.lineWidth = thic;
  ctx.globalAlpha = alph/100;
  ctx.moveTo(lastPos[0], lastPos[1]);
  ctx.lineTo(xPos, yPos);
  ctx.stroke();
  lastPos = [xPos,yPos];
  if (!doNotSave) {
    drawPoints.push([xPos,yPos,col,thic,alph]);
  };
}

// Draw to the canvas
function renderCanvas() {
  if (drawing && drCbox.checked) {
    if (chaos.checked) randCool("CHAOS");
    drawLine(mousePos.x, mousePos.y, hslToHex(h.value,s.value,v.value),lineWidth.value,alpha.value);
  }
}

function clearCanvas() {
  resize();
  drawPoints = [];
}

document.getElementById("clearD").addEventListener('click',clearCanvas);
document.getElementById("redb").addEventListener('click', function () { h.value = 358; s.value = 82; v.value = 100 });
document.getElementById("blueb").addEventListener('click', function () { h.value = 206; s.value = 100; v.value = 70 });

// Allow for animation
(function drawLoop() {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();

////// ROBOT STUFF STARTS HERE //////

function addRobot(color) {
  var div = document.createElement('div');
  div.style = "padding: 10px; cursor: move; z-index: 500000000; width:" + robotsize + "px; height:" + robotsize + "px; position:fixed; display:block; user-select:none; touch-action: none; top:50%; left:50%;"
  document.getElementById("coolestdivever").insertBefore(div,canvas);

  var h3 = document.createElement('h3');
  h3.style = "width:100%; height:15%; position:absolute; display:block; top:47%; left:0%; text-align:center; color:white; font-size:" + robotsize/5 + "px;"
  h3.textContent = teamnum.value;
  div.appendChild(h3);

  var img = document.createElement('img');
  img.src = "images/" + color + "bot.png"
  img.style = "width:100%; height:100%; user-select:none;"
  img.draggable = false
  div.appendChild(img);

  div.addEventListener('mousedown',function(e){
    var offX = e.offsetX;
    var offY = e.offsetY;

    function mousey(e) {
      div.style.top = e.clientY - offY + "px"
      div.style.left = e.clientX - offX + "px"
    }
    document.addEventListener('mousemove',mousey)

    function mouseupfunction() {
      document.removeEventListener('mousemove',mousey)
      document.removeEventListener('mousemove',touchMoveFunc)
      document.removeEventListener('mouseup',mouseupfunction)
      document.removeEventListener('mouseup',touchEndFunc)
    }
    document.addEventListener('mouseup',mouseupfunction)

    // please do not define anonymous functions that dont get removed when they're not needed
    function touchEndFunc(e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      document.dispatchEvent(mouseEvent);
    }
    function touchMoveFunc(e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      document.dispatchEvent(mouseEvent);
    }
    document.addEventListener("touchend", touchEndFunc, { passive: false });
    document.addEventListener("touchmove", touchMoveFunc, { passive: false });
  })

  div.addEventListener("touchstart", function (e) {
    console.log("touch robot")
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    //console.log("touch x: "+touch.clientX+" y: "+touch.clientY)
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    div.dispatchEvent(mouseEvent);
  }, { passive: false });
  robots.push(div)

}

document.getElementById("roboR").addEventListener('click',function(){addRobot('red')})
document.getElementById("roboB").addEventListener('click',function(){addRobot('blue')})
document.getElementById("clearR").addEventListener('click',function(){
  robots.forEach(function(div){
    div.remove()
  })
});

}
