"use strict";

const CANVASCONT = $("#drawingCanvasContainer")[0];
const CANVAS = $("#drawingCanvas")[0];
const CONTEXT = CANVAS.getContext("2d");

const TOLLERANCEBAR = $("#tollerancebar")[0];
const TOLLERANCELAB = $("#tollerancelabel")[0];
const TOLLERANCEBTN = $("#tollerancebutton")[0];

const TEXTINPUT = $("#textinput")[0];

const LOAD1 = $("#load1")[0];
const LOAD2 = $("#load2")[0];
const LOAD3 = $("#load3")[0];

const UNDO = $("#undo")[0];
const REDO = $("#redo")[0];

const BLOCKER = $("#blocker")[0];
const LOADER = $("#loader")[0];
const ERROR507 = $("#error507")[0];


HTMLElement.prototype.animate = function(name, seconds=1, mode="ease-in-out", repetitions=1, reset=true, callback=null)
{
   if (reset == true && this.style.animationName === name)
   {
      this.style.animation = "none";
      this.offsetHeight;
      this.style.animation = "none";
   }

   this.style.animation = `${name} ${seconds}s ${mode} ${repetitions}`;

   this.addEventListener("animationend", function()
   {
      this.style.animation = "none";
      if (callback != null) callback();
   }, {once: true});
};

CanvasRenderingContext2D.prototype.saveToHistory = function()
{
   history = history.slice(0, ++history[0]);
   history.push({pixels: this.getPixelData(), width: this.canvas.width, height: this.canvas.height});
};

CanvasRenderingContext2D.prototype.getPixelData = function(begX=0, begY=0, endX=this.canvas.width, endY=this.canvas.height)
{
   return this.getImageData(begX, begY, endX - begX, endY - begY).data;
};
CanvasRenderingContext2D.prototype.putPixelData = function(pixelData, begX=0, begY=0, endX=this.canvas.width, endY=this.canvas.height, putX=begX, putY=begY)
{
   let imgData = this.getImageData(begX, begY, endX - begX, endY - begY);

   imgData.data.set(pixelData);

   this.putImageData(imgData, putX, putY);
};


$(CANVASCONT).resizable({
   handles: "se",
   classes: {"ui-resizable-handle": "ui-icon ui-icon-grip-diagonal-se"},
   helper: "drawingCanvasContainer-helper",

   minHeight: 100,
   minWidth:  100,
   maxHeight: 1920,
   maxWidth:  1920,

   resize: function(event, ui)
   {
      const minWidth = 100;
      const maxWidth = 1920;

      ui.size.width += ui.size.width - ui.originalSize.width;

      let finalWidth = (ui.size.width < minWidth) ? minWidth : (ui.size.width > maxWidth) ? maxWidth : ui.size.width;

      ui.helper.css("left", ui.position.left + (ui.originalSize.width - finalWidth)/2);
   },

   stop: function(event, ui)
   {
      const minWidth = 100;
      const maxWidth = 1920;

      let finalWidth = (ui.size.width < minWidth) ? minWidth : (ui.size.width > maxWidth) ? maxWidth : ui.size.width;
      let borderSize = +ui.element.css("border-width").slice(0, -2);

      ui.element.css("width",  (finalWidth     - borderSize*2) + "px");
      ui.element.css("height", (ui.size.height - borderSize*2) + "px");

      setCanvasSize(CANVAS, CANVASCONT.clientWidth, CANVASCONT.clientHeight);
      CONTEXT.saveToHistory();
   }
});


setInterval(function()
{
   if (opt.obj?.id == "bucket")
   {
      let tolleranceColor = CONTEXT.getPixelData(TOLLERANCEBTN.offsetLeft, TOLLERANCEBTN.offsetTop, TOLLERANCEBTN.offsetLeft+1, TOLLERANCEBTN.offsetTop+1);

      TOLLERANCEBTN.style.color = `rgb(${tolleranceColor[0]},${tolleranceColor[1]},${tolleranceColor[2]})`;
      TOLLERANCELAB.style.color = `rgb(${tolleranceColor[0]},${tolleranceColor[1]},${tolleranceColor[2]})`;

      if (CANVASCONT.clientWidth < 320) TOLLERANCELAB.innerText = TOLLERANCELAB.innerText.replace("Fill Tollerance = ", "Tol:");
      else TOLLERANCELAB.innerText = TOLLERANCELAB.innerText.replace("Tol:", "Fill Tollerance = ");
   }
   else
   {
      if (TOLLERANCEBTN.innerText == "Hide") TOLLERANCEBTN.click();
      TOLLERANCEBTN.style.display = "none";
   }
}, 1000);


