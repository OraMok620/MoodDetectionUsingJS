let faceApi; //hold the ml5.js Face API model used to detect face expressions.
let detections = []; //Array that used to store the detection result

let video; //Webcam

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

    //To check if the mood detection is it work
    console.log("neutral:" + nf(neutral * 100, 2, 2) + "%");
    console.log("happiness:" + nf(happy * 100, 2, 2) + "%");
    console.log("anger:" + nf(angry * 100, 2, 2) + "%");
    console.log("sad:" + nf(sad * 100, 2, 2) + "%");
    console.log("disgusted:" + nf(disgusted * 100, 2, 2) + "%");
    console.log("surprised:" + nf(surprised * 100, 2, 2) + "%");
    console.log("fear:" + nf(fearful * 100, 2, 2) + "%");

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
  }
}

function draw() {
  drawExpressions(detections, 20, 250, 14);
}

