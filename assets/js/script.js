document.addEventListener("DOMContentLoaded", () => {
  let showMenu = false;
  const btnMenu = document.querySelector(".menu-icon");
  const navList = document.querySelector(".navlist");
  btnMenu.addEventListener("click", () => {
    if (!showMenu) {
      showMenu = true;
      navList.classList.add("slide");
    } else {
      showMenu = false;
      navList.classList.remove("slide");
    }
  });

  // Load the detection models
  let but = document.getElementById("but");
  let video = document.getElementById("vid");
  let mediaDevices = navigator.mediaDevices;

  let modelJeruk;
  let modelTrain;

  // Load the modeljeruk.json
  tf.loadLayersModel("{{ url_for('model_folder', filename='modeljeruk.json')}}").then((loadedModel) => {
    modelJeruk = loadedModel;
    console.log("Model Jeruk Loaded Successfully:", modelJeruk);
  });

  // Load the train.json
  tf.loadLayersModel("{{ url_for('model_folder', filename='train.json')}}").then((loadedModel) => {
    modelTrain = loadedModel;
    console.log("Model Train Loaded Successfully:", modelTrain);
  });

  but.addEventListener("click", () => {
    mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
          video.play();

          // Run detection on each video frame for modelJeruk
          setInterval(() => {
            detectObjects(video, modelJeruk, "Jeruk");
          }, 1000); // Adjust the interval as needed

          // Run detection on each video frame for modelTrain
          setInterval(() => {
            detectObjects(video, modelTrain, "Train");
          }, 1000); // Adjust the interval as needed
        });
      })
      .catch(alert);
  });
});

async function detectObjects(video, model, modelName) {
  const imageCapture = new ImageCapture(video.srcObject.getVideoTracks()[0]);
  const img = await imageCapture.grabFrame();
  const tensor = tf.browser.fromPixels(img).expandDims();
  const predictions = await model.predict(tensor).data();

  // Process predictions and update your UI as needed
  console.log(`Predictions (${modelName}):`, predictions);
  // You can update your UI or take other actions based on the predictions for each model
}
