import { segmentBackground, applyBlur, applyImageBackground } from'/testvb/node_modules/virtual-bg/virtual-bg.js';

const inputVideoElement = document.querySelector('#inputVideoElement');
const outputCanvasElement = document.querySelector('#output_canvas');

let myStream = await navigator.mediaDevices.getUserMedia({
      video: true
});

inputVideoElement.srcObject = myStream;

// segments foreground & background
segmentBackground(inputVideoElement, outputCanvasElement);  

// applies a blur intensity of 7px to the background 
applyBlur(0); 

// applies an image background
const image = new Image();
image.src = './cloud-background.png'
applyImageBackground(image);
setTimeout(function(){
	
$('#output_canvas').height($('#inputVideoElement').height());
$('#output_canvas').width($('#inputVideoElement').width());
},100);

