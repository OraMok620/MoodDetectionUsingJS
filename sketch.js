let faceApi; //hold the ml5.js Face API model used to detect face expressions.
let detections = []; //Array that used to store the detection result

let video; //Webcam
let canvas; //Area where the video and visual overlays are held.

let emotionCounts = {
  neutral: 0,
  happy: 0,
  angry: 0,
  sad: 0,
  disgusted: 0,
  surprised: 0,
  fearful: 0
};
let startTime;

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
  startTime = millis(); // start timing here
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

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;

    textFont('Helvetica Neue');
    textSize(14);
    strokeWeight(2);
    stroke(255);

    text("neutral:" + nf(neutral * 100, 2, 2) + "%", x, y);
    text("happiness:" + nf(happy * 100, 2, 2) + "%", x, y + textYSpace);
    text("anger:" + nf(angry * 100, 2, 2) + "%", x, y + textYSpace * 2);
    text("sad:" + nf(sad * 100, 2, 2) + "%", x, y + textYSpace * 3);
    text("disgusted:" + nf(disgusted * 100, 2, 2) + "%", x, y + textYSpace * 4);
    text("surprised:" + nf(surprised * 100, 2, 2) + "%", x, y + textYSpace * 5);
    text("fear:" + nf(fearful * 100, 2, 2) + "%", x, y + textYSpace * 6);

    // Find the current dominant emotion in this frame
    let currentEmotion = "neutral";
    let maxVal = neutral;
    const emotions = { neutral, happy, angry, sad, disgusted, surprised, fearful };

    for (let e in emotions) {
      if (emotions[e] > maxVal) {
        maxVal = emotions[e];
        currentEmotion = e;
      }
    }

    // Count that emotion
    emotionCounts[currentEmotion]++;

    // Check highest detected mood every 5 mins
    let elapsed = millis() - startTime;
    if (elapsed >= 300000) { // 5 mins
      let dominantEmotion = "neutral";
      let maxCount = emotionCounts.neutral;
      for (let e in emotionCounts) {
        if (emotionCounts[e] > maxCount) {
          maxCount = emotionCounts[e];
          dominantEmotion = e;
        }
      }

      if (dominantEmotion === "neutral") {
        document.body.style.backgroundColor = "#ffffff";
      }
      if (dominantEmotion === "happy") {
        document.body.style.backgroundColor = "#fcf63bff";
      }
      if (dominantEmotion === "angry") {
        document.body.style.backgroundColor = "#b00000ff";
      }
      if (dominantEmotion === "sad") {
        document.body.style.backgroundColor = "#757474ff";
      }
      if (dominantEmotion === "disgusted") {
        document.body.style.backgroundColor = "#0a7800ff";
      }
      if (dominantEmotion === "surprised") {
        document.body.style.backgroundColor = "#ff9fd9ff";
      }
      if (dominantEmotion === "fearful") {
        document.body.style.backgroundColor = "#6f00a3ff";
      }

      console.log("Most detected emotion in last 5 mins:", dominantEmotion);

      //Reset for next 5 mins cycle
      for (let e in emotionCounts) emotionCounts[e] = 0;
      startTime = millis();
    }
  } else {
    text("neutral:", x, y);
    text("happiness:", x, y + textYSpace);
    text("anger:", x, y + textYSpace * 2);
    text("sad:", x, y + textYSpace * 3);
    text("disgusted:", x, y + textYSpace * 4);
    text("surprised:", x, y + textYSpace * 5);
    text("fear:", x, y + textYSpace * 6);
  }
}


function draw() {
  image(video, 0, 0, width, height);
  drawExpressions(detections, 20, 250, 14);
}