CANVASCONT.addEventListener("contextmenu", e => e.preventDefault());

CANVASCONT.addEventListener("touchstart", touchHandler, true);
CANVASCONT.addEventListener("touchmove", touchHandler, true);
CANVASCONT.addEventListener("touchend", touchHandler, true);
CANVASCONT.addEventListener("touchcancel", touchHandler, true);


$("#black")[0].style.outline = "2px dashed darkgray";

dynamicInput(TEXTINPUT)


CONTEXT.lineCap = "round";
CONTEXT.lineJoin = "round";
CONTEXT.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCU"+
"iIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50a"+
"XR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";

CONTEXT.putPixelData(CONTEXT.getPixelData().fill(255));


checkStorage(["canvas1data", "canvas2data", "canvas3data"], [LOAD1, LOAD2, LOAD3]);

let history = [0];
CONTEXT.saveToHistory();


let cutData = {canCut: true, pixels: null, width: 0, height: 0, ctrlv: false};
let opt = {obj: null, event: null, fun: null, color: "black", size: 3};


$("#pencil")[0].addEventListener("click", function()
{
   this.animate("shake", 0.25);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "url(assets/pencil.cur), auto";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      window.addEventListener("mouseup", () => CONTEXT.saveToHistory(), {once: true});
      drawMode(CANVAS, opt.size, opt.color);
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});
$("#eraser")[0].addEventListener("click", function()
{
   this.animate("shake", 0.25);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "url(assets/eraser.cur), auto";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      window.addEventListener("mouseup", () => CONTEXT.saveToHistory(), {once: true});
      eraseMode(CANVAS, "white")
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});
$("#bucket")[0].addEventListener("click", function()
{
   this.animate("shake", 0.25);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "url(assets/bucket.cur), auto";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   TOLLERANCEBTN.style.display = "inline";

   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      fillMode(CANVAS, opt.color, TOLLERANCEBAR.value);
      CONTEXT.saveToHistory();
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});

TOLLERANCEBAR.addEventListener("input", function()
{
   TOLLERANCELAB.innerText = "Fill Tollerance = " + this.value;

   if (CANVASCONT.clientWidth < 320) TOLLERANCELAB.innerText = TOLLERANCELAB.innerText.replace("Fill Tollerance = ", "Tol:");
});
TOLLERANCEBTN.addEventListener("click", function()
{
   if (TOLLERANCEBTN.innerText === "Show")
   {
      TOLLERANCEBTN.innerText = "Hide";
      TOLLERANCEBAR.style.display = "inline";
      TOLLERANCELAB.style.display = "inline";

      TOLLERANCEBTN.style.bottom = "18px";
      TOLLERANCEBTN.style.left = "calc(15px + 35%)";

      TOLLERANCELAB.innerText = "Fill Tollerance = " + TOLLERANCEBAR.value;

      if (CANVASCONT.clientWidth < 320) TOLLERANCELAB.innerText = TOLLERANCELAB.innerText.replace("Fill Tollerance = ", "Tol:");
   }
   else
   {
      TOLLERANCEBTN.innerText = "Show";
      TOLLERANCEBAR.style.display = "none";
      TOLLERANCELAB.style.display = "none";

      TOLLERANCEBTN.style.bottom = "0px";
      TOLLERANCEBTN.style.left = "2px";
   }
});

$("#clear")[0].addEventListener("click", function()
{
   this.animate("shake", 0.25);

   CONTEXT.putPixelData(CONTEXT.getPixelData().fill(255));

   CONTEXT.saveToHistory();
});
$("#cut")[0].addEventListener("click", function()
{
   this.animate("shake", 0.25);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "crosshair";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      if (cutData.canCut) cutMode(CANVAS);
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});

$("#line")[0].addEventListener("click", function()
{
   this.animate("bounce", 0.15);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "crosshair";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      window.addEventListener("mouseup", () => CONTEXT.saveToHistory(), {once: true});
      lineMode(CANVAS, opt.size, opt.color)
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});
$("#square")[0].addEventListener("click", function()
{
   this.animate("bounce", 0.15);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "crosshair";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      window.addEventListener("mouseup", () => CONTEXT.saveToHistory(), {once: true});
      rectMode(CANVAS, opt.size, opt.color)
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});
$("#circle")[0].addEventListener("click", function()
{
   this.animate("bounce", 0.15);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "crosshair";

   TEXTINPUT.style.display = "none";
   TEXTINPUT.value = "";
   CANVAS.removeEventListener("mousedown", opt.fun);

   opt.fun = function()
   {
      window.addEventListener("mouseup", () => CONTEXT.saveToHistory(), {once: true});
      ellipseMode(CANVAS, opt.size, opt.color)
   };

   CANVAS.addEventListener("mousedown", opt.fun);
});
$("#text")[0].addEventListener("click", function()
{
   this.animate("bounce", 0.15);
   if (opt.obj !== null) opt.obj.style.outline = "none";
   opt.obj = this;
   opt.obj.style.outline = "2px dashed darkgray";

   CANVAS.style.cursor = "default";

   TEXTINPUT.style.display = "inline";

   CANVAS.removeEventListener("mousedown", opt.fun);

   txtMode()
});

