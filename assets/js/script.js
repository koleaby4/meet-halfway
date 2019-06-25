let map;
const markers = {};

$(document).ready(setUp);

function setUp() {
  if (numberOfParticipants() > 0) {
    loadParticipantsFromLocalStorage();
  } else {
    addRowToWhoIsComingTable();
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

async function setCentralPin(participants) {
  const center = centralLocation(participants);

  if (markers[0]) {
    deleteMarker(0);
  }

  if (numberOfParticipants() > 1) {
    const marker = addMarker(center, "", {
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/green.png" },
      animation: google.maps.Animation.BOUNCE
    });

    markers[0] = await marker;
  }
}

function loadParticipantsFromLocalStorage() {
  Object.values(getParticipantsFromLocalStorage()).forEach(participant => {
    addRowToWhoIsComingTable();
    const row = $(".participant-row").last();
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

function addRowToWhoIsComingTable() {
  document.querySelector("#addrow").click();
}

function addParticipantRow() {
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
}

const deleteParticipantRow = event => {
  const div = $(event).closest("div")[0];
  const participantId = div.id;
  deleteParticipantFromLocalStorage(participantId);
  div.remove();
  deleteMarker(participantId);

  setCentralPin(getParticipantsFromLocalStorage());
  zoomTo(Object.values(markers));
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
    const participants = getParticipantsFromLocalStorage();
    setCentralPin(participants);
    zoomTo(Object.values(markers));
  });
};

const zoomTo = markers => {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
};

const addMarkerForParticipant = participant =>
  (markers[participant.id] = addMarker(
    participant.location,
    getInitials(participant.name)
  ));

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
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};

const getInitials = name =>
  name
    .split(/\s+/)
    .map(word => word.trim()[0])
    .join("");

const notifyFetchLocationFailed = (row, participant) => {
  alert(`failed to fetch location for \n${JSON.stringify(participant)}`);
};

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
