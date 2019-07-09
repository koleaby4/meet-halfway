const config = {
  apiKey: "AIzaSyANWsZmkCQmlpEYxwFXUaQo3Xku0vx0mcI"
};

document
  .getElementById("googleApiSrc")
  .setAttribute(
    "src",
    `https://maps.googleapis.com/maps/api/js?key=${
    config.apiKey
    }&callback=initMap`
  );