$("#save")[0].addEventListener("input", function()
{
   this.animate("shake", 0.25);

   let option = this.value;
   this.value = "0";

   switch (option)
   {
      case "save1": case "save2": case "save3":
      {
         LOADER.style.display = "inline";

         BLOCKER.style.display = "inline";
         LOADER.style.display = "inline";

         let id = "canvas" + option[option.length - 1];

         let worker = new Worker("scripts/dataCompress.js");

         worker.onmessage = function(event)
         {
            BLOCKER.style.display = "none";
            LOADER.style.display = "none";

            try
            {
               localStorage.setItem(id + "data", event.data);
               localStorage.setItem(id + "width", CANVAS.width);
               localStorage.setItem(id + "height", CANVAS.height);
            }
            catch
            {
               ERROR507.style.display = "inline";
               ERROR507.animate("fade", 2, "alternate", 2, true, () => ERROR507.style.display = "none");
            }

            checkStorage(["canvas1data", "canvas2data", "canvas3data"], [LOAD1, LOAD2, LOAD3]);
         };

         worker.postMessage(CONTEXT.getPixelData());

         break;
      }

      case "load1": case "load2": case "load3":
      {
         BLOCKER.style.display = "inline";
         LOADER.style.display = "inline";

         CONTEXT.putPixelData(CONTEXT.getPixelData().fill(255));

         let id = "canvas" + option[option.length - 1];

         let worker = new Worker("scripts/dataDecompress.js");

         worker.onmessage = function(event)
         {
            BLOCKER.style.display = "none";
            LOADER.style.display = "none";

            let datawidth = localStorage.getItem(id + "width");
            let dataheight = localStorage.getItem(id + "height");

            CANVASCONT.style.width = datawidth + "px";
            CANVASCONT.style.height = dataheight + "px";
            setCanvasSize(CANVAS, datawidth, dataheight);

            CONTEXT.putPixelData(event.data, 0, 0, datawidth, dataheight);

            history = [0];
            CONTEXT.saveToHistory();
         };

         worker.postMessage(localStorage.getItem(id + "data"));

         break;
      }

      case "clear":
      {
         localStorage.clear();

         break;
      }

      case "download":
      {
         let link = document.createElement("a");

         link.download = "canvas.png";
         link.href = CANVAS.toDataURL("image/png");

         link.click();

         break;
      }

      case "upload":
      {
         const UPLOADIMG = $("#uploadimg")[0];

         UPLOADIMG.click();

         UPLOADIMG.addEventListener("change", function()
         {
            uploadImage(this.files[0]);
            this.value = "";
         }, {once: true});

         break;
      }
   }

   checkStorage(["canvas1data", "canvas2data", "canvas3data"], [LOAD1, LOAD2, LOAD3]);
});
UNDO.addEventListener("click", function()
{
   if (history[0] >= 2)
   {
      this.animate("left", 0.15);
      undoHistory(false);
   }
   else this.animate("bigShake", 0.2);
});
REDO.addEventListener("click", function()
{
   if (history[0] < history.length - 1)
   {
      this.animate("right", 0.15);
      redoHistory(false);
   }
   else this.animate("bigShake", 0.2);
});

$("#colorpicker")[0].addEventListener("input", function()
{
   if (opt.color.charAt(0) !== "#") $("#"+opt.color)[0].style.outline = "none";

   opt.color = this.value;
});
$(".colors").on("click", function()
{
   if (opt.color.charAt(0) !== "#") $("#"+opt.color)[0].style.outline = "none";

   this.style.outline = "2px dashed darkgray";

   this.animate("bounce", 0.15);
   opt.color = this.id;
});
$("#sizebar")[0].addEventListener("input", function()
{
   const SIZECOUNT = $("#sizecount")[0];

   opt.size = this.value;

   SIZECOUNT.style.visibility = "visible";
   SIZECOUNT.innerText = this.value;

   SIZECOUNT.style.fontSize = (+this.value * 0.8) + 10 + "px";
   SIZECOUNT.style.left = -210 + +this.value*16.2 + "px";

   this.addEventListener("change", () => SIZECOUNT.style.visibility = "hidden", {once: true});
});

