let map;
const markers = {};
let lines = [];

$(document).ready(setUp);

function setUp() {
  if (numberOfParticipants() > 0) {
    loadParticipantsFromLocalStorage();
  } else {
    addParticipantRow(false);
  }
}

const numberOfParticipants = () =>
  Object.keys(getParticipantsFromLocalStorage()).length;

const centralLocation = participants => {
  if (Object.keys(participants).length <= 1) {
    return {};
  }
  const lats = [];
  const lngs = [];
  Object.values(participants).forEach(participant => {
    lats.push(participant.location.lat);
    lngs.push(participant.location.lng);
  });
  return new google.maps.LatLng(average(lats), average(lngs));
};

const average = collection =>
  collection.reduce((a, b) => a + b, 0) / collection.length;

function setCentralPin() {
  const center = centralLocation(getParticipantsFromLocalStorage());

  if (markers[0]) {
    deleteMarker(0);
  }

  var image = {
    url: "assets/images/central-pin.svg",
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(40, 40)
  };

  if (numberOfParticipants() > 1) {
    const marker = addMarker(center, "", {
      icon: image,
      animation: google.maps.Animation.BOUNCE
    });

    marker.addListener('click', () => {
      map.setZoom(18);
      map.setCenter(marker.getPosition());
    });

    markers[0] = marker;
    console.log(`Central pin: ${markers[0].position}`);
  }
}

function loadParticipantsFromLocalStorage() {
  Object.values(getParticipantsFromLocalStorage()).forEach(participant => {
    addParticipantRow();
    const row = $(".participant-row").first();
    row
      .find("[name=name]")
      .first()
      .val(participant.name);
    row
      .find("[name=address]")
      .first()
      .val(participant.address);
    deleteParticipantFromLocalStorage(participant.id);
  });
}

function addParticipantRow(withFocusOnButton = true) {
  var newRow = $(
    '<div class="participant-row row align-items-center justify-content-center">'
  );

  let cols =
    '<input type="text" class="form-control col-12" name="name" placeholder="Name" />';
  cols +=
    '<input type="text" class="form-control col-12" name="address" placeholder="Address" />';
  cols += `<button type="button" class="btn btn-success confirm-participant-button" onclick="confirmParticipant(this)">
        <ion-icon name="checkmark" class="confirm-participant-icon"></ion-icon></button>`;
  cols += `<button type="button" class="btn btn-danger delete-participant-button" onclick="deleteParticipantRow(this)">
            <ion-icon name="trash" class="delete-participant-icon" /></button>`;
  newRow.append(cols);
  $("#who-is-coming-table").prepend(newRow);
  if (withFocusOnButton) {
    document.querySelector("input[name='name']").focus();
  }
}

const deleteParticipantRow = event => {
  const div = $(event).closest("div")[0];
  const participantId = div.id;
  deleteParticipantFromLocalStorage(participantId);
  div.remove();
  deleteMarker(participantId);

  reflectChangesOnMap();
};

const deleteMarker = participantId => {
  if (markers[participantId]) {
    markers[participantId].setMap(null);
    delete markers[participantId];
  }
};

const getParticipantsFromLocalStorage = () =>
  localStorage.participants ? JSON.parse(localStorage.participants) : {};

const saveParticipantsToLocalStorage = participants =>
  localStorage.setItem("participants", JSON.stringify(participants));

const deleteParticipantFromLocalStorage = id => {
  const participants = getParticipantsFromLocalStorage();
  delete participants[id];
  saveParticipantsToLocalStorage(participants);
};

const appendParticipantToLocalStorage = participant => {
  const participants = getParticipantsFromLocalStorage();
  participants[participant.id] = participant;
  saveParticipantsToLocalStorage(participants);
};

const confirmParticipant = button => {
  const row = button.parentNode;
  const participant = participantFactory(row);

  addParticipant(participant, () => {
    lockRow(row);
    row.setAttribute("id", participant.id);
    reflectChangesOnMap();
  });

  if (document.querySelectorAll('.confirm-participant-button').length < 2) {
    addParticipantRow(true)
  }
};

const reflectChangesOnMap = () => {
  console.log("Setting central pin");
  setCentralPin();
  console.log("Zooming to markers");
  zoomToMarkers();
  console.log("Drawing lines");
  drawLines();
};

const zoomToMarkers = () => {
  const pins = Object.values(markers);
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < pins.length; i++) {
    bounds.extend(pins[i].position);
  }
  map.fitBounds(bounds);
};

const addMarkerForParticipant = participant =>
  (markers[participant.id] = addMarker(
    participant.location,
    getInitials(participant.name)
  ));

const drawLines = () => {
  console.log(`Markers: ${markers}`);

  deleteLines();

  if (markers[0] === undefined) {
    return;
  }

  Object.values(markers).forEach(marker => {
    let line = new google.maps.Polyline({
      path: [marker.position, markers[0].position],
      geodesic: true,
      strokeColor: "#53be53",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    line.setMap(map);
    lines.push(line);
  });
};

const deleteLines = () => {
  lines.forEach(line => line.setMap(null));
  lines = [];
};

const addMarker = (location, label, otherProps) => {
  map.setCenter(location);
  const payload = {
    map: map,
    position: location,
    animation: google.maps.Animation.DROP,
    label: label,
    ...otherProps
  };

  return new google.maps.Marker(payload);
};

const addParticipant = (participant, callback) => {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: participant.address }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      participant.location = location;
      addMarkerForParticipant(participant);
      appendParticipantToLocalStorage(participant);
      callback();
    } else {
      showAlert('Geocode was not successful', `Reason: ${errorMap[status] || status}`)
    }
  });
};

const errorMap = {
  'INVALID_REQUEST': 'Address not provided',
  'ZERO_RESULTS': 'Address not found'
}

const showAlert = (title, text) =>
  Swal.fire({
    title,
    text,
    type: 'warning',
    confirmButtonText: 'Cool'
  })

const getInitials = name =>
  name
    .split(/\s+/)
    .map(word => word.trim()[0])
    .join("");

const lockRow = row => {
  Array.from(row.getElementsByTagName("input")).forEach(element => {
    if (element.name == "name") {
      element.value = `(${getInitials(element.value)}) ${element.value}`;
    }
    element.setAttribute("disabled", "disabled");
  });

  row.removeChild(row.querySelector("[class*=confirm-participant-button]"));
};

class Participant {
  constructor(name, address) {
    this.name = name;
    this.address = address;
    this.id = new Date().getTime();
  }
}

const participantFactory = row => {
  const [name, address] = Array.from(row.getElementsByTagName("input")).map(
    input => input.value
  );
  return new Participant(name, address);
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.53037, lng: -0.173648 },
    zoom: 8
  });
}
