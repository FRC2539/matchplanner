window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js');
  }

  // create canvas element and append it to document body
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  // some hotfixes... ( ≖_≖)
  document.body.style.margin = 0;
  canvas.style.position = 'fixed';

  // get canvas 2D context and set him correct size
  var ctx = canvas.getContext('2d');
  resize();

  // last known position
  var pos = { x: 0, y: 0 };

  window.addEventListener('resize', resize);
  //document.addEventListener('mousemove', draw);
  //document.addEventListener('mousedown', setPosition);
  //document.addEventListener('mouseenter', setPosition);

  canvas.addEventListener('touchstart', draw);
  canvas.addEventListener('touchmove', setPosition);
  canvas.addEventListener('touchend', disengage);

  canvas.addEventListener("touchmove", function (e) {
    alert("touch");
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);

  // new position from mouse event
  function setPosition(e) {
    alert("touch-pos")
    e.preventDefault();
    e.stopPropagation();
    pos.x = e.clientX;
    pos.y = e.clientY;
  }

  // resize canvas
  function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  function disengage() {
    dragging = false;
    context.beginPath();
  }

  function draw(e) {
    alert("draw");
    // mouse left button must be pressed
    //if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#c0392b';

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
  }
}