CANVASCONT.addEventListener("dragenter", () => CANVASCONT.style.border = "2px dashed darkgray");
CANVASCONT.addEventListener("dragleave", () => CANVASCONT.style.border = "2px solid black");
CANVASCONT.addEventListener("dragover", e => e.preventDefault());
CANVASCONT.addEventListener("drop", function(e)
{
   e.preventDefault();
   e.stopPropagation();

   this.style.border = "2px solid black";

   uploadImage(e.dataTransfer.files[0]);
});

window.addEventListener("keydown", function(e)
{
   if (e.ctrlKey || e.metaKey)
   {
      switch (e.key)
      {
         case "z":
         {
            if (history[0] >= 2)
            {
               UNDO.animate("left", 0.15, "ease-in-out", 1, false);
               undoHistory(false);
            }
            else UNDO.animate("bigShake", 0.2, "ease-in-out", 1, false);

            break;
         }

         case "y":
         {
            if (history[0] < history.length - 1)
            {
               REDO.animate("right", 0.15, "ease-in-out", 1, false);
               redoHistory(false);
            }
            else REDO.animate("bigShake", 0.2, "ease-in-out", 1, false);

            break;
         }
      }
   }
});



function drawMode(canvas, size, color)
{
   let context = canvas.getContext("2d");
   let mouse = {x: mousePos().x, y: mousePos().y};

   let pencilSession = function()
   {
      mouse = {oldx: mouse.x, oldy: mouse.y, x: mousePos().x, y: mousePos().y};

      drawLine(context, [mouse.oldx, mouse.oldy], [mouse.x, mouse.y], size, color);
   }

   pencilSession();

   window.addEventListener("mousemove", pencilSession);

   window.addEventListener("mouseup", () => window.removeEventListener("mousemove", pencilSession), {once: true});
};
function eraseMode(canvas, color)
{
   let context = canvas.getContext("2d");
   let mouse = {x: mousePos().x, y: mousePos().y};
   let sizeAverage = 2;

   let pencilSession = function()
   {
      mouse = {oldx: mouse.x, oldy: mouse.y, x: mousePos().x, y: mousePos().y};

      let curSize = Math.abs(mouse.x - mouse.oldx + mouse.y - mouse.oldy);
      if (curSize < 1) curSize = 1;
      else if (curSize > 10) curSize = 10;

      sizeAverage = (sizeAverage * 14 + curSize) / 15;

      drawLine(context, [mouse.oldx, mouse.oldy], [mouse.x, mouse.y], sizeAverage*5, color);
   }

   pencilSession();

   window.addEventListener("mousemove", pencilSession);

   window.addEventListener("mouseup", () => window.removeEventListener("mousemove", pencilSession), {once: true});
};
function fillMode(canvas, color, tollerance)
{
   CanvasRenderingContext2D.prototype.floodFill = function(startX, startY, newRGB, tollerance=0)
   {
      function substitute(data, sub = [], index = 0)
      {
         for (let i=0; i<sub.length; i++) data[index+i] = sub[i];
      };
      function matchesSubAt(data, sub = [], index = 0, tollerance = 0)
      {
         for (let i=0; i<sub.length; i++) if (Math.abs(data[index+i] - sub[i]) > tollerance) return false;
         return true;
      };

      let width = this.canvas.width;
      let height = this.canvas.height;
      let widthIndex = width * 4;

      let imgData = this.getPixelData();

      let startIndex = (startX + startY * width) * 4;

      let startRGB = imgData.slice(startIndex, startIndex + 3);

      let pixelStack = [[startX, startY]];
      let pixelCords, pixelInd, x, y;
      let reachLeft, reachRight;

      while(pixelStack.length)
      {
         pixelCords = pixelStack.pop();

         x = pixelCords[0];
         y = pixelCords[1];

         pixelInd = (x + y * width) * 4;

         while(y >= 0 && matchesSubAt(imgData, startRGB, pixelInd, tollerance))
         {
            y--;
            pixelInd -= widthIndex;
         }

         pixelInd += widthIndex;
         y++;

         reachLeft = false;
         reachRight = false;

         do
         {
            substitute(imgData, newRGB, pixelInd);

            if (x > 0)
            {
               if (matchesSubAt(imgData, startRGB, pixelInd - 4, tollerance) && matchesSubAt(imgData, newRGB, pixelInd - 4) == false)
               {
                  if (!reachLeft)
                  {
                     pixelStack.push([x - 1, y]);
                     reachLeft = true;
                  }
               }

               else if (reachLeft) reachLeft = false;
            }

            if (x < width-1)
            {
               if (matchesSubAt(imgData, startRGB, pixelInd + 4, tollerance) && matchesSubAt(imgData, newRGB, pixelInd + 4) == false)
               {
                  if (!reachRight)
                  {
                     pixelStack.push([x + 1, y]);
                     reachRight = true;
                  }
               }

               else if (reachRight) reachRight = false;
            }

            pixelInd += widthIndex;
         } while (y++ <= height-1 && matchesSubAt(imgData, startRGB, pixelInd, tollerance));
      }

      this.putPixelData(imgData);
   };

   const COLORSRGB =
   {
      "red":    [255, 0,   0  ],
      "orange": [255, 165, 0  ],
      "yellow": [255, 255, 0  ],
      "green":  [0,   128, 0  ],
      "blue":   [0,   0,   255],
      "purple": [128, 0,   128],
      "gray":   [128, 128, 128],
      "brown":  [165, 42,  42 ],
      "black":  [0,   0,   0  ],
      "white":  [255, 255, 255],
   };

   let context = canvas.getContext("2d");
   let mouse = mousePos();
   let rgb = color[0] == "#" ? hexToRGB(color) : COLORSRGB[color];

   context.floodFill(mouse.x, mouse.y, rgb, tollerance)
};
function cutMode(canvas)
{
   let context = canvas.getContext("2d");
   let mouse = {begX: mousePos().x, begY: mousePos().y};
   let tempPixelData = context.getPixelData();

   let cutSession = function()
   {
      mouse.x = mousePos().x;
      mouse.y = mousePos().y;

      context.putPixelData(tempPixelData);

      drawRect(context, [mouse.begX-1, mouse.begY-1], [mouse.x, mouse.y], 1, "black", 5);
   }

   window.addEventListener("mousemove", cutSession);


   let moveCutSession = function()
   {
      cutData.canCut = false;
      cutData.ctrlv = false;

      window.removeEventListener("mousemove", cutSession);

      context.putPixelData(tempPixelData);

      if (mouse.x == mouse.begX) mouse.x++;
      if (mouse.y == mouse.begY) mouse.y++;

      if (mouse.begX > mouse.x) [mouse.begX, mouse.x] = [++mouse.x, --mouse.begX];
      if (mouse.begY > mouse.y) [mouse.begY, mouse.y] = [++mouse.y, --mouse.begY];

      let cut = {pixels: context.getPixelData(mouse.begX, mouse.begY, mouse.x, mouse.y),
         begX: mouse.begX, begY: mouse.begY, endX: mouse.x, endY: mouse.y}

      drawRect(context, [cut.begX-1, cut.begY-1], [cut.endX, cut.endY], 1, "black", 5)

      let waitDrag = function()
      {
         window.removeEventListener("keydown", keyDown);

         if (mousePos().x > cut.begX && mousePos().x < cut.endX && mousePos().y > cut.begY && mousePos().y < cut.endY)
         {
            context.putPixelData(tempPixelData);
            context.putPixelData([...cut.pixels].fill(255), cut.begX, cut.begY, cut.endX, cut.endY);
            if (cutData.ctrlv == false) tempPixelData = context.getPixelData();

            context.putPixelData(cut.pixels, cut.begX, cut.begY, cut.endX, cut.endY);
            drawRect(context, [cut.begX-1, cut.begY-1], [cut.endX, cut.endY], 1, "black", 5);

            mouse.begX = mousePos().x;
            mouse.begY = mousePos().y;

            let cutMove = function()
            {
               mouse.x = mousePos().x;
               mouse.y = mousePos().y;

               cut.newBegX = cut.begX + mouse.x - mouse.begX;
               cut.newBegY = cut.begY + mouse.y - mouse.begY;
               cut.newEndX = cut.endX + mouse.x - mouse.begX;
               cut.newEndY = cut.endY + mouse.y - mouse.begY;

               context.putPixelData(tempPixelData);
               context.putPixelData(cut.pixels, cut.begX, cut.begY, cut.endX, cut.endY, cut.newBegX, cut.newBegY);

               drawRect(context, [cut.newBegX-1, cut.newBegY-1], [cut.newEndX, cut.newEndY], 1, "black", 5);
            }

            window.addEventListener("mousemove", cutMove);

            window.addEventListener("mouseup", function()
            {
               window.removeEventListener("mousemove", cutMove);

               context.putPixelData(tempPixelData);
               context.putPixelData(cut.pixels, cut.begX, cut.begY, cut.endX, cut.endY, cut.newBegX, cut.newBegY);

               cutData.canCut = true;

               context.saveToHistory();
            }, {once: true});
         }

         else
         {
            context.putPixelData(tempPixelData);

            if (cutData.ctrlv == true)
            {
               context.putPixelData(cut.pixels, cut.begX, cut.begY, cut.endX, cut.endY);
               context.saveToHistory();
            }

            if (mousePos().x >= 0 && mousePos().x <= canvas.width && mousePos().y >= 0 && mousePos().y <= canvas.height) cutMode(canvas);
            else cutData.canCut = true;
         }
      }

      let keyDown = function(e)
      {
         if (e.ctrlKey || e.metaKey)
         {
            switch (e.key)
            {
               case "c":
               {
                  context.putPixelData(tempPixelData);

                  cutData.pixels = cut.pixels;
                  cutData.width = cut.endX - cut.begX;
                  cutData.height = cut.endY - cut.begY;

                  break;
               }

               case "v":
               {
                  context.putPixelData(tempPixelData);
                  context.putPixelData(cutData.pixels, 0, 0, cutData.width, cutData.height);

                  cut.pixels = context.getPixelData(0, 0, cutData.width, cutData.height);
                  cut.begX = 0;
                  cut.begY = 0;
                  cut.endX = cutData.width;
                  cut.endY = cutData.height;

                  drawRect(context, [0, 0], [cutData.width, cutData.height], 1, "black", 5);

                  cutData.ctrlv = true;

                  break;
               }
            }
         }

         else
         {
            switch (e.key)
            {
               case "Delete":
               {
                  window.removeEventListener("keydown", keyDown);
                  window.removeEventListener("mousedown", waitDrag);

                  context.putPixelData(tempPixelData);
                  context.putPixelData([...cut.pixels].fill(255), cut.begX, cut.begY, cut.endX, cut.endY);

                  cutData.canCut = true;

                  context.saveToHistory();

                  break;
               }
            }
         }
      }

      window.addEventListener("mousedown", waitDrag, {once: true});

      window.addEventListener("keydown", keyDown);
   }

   window.addEventListener("mouseup", moveCutSession, {once: true});
};

