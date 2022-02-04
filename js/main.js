window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }

var showhide = document.getElementById("showhide");
var drCbox = document.getElementById("drawingCbox");
var lineWidth = document.getElementById("thickSlider");
var h = document.getElementById("hueSlider");
var s = document.getElementById("satSlider");
var v = document.getElementById("valSlider");
var randcol = document.getElementById("randcol");
var chaos = document.getElementById("chaos");

  // create canvas element and append it to document body

var canvas = document.createElement('canvas');
document.getElementById("coolestdivever").appendChild(canvas);

  // some hotfixes... ( ≖_≖)
  document.body.style.margin = 0;
  canvas.style.position = 'fixed';

  // get canvas 2D context and set him correct size
  var ctx = canvas.getContext('2d');
  resize();


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
  ctx.canvas.width = window.innerWidth*(showhide.value == "Hide sidebar" ? .8 : 1);
  ctx.canvas.height = window.innerHeight;
}

function booleansAreAwesome() {
  var val = showhide.value == "Hide sidebar"
  showhide.value = val ? "Show sidebar" : "Hide sidebar"
  document.getElementById("sidebar").style.visibility = val ? "hidden" : "visible";
  document.getElementById("sidebar").style.width = val ? "0%" : "20%";
  document.getElementById("coolestdivever").style.width = val ? "100%" : "80%";
  canvas.style.top = val ? "30px" : "0%"
  resize()
}

showhide.addEventListener('click',booleansAreAwesome)

function randCool() {
  lineWidth.value = Math.random()*50
  h.value = Math.random()*360
  s.value = Math.random()*100
  v.value = Math.random()*100
}

randcol.addEventListener('click',randCool)

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

// function draw(e) {
//   // mouse left button must be pressed
//   if (e.buttons !== 1) return;
//   if (!drCbox.checked) return;

//   ctx.beginPath(); // begin

//   ctx.lineWidth = lineWidth.value;
//   ctx.lineCap = 'round';
//   ctx.strokeStyle = hslToHex(h.value,s.value,v.value);

//   ctx.moveTo(pos.x, pos.y); // from
//   setPosition(e);
//   ctx.lineTo(pos.x, pos.y); // to

//   ctx.stroke(); // draw it!

//   if (chaos.checked) randCool();
// }
 

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

  // Draw to the canvas
  function renderCanvas() {
    if (drawing) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.lineCap = 'round';
      ctx.strokeStyle = hslToHex(h.value,s.value,v.value);
      ctx.lineWidth = lineWidth.value;
      if (chaos.checked) randCool();
      ctx.stroke();
      lastPos = mousePos;
    }
  }

  // Clear the canvas
  function clearCanvas() {
    canvas.width = canvas.width;
  }

  // Allow for animation
  (function drawLoop() {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();

}
