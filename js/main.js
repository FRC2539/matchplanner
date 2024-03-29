window.onload = () => {
  'use strict';

  // if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/{repository}/sw.js', {scope: '/{repository}/'});
  // }
  //update
  //sidebar
  var showhide = document.getElementById("showhide");
  var drCbox = document.getElementById("drawingCbox");
  var bcbox = document.getElementById("buttonCbox")
  var lineWidth = document.getElementById("thickSlider");
  var h = document.getElementById("hueSlider");
  var s = document.getElementById("satSlider");
  var v = document.getElementById("valSlider");
  var alpha = document.getElementById("alphaSlider");
  var randcol = document.getElementById("randcol");
  var chaos = document.getElementById("chaos");
  var teamnum = document.getElementById("teamnumber");
  var bgimg = document.getElementById("bgimg");
  var robots = []
  var robotsize = (window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight) * 0.052;
  console.log(robotsize)

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
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  function scale(e) {
    //if ((e && screen.orientation.type == "portrait-primary") || (!e && window.innerWidth < window.innerHeight)) {
    if ((ctx.canvas.width < ctx.canvas.height)) {
      bgimg.src = "./images/ChargedUpField_sm_portrait.png";
    } else {
      bgimg.src = "./images/ChargedUpField_sm.png";
    }
    robots.forEach(function (v) { (["width", "height"]).forEach((x) => { v.style[x] = robotsize + "px" }); console.log(v.firstChild); v.firstChild.style.fontSize = (robotsize / 5) + "px" }) // the line of code designed specifically to confuse you
  }

  // do that but save the canvas
  var drawPoints = [];
  function canvasRetainingResize() {
    var h = ctx.canvas.width
    ctx.canvas.width = ctx.canvas.height;
    ctx.canvas.height = h;
    drawPoints.forEach(function (lineData, index) {
      var savedLine = [lineData[0], lineData[1]]
      if (ctx.canvas.width < ctx.canvas.height) {
        lineData[0] = ctx.canvas.width - savedLine[1]
        lineData[1] = savedLine[0]
      } else {
        lineData[1] = ctx.canvas.height - savedLine[0]
        lineData[0] = savedLine[1]
      }
      if (index == 0) lastPos = [lineData[0], lineData[1]];
      drawLine(lineData[0], lineData[1], lineData[2], lineData[3], lineData[4], true);
    })
    robots.forEach((xe) => {
      var lef = xe.offsetLeft;
      var rig = xe.offsetRight;
      var tob = xe.offsetTop;
      var bot = xe.offsetBottom;
      if ((ctx.canvas.width < ctx.canvas.height)) {
        xe.style.left = (ctx.canvas.width - robotsize - tob) + "px"
        xe.style.right = (ctx.canvas.width - robotsize - bot) + "px"
        xe.style.top = lef + "px"
        xe.style.bottom = rig + "px"
      } else {
        xe.style.left = tob + "px"
        xe.style.right = bot + "px"
        xe.style.top = (ctx.canvas.height - robotsize - lef) + "px"
        xe.style.bottom = (ctx.canvas.height - robotsize - rig) + "px"
      }
    }) // the line of code designed specifically to confuse you

  }

  window.addEventListener("orientationchange", () => { canvasRetainingResize(); scale() }, false);

  var sidebarShowing = false;
  function setShowhideColor() {
    showhide.style.border = "5px solid " + (sidebarShowing ? "black" : "rgb(255,60,0)")
    showhide.style.backgroundColor = (sidebarShowing ? "rgb(255,170,130)" : "black")
  }

  function booleansAreAwesome() {
    var val = sidebarShowing
    sidebarShowing = !sidebarShowing
    document.getElementById("hruh").setAttribute("active", val ? "no" : "yes")
    document.getElementById("sidebar").style.visibility = val ? "hidden" : "visible";
    document.getElementById("sidebar").style.display = val ? "none" : "block";
    document.getElementById("sidebar").style.width = val ? "0%" : "20%";
    setShowhideColor()
    //document.getElementById("coolestdivever").style.width = val ? "100%" : "80%";
    //canvas.style.top = val ? "30px" : "0%"
    //canvasRetainingResize()
    if (document.getElementById("theguy")) {
      document.getElementById("theguy").remove()
      document.getElementById("hruh").style.bottom = "0%"
    }
  }

  //booleansAreAwesome(); // it should be hidden on launch
  showhide.addEventListener('click', booleansAreAwesome)
  showhide.addEventListener('mouseover', function () {
    showhide.style.border = "8px solid orange"
    showhide.style.backgroundColor = "brown"
  })
  showhide.addEventListener('mouseout', setShowhideColor)

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
    lastErasePoint = getMousePos(canvas, e);
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
    var touch = getTouchPos(canvas, e);
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.x,
      clientY: touch.y
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
      x: Math.floor(touchEvent.touches[0].clientX - rect.left),
      y: Math.floor(touchEvent.touches[0].clientY - rect.top)
    };
  }

  function drawLine(xPos, yPos, col, thic, alph, doNotSave) {
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.strokeStyle = col;
    ctx.lineWidth = thic;
    ctx.globalAlpha = alph / 100;
    ctx.moveTo(lastPos[0], lastPos[1]);
    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    lastPos = [xPos, yPos];
    if (!doNotSave) {
      drawPoints.push([xPos, yPos, col, thic, alph]);
    };
  }

  const lerp = (x, y, a) => x * (1 - a) + y * a;
  var lastErasePoint = []
  function clearLine(xPos, yPos, thic) {
    for (let i = 0; i < 1; i += (1 / Math.abs(lastErasePoint[0] - xPos + lastErasePoint[1] - yPos))) {
      ctx.clearRect(lerp(lastErasePoint[0], xPos, i) - (thic / 2), lerp(lastErasePoint[1], yPos, i) - (thic / 2), thic, thic)
    }
    lastErasePoint = [xPos, yPos]
  }

  // Draw to the canvas
  function renderCanvas() {
    if (drawing) {
      if (drCbox.checked) {
        if (chaos.checked) randCool("CHAOS");
        drawLine(mousePos.x, mousePos.y, hslToHex(h.value, s.value, v.value), lineWidth.value, alpha.value);
      } else clearLine(mousePos.x, mousePos.y, lineWidth.value)
    }
  }

  function clearCanvas() {
    resize();
    drawPoints = [];
  }

  document.getElementById("clearD").addEventListener('click', function () {
    prompt("Clear all drawings?", clearCanvas)
  });
  document.getElementById("redb").addEventListener('click', function () { h.value = 358; s.value = 82; v.value = 100 });
  document.getElementById("blueb").addEventListener('click', function () { h.value = 206; s.value = 100; v.value = 70 });

  // Allow for animation
  (function drawLoop() {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();

  var infoShowHide = document.getElementById("showinfo")
  var infoShowing = false;
  function infoShowhideColor() {
    infoShowHide.style.border = "5px solid " + (!infoShowing ? "rgb(128, 240, 255)" : "rgb(80, 150, 255)")
    infoShowHide.style.backgroundColor = (!infoShowing ? "rgb(80, 150, 255)" : "rgb(128, 240, 255)")
  }

  function infoIsAwesome() {
    var val = infoShowing
    infoShowing = !infoShowing
    document.getElementById("infosidebar").style.visibility = val ? "hidden" : "visible";
    document.getElementById("infosidebar").style.display = val ? "none" : "block";
    document.getElementById("infosidebar").style.width = val ? "0%" : "20%";
    infoShowhideColor()
  }

  infoShowHide.addEventListener('click', infoIsAwesome)
  infoShowHide.addEventListener('mouseover', function () {
    infoShowHide.style.border = "8px solid white"
    infoShowHide.style.backgroundColor = "rgb(128, 240, 255)"
  })
  infoShowHide.addEventListener('mouseout', infoShowhideColor)

  ////// ROBOT STUFF STARTS HERE //////

  var hasdas = ([document.getElementById("qaRed"), document.getElementById("qaBlue"), document.getElementById("qcRed"), document.getElementById("qcBlue"), document.getElementById("qErase"), document.getElementById("qClear")])
  function addRobot(color, c2) {
    if (teamnum.value == 11223434567 && color == "blue") {
      teamnum.value = "254"
      prompt("Are you sure?", () => {
        document.getElementById("secretsidebar").style.visibility = "visible"
        document.getElementById("secretsidebar").style.display = "block"
        document.getElementById("secretinfo").style.visibility = "visible"
        var chaosButtom = document.createElement('img');
        chaosButtom.className = "quickadd"
        chaosButtom.src = "./images/redpaint.png"
        chaosButtom.style = "background-color:rgb(141, 13, 56); border:5px solid rgb(255, 70, 120);"
        document.getElementById("hruh").insertBefore(document.createElement("br"), document.getElementById("hruh").firstChild);
        document.getElementById("hruh").insertBefore(chaosButtom, document.getElementById("hruh").firstChild);
        function recursiveChaosRecolor() {
          chaosButtom.style.filter = "hue-rotate(" + (Math.random() * 360) + "deg)"
          chaosButtom.style.transform = "translate(" + (Math.random() * 6 - 3) + "px, " + (Math.random() * 6 - 3) + "px) rotate(" + (Math.random() * 30 - 15) + "deg)"
          setTimeout(recursiveChaosRecolor, 10)
        }
        recursiveChaosRecolor()
        chaosButtom.addEventListener("click", () => {
          chaos.checked = !chaos.checked;
        })
        chaosButtom.style.visibility = !bcbox.checked ? "hidden" : ""
        hasdas.push(chaosButtom)
      })
      return
    }
    var div = document.createElement('div');
    div.style = "padding: 10px; cursor: move; z-index: 500000000; width:" + robotsize + "px; height:" + robotsize + "px; position:fixed; display:block; user-select:none; touch-action: none; top:50%; left:50%;"
    document.getElementById("coolestdivever").insertBefore(div, canvas);

    var h3 = document.createElement('h3');
    h3.style = "width:100%; height:15%; position:absolute; display:block; top:47%; left:0%; text-align:center; color:white; font-size:" + robotsize / 5 + "px; z-index:100;"
    h3.textContent = teamnum.value;
    div.appendChild(h3);

    var inputter = document.createElement('input'); // <input type="number" class="text" id="teamnumber" value="2539"/>
    inputter.type = "number"
    inputter.value = teamnum.value
    inputter.style = "width:100%; height:15%; position:absolute; display:block; top:67%; left:0%; text-align:center; color:black; font-size:" + robotsize / 5 + "px; z-index:100;"
    inputter.style.visibility = "hidden"
    inputter.onkeydown = (x) => {
      if (x.key == "Enter") {
        changingNumber = !changingNumber
        var b = h3.style.visibility
        h3.style.visibility = inputter.style.visibility
        inputter.style.visibility = b
        h3.textContent = inputter.value;
      }
    }
    div.appendChild(inputter);

    var img = document.createElement('img');
    img.style = "width:100%; height:100%; user-select:none;"
    if (color == "red" || color == "blue") {
      img.src = "images/" + color + "bot.png"
    } else {
      console.log(color, c2)
      img.src = "images/redbot.png"
      img.style.filter = "hue-rotate(" + color + "deg) grayscale(" + (100 - c2) + "%)"
    }
    img.draggable = false
    div.appendChild(img);

    var debounce = false;
    var changingNumber = false;
    div.addEventListener('dblclick', function () {
      if (debounce) return;
      debounce = true;
      changingNumber = !changingNumber
      var b = h3.style.visibility
      h3.style.visibility = inputter.style.visibility
      inputter.style.visibility = b
      h3.textContent = inputter.value;
      setTimeout(() => debounce = false, 500) // ARROW FUNCTIONS
    })

    div.addEventListener('mousedown', function (e) {
      if (changingNumber) return;
      var offX = robotsize / 2;
      var offY = robotsize / 2;

      function mousey(e) {
        div.style.position = "absolute"
        div.style.top = e.clientY - offY + "px"
        div.style.left = e.clientX - offX + "px"
        div.style.bottom = e.clientY + offY + "px"
        div.style.right = e.clientX + offX + "px"
      }
      document.addEventListener('mousemove', mousey)

      function mouseupfunction() {
        document.removeEventListener('mousemove', mousey)
        document.removeEventListener('mousemove', touchMoveFunc)
        document.removeEventListener('mouseup', mouseupfunction)
        document.removeEventListener('mouseup', touchEndFunc)
      }
      document.addEventListener('mouseup', mouseupfunction)

      // please do not define anonymous functions that dont get removed when they're not needed
      function touchEndFunc(e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        document.dispatchEvent(mouseEvent);
      }
      function touchMoveFunc(e) {
        var touch = getTouchPos(canvas, e);;
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.x,
          clientY: touch.y
        });
        document.dispatchEvent(mouseEvent);
      }
      document.addEventListener("touchend", touchEndFunc, { passive: false });
      document.addEventListener("touchmove", touchMoveFunc, { passive: false });
    })

    var mylatesttap = 0
    div.addEventListener("touchstart", function (e) {
      var now = new Date().getTime();
      var timesince = now - mylatesttap;
      mylatesttap = new Date().getTime();
      if ((timesince < 600) && (timesince > 0)) {
        // double tap   
        var mouseEvent = new MouseEvent("dblclick", {});
        div.dispatchEvent(mouseEvent);
        mylatesttap = -200 // make it less annoying
      } else {
        // too much time to be a double tap
        console.log("touch robot")
        var touch = getTouchPos(canvas, e);
        //console.log("touch x: "+touch.clientX+" y: "+touch.clientY)
        var mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.x,
          clientY: touch.y
        });
        div.dispatchEvent(mouseEvent);
      }
    }, { passive: false });
    robots.push(div)
  }

  var promp = document.getElementById("promp")
  var tx = document.getElementById("prompText")
  var yes = document.getElementById("prompYes")
  var no = document.getElementById("prompNo")
  no.onclick = () => {
    promp.style.visibility = "hidden"
    document.getElementById("thebg").style.visibility = "hidden"
  }
  yes.addEventListener("click", () => {
    promp.style.visibility = "hidden"
    document.getElementById("thebg").style.visibility = "hidden"
  })
  function prompt(text, yesFunc) {
    promp.style.visibility = "visible"
    document.getElementById("thebg").style.visibility = "visible"
    tx.innerHTML = text
    yes.onclick = yesFunc
  }
  no.onclick()

  var bettercolors = false;
  document.getElementById("qaRed").addEventListener('click', function () { addRobot('red') })
  document.getElementById("qaBlue").addEventListener('click', function () { addRobot('blue') })
  document.getElementById("qcRed").addEventListener('click', function () { h.value = 358; s.value = 82; v.value = 100 });
  document.getElementById("qcBlue").addEventListener('click', function () { h.value = 206; s.value = 100; v.value = 70 });
  drCbox.addEventListener('click', function () {
    document.getElementById("qErase").src = drCbox.checked ? "./images/eraser.png" : "./images/pencil.png"
  })
  document.getElementById("qErase").addEventListener('click', function () {
    drCbox.checked = !drCbox.checked
    document.getElementById("qErase").src = drCbox.checked ? "./images/eraser.png" : "./images/pencil.png"
  })
  document.getElementById("qClear").addEventListener('click', function () {
    prompt("Clear everything?", () => {
      clearCanvas();
      drawPoints = [];
      robots.forEach(function (div) {
        div.remove()
      })
    })
  });
  hasdas.forEach(function (e) {
    console.log(e)
    e.addEventListener('mouseover', function () {
      e.style.border = bettercolors ? "5px solid white" : "5px solid orange"
      e.style.backgroundColor = bettercolors ? "rgb(75, 250, 90)" : "tomato"
    })
    e.addEventListener('mouseout', function () {
      e.style.border = bettercolors ? "5px solid rgb(75, 250, 90)" : "5px solid tomato"
      e.style.backgroundColor = bettercolors ? "rgb(38, 121, 45)" : "brown"
    })
  })
  document.getElementById("roboR").addEventListener('click', function () { addRobot('red') })
  document.getElementById("roboB").addEventListener('click', function () { addRobot('blue') })
  document.getElementById("roboC").addEventListener('click', function () { addRobot(h.value, s.value) })
  document.getElementById("roboRAND").addEventListener('click', function () { addRobot(Math.random() * 360, 75 + Math.random() * 25) })
  document.getElementById("clearR").addEventListener('click', function () {
    prompt("Clear all robots?", () => {
      robots.forEach(function (div) {
        div.remove()
      })
    })
  });
  bcbox.addEventListener("click", () => {
    hasdas.forEach((x) => {
      x.style.visibility = !bcbox.checked ? "hidden" : ""
    })
  })

  document.getElementById("spite").addEventListener('click', function () {
    bettercolors = !bettercolors
    hasdas.forEach(function (e) {
      e.style.border = bettercolors ? "5px solid rgb(75, 250, 90)" : "5px solid tomato"
      e.style.backgroundColor = bettercolors ? "rgb(38, 121, 45)" : "brown"
    })
  })

}