function lineMode(canvas, size, color)
{
   let context = canvas.getContext("2d");
   let mouse = {begx: mousePos().x, begy: mousePos().y};

   let tempData = context.getPixelData();

   let lineSession = function()
   {
      mouse.x = mousePos().x;
      mouse.y = mousePos().y;

      context.putPixelData(tempData);

      drawLine(context, [mouse.begx, mouse.begy], [mouse.x, mouse.y], size, color);
   }

   lineSession();

   window.addEventListener("mousemove", lineSession);

   window.addEventListener("mouseup", () => window.removeEventListener("mousemove", lineSession), {once: true});
};
function rectMode(canvas, size, color)
{
   let context = canvas.getContext("2d");
   let mouse = {begx: mousePos().x, begy: mousePos().y};

   let tempData = context.getPixelData();

   let rectSession = function()
   {
      mouse.x = mousePos().x;
      mouse.y = mousePos().y;

      context.putPixelData(tempData);

      drawRect(context, [mouse.begx, mouse.begy], [mouse.x, mouse.y], size, color);
   }

   rectSession();

   window.addEventListener("mousemove", rectSession);

   window.addEventListener("mouseup", () => window.removeEventListener("mousemove", rectSession), {once: true});
};
function ellipseMode(canvas, size, color)
{
   let context = canvas.getContext("2d");
   let mouse = {begx: mousePos().x, begy: mousePos().y};

   let tempData = context.getPixelData();

   let ellipseSession = function()
   {
      mouse.x = mousePos().x;
      mouse.y = mousePos().y;

      context.putPixelData(tempData);

      drawEllipse
      (
         context,
         [mouse.begx + (mouse.x - mouse.begx)/2, mouse.begy + (mouse.y - mouse.begy)/2],
         [Math.abs(mouse.x - mouse.begx)/2, Math.abs(mouse.y - mouse.begy)/2],
         size, color
      );
   }

   ellipseSession();

   window.addEventListener("mousemove", ellipseSession);

   window.addEventListener("mouseup", () => window.removeEventListener("mousemove", ellipseSession), {once: true});
};
function txtMode()
{
   const defSize = 250;
   const fontSize = 30;
   const font = "Arial";
   TEXTINPUT.focus();

   let txtInput = function()
   {
      if (window.event.code === "Enter")
      {
         TEXTINPUT.style.display = "none";
         TEXTINPUT.style.width = defSize + "px";
         TEXTINPUT.removeEventListener("keydown", txtInput);

         if (TEXTINPUT.value == "") return;


         let tempPixelData = CONTEXT.getPixelData();


         let txt = {text: TEXTINPUT.value, fontSize: fontSize, font: font, color: opt.color};


         TEXTINPUT.value = "";

         CONTEXT.font = `${txt.fontSize}px ${txt.font}`;
         const textWidth = CONTEXT.measureText(txt.text).width;


         let rect = {
            begX: CANVAS.width/2 - textWidth/2 - 5,
            begY: CANVAS.height/2 - txt.fontSize + 12,
            endX: CANVAS.width/2 + textWidth/2 + 5,
            endY: CANVAS.height/2 + txt.fontSize/2 + 6
         };

         if (textWidth < defSize)
         {
            rect.begX = CANVAS.width/2 - defSize/2 - 5;
            rect.endX = CANVAS.width/2 + defSize/2 + 5;
         }

         txt.x = rect.begX - textWidth/2 + (rect.endX - rect.begX)/2;
         txt.y = rect.endY - (txt.fontSize/3);

         drawText(CONTEXT, txt.text, txt.x, txt.y, txt.fontSize, txt.color, txt.font);
         drawRect(CONTEXT, [rect.begX, rect.begY], [rect.endX, rect.endY], 1, "black", 5);


         let waitDrag = function()
         {
            if (mousePos().x > rect.begX && mousePos().x < rect.endX && mousePos().y > rect.begY && mousePos().y < rect.endY)
            {
               CONTEXT.putPixelData(tempPixelData);
               drawText(CONTEXT, txt.text, txt.x, txt.y, txt.fontSize, txt.color, txt.font);
               drawRect(CONTEXT, [rect.begX, rect.begY], [rect.endX, rect.endY], 1, "black", 5);

               let mouse = {begX: mousePos().x, begY: mousePos().y};

               let txtMove = function()
               {
                  mouse.x = mousePos().x;
                  mouse.y = mousePos().y;

                  rect.newBegX = rect.begX + mouse.x - mouse.begX;
                  rect.newBegY = rect.begY + mouse.y - mouse.begY;
                  rect.newEndX = rect.endX + mouse.x - mouse.begX;
                  rect.newEndY = rect.endY + mouse.y - mouse.begY;

                  CONTEXT.putPixelData(tempPixelData);
                  drawText(CONTEXT, txt.text, rect.newBegX-textWidth/2+(rect.endX-rect.begX)/2, rect.newEndY-(txt.fontSize/3), txt.fontSize, txt.color, txt.font);
                  drawRect(CONTEXT, [rect.newBegX, rect.newBegY], [rect.newEndX, rect.newEndY], 1, "black", 5);
               }

               window.addEventListener("mousemove", txtMove);

               window.addEventListener("mouseup", function()
               {
                  window.removeEventListener("mousemove", txtMove);

                  CONTEXT.putPixelData(tempPixelData);
                  drawText(CONTEXT, txt.text, rect.newBegX-textWidth/2+(rect.endX-rect.begX)/2, rect.newEndY-(txt.fontSize/3), txt.fontSize, txt.color, txt.font);

                  CONTEXT.saveToHistory();
               }, {once: true});
            }

            else
            {
               CONTEXT.putPixelData(tempPixelData);
               drawText(CONTEXT, txt.text, txt.x, txt.y, txt.fontSize, txt.color, txt.font);

               CONTEXT.saveToHistory();
            }
         }

         window.addEventListener("mousedown", waitDrag, {once: true});
      }
   }

   TEXTINPUT.addEventListener("keydown", txtInput);
};


