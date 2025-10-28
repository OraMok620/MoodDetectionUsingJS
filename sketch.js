let faceApi; //hold the ml5.js Face API model used to detect face expressions.
let detections = []; //Array that used to store the detection result

let video; //Webcam
let canvas; //Area where the video and visual overlays are held.

function setup() {
  canvas = createCanvas(480, 360);
  canvas.parent(document.querySelector('.container')); 
  canvas.id("canvas");
  //set up the canvas with details, how the layout?

  video = createCapture(VIDEO);
  video.id("video")
  video.size(width, height);
  video.hide();
  //set up the video, size position... 

  const faceOptions = { //Defines options for the face detector
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  //Loads face api from ml5.js
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}


function faceReady() {
  faceapi.detect(gotFaces);
  //Runs the first face detection once the model is ready.
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return; //Callback function that runs after every detection.
  }
  detections = result;
  faceapi.detect(gotFaces); 
  //Stores the results and calls itself again, creating a continuous detection loop.
}



function drawBoxes(detections){
  if (detections.length > 0) {
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(255);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    strokeWeight(2);
    stroke(255);

    //check the data is it work through console.
    text("neutral:" + nf(neutral*100, 2, 2)+"%", x, y);
    console.log(neutral*100); 
    if (neutral > happy&&angry&&sad&&disgusted&&surprised&&fearful) {
      document.body.style.backgroundColor = "#ffffff";
    } //test is it work for using mood to change UI
    text("happiness:" + nf(happy*100, 2, 2)+"%", x, y+textYSpace);
    console.log(happy*100);
    if (happy > neutral&&angry&&sad&&disgusted&&surprised&&fearful) {
      document.body.style.backgroundColor = "#fcf63bff";
    }//test is it work for using mood to change UI
    text("anger:" + nf(angry*100, 2, 2)+"%", x, y+textYSpace*2);
    console.log(angry*100);
    if (angry > neutral&&happy&&sad&&disgusted&&surprised&&fearful) {
      document.body.style.backgroundColor = "#b00000ff";
    }//test is it work for using mood to change UI
    text("sad:"+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    console.log(sad*100);
    if (sad > neutral&&happy&&angry&&disgusted&&surprised&&fearful) {
      document.body.style.backgroundColor = "#A8A8A8";
    }//test is it work for using mood to change UI
    text("disgusted:" + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    console.log(disgusted*100);
    if (disgusted > neutral&&happy&&sad&&angry&&surprised&&fearful) {
      document.body.style.backgroundColor = "#0a7800ff";
    }//test is it work for using mood to change UI
    text("surprised:" + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    console.log(surprised*100);
    if (surprised > neutral&&happy&&sad&&angry&&disgusted&&fearful) {
      document.body.style.backgroundColor = "#ff9fd9ff";
    }//test is it work for using mood to change UI
    text("fear:" + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
    console.log(fearful*100);
    if (fearful > neutral&&happy&&sad&&angry&&disgusted&&surprised) {
      document.body.style.backgroundColor = "#6f00a3ff";
    }//test is it work for using mood to change UI
  }
  else{
    text("neutral:", x, y);
    text("happiness:", x, y + textYSpace);
    text("anger:", x, y + textYSpace*2);
    text("sad:", x, y + textYSpace*3);
    text("disgusted:", x, y + textYSpace*4);
    text("surprised:", x, y + textYSpace*5);
    text("fear:", x, y + textYSpace*6);
  }
  
  
}

function draw() {
  image(video, 0, 0, width, height);
  drawExpressions(detections, 20, 250, 14);
}