function drawLine(ctx, begpoints, endpoints, width=2, color="black")
{
   ctx.beginPath();

   ctx.strokeStyle = color;
   ctx.lineWidth = width;

   ctx.moveTo(begpoints[0], begpoints[1]);
   ctx.lineTo(endpoints[0], endpoints[1]);
   ctx.stroke();

   ctx.closePath();
};
function drawRect(ctx, begpoints, endpoints, width=2, color="black", ...linedash)
{
   ctx.beginPath();

   ctx.strokeStyle = color;
   ctx.lineWidth = width;
   ctx.setLineDash(linedash);

   ctx.rect(begpoints[0], begpoints[1], endpoints[0] - begpoints[0], endpoints[1] - begpoints[1]);
   ctx.stroke();

   ctx.closePath();

   ctx.setLineDash([]);
};
function drawEllipse(ctx, center, radius, width=2, color="black")
{
   ctx.beginPath();

   ctx.strokeStyle = color;
   ctx.lineWidth = width;
   ctx.setLineDash([]);

   ctx.ellipse(center[0], center[1], radius[0], radius[1], Math.PI * 2, 0, Math.PI * 2);
   ctx.stroke();

   ctx.closePath();
};
function drawText(ctx, text, x=200, y=200, size=20, color="black", font="arial")
{
   ctx.font = `${size}px ${font}`;
   ctx.fillStyle = color;
   ctx.fillText(text, x, y);
};


function undoHistory(safe=true)
{
   if (safe == false || history[0] >= 2)
   {
      let prevSave = history[--history[0]];

      CANVASCONT.style.width = prevSave.width + "px";
      CANVASCONT.style.height = prevSave.height + "px";
      setCanvasSize(CANVAS, prevSave.width, prevSave.height);

      CONTEXT.putPixelData(prevSave.pixels, 0, 0, prevSave.width, prevSave.height);
   }
};
function redoHistory(safe=true)
{
   if (safe == false || history[0] < history.length-1)
   {
      let succSave = history[++history[0]];

      CANVASCONT.style.width = succSave.width + "px";
      CANVASCONT.style.height = succSave.height + "px";
      setCanvasSize(CANVAS, succSave.width, succSave.height);

      CONTEXT.putPixelData(succSave.pixels, 0, 0, succSave.width, succSave.height);
   }
};


function uploadImage(src)
{
   let img = new Image();

   img.onload = function()
   {
      CONTEXT.putPixelData(CONTEXT.getPixelData().fill(255));

      let scale = Math.min(CANVAS.width/img.width, CANVAS.height/img.height)
      CONTEXT.drawImage(img, 0, 0, img.width * scale, img.height * scale);

      history = [0];
      CONTEXT.saveToHistory();
   };

   img.src = URL.createObjectURL(src);
};


function setCanvasSize(canvas, width, height)
{
   let ctx = canvas.getContext("2d");

   let tempctx = {
      imageData: ctx.getImageData(0,0, canvas.width, canvas.height),
      lineCap: ctx.lineCap,
      lineJoin: ctx.lineJoin,
      filter: ctx.filter,
   };

   canvas.width = width;
   canvas.height = height;

   ctx.putPixelData(ctx.getPixelData().fill(255));

   ctx.putImageData(tempctx.imageData, 0, 0);
   ctx.lineCap = tempctx.lineCap;
   ctx.lineJoin = tempctx.lineJoin;
   ctx.filter = tempctx.filter;
};

function checkStorage(storageIDs, slots)
{
   for (let i=0; i < storageIDs.length; i++)
   {
      if (localStorage.getItem(storageIDs[i]) == null) slots[i].disabled = true;
      else slots[i].disabled = false;
   }
};

function hexToRGB(hex)
{
   return [parseInt(hex.substring(1, 3), 16),
      parseInt(hex.substring(3, 5), 16),
      parseInt(hex.substring(5, 7), 16)];
};


function mousePos(obj = CANVASCONT)
{
   return {x: window.event.pageX - obj.offsetLeft - obj.clientLeft,
      y: window.event.pageY - obj.offsetTop - obj.clientTop};
};

function touchHandler(event)
{
   let touches = event.changedTouches, first = touches[0], type = "";

   switch(event.type)
   {
      case "touchstart": type = "mousedown"; break;
      case "touchmove":  type = "mousemove"; break;
      case "touchend":   type = "mouseup";   break;
      default: return;
   }

   let simulatedEvent = new MouseEvent(type,
   {
      bubbles: true,
      cancelable: true,

      screenX: first.screenX,
      screenY: first.screenY,
      clientX: first.clientX,
      clientY: first.clientY,

      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null
   });

   first.target.dispatchEvent(simulatedEvent);
   event.preventDefault();
};

function dynamicInput(obj)
{
   const font = "30px arial";
   const defSize = 250;
   const maxSize = 492;

   obj.addEventListener("input", function()
   {
      let canvas = dynamicInput.canvas || (dynamicInput.canvas = document.createElement("canvas"));
      let context = canvas.getContext("2d");
      context.font = font;

      let metrics = context.measureText(obj.value);

      if (metrics.width > defSize)
      {
         while (metrics.width > maxSize)
         {
            obj.value = obj.value.slice(0, -1);
            metrics = context.measureText(obj.value);
         }
         obj.style.width = metrics.width + "px";
      }
      else obj.style.width = defSize + "px";
   });
};


function debug(text, id="debugText")
{
   text = JSON.stringify(text);

   if (id === true || document.getElementById(id) === null)
   {
      let debugtxt = document.createElement("p");
      debugtxt.id = id;
      debugtxt.innerText = text;
      debugtxt.style.fontSize = "20px";
      document.body.appendChild(debugtxt);
   }

   else document.getElementById(id).innerText = text;
};

function perf(fun, log=true)
{
   const BEG = performance.now();

   fun?.();

   const END = performance.now();

   if (log) console.log(`perf: ${END-BEG}`);

   return END - BEG;
};