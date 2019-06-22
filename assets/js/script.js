$(document).ready(setUp);

function setUp() {
  addFirstRowToWhoIsComingTable();
}

function addFirstRowToWhoIsComingTable() {
  document.querySelector("#addrow").click();
}

function addParticipantRow() {
  var newRow = $(
    '<div class="participant-row row align-items-center justify-content-center">'
  );

  let cols =
    '<input type="text" class="form-control col-lg col-xl-5" name="name" placeholder="Name" />';
  cols +=
    '<input type="text" class="form-control col-lg" name="country" placeholder="Country" />';
  cols +=
    '<input type="text" class="form-control col-lg" name="postcode" placeholder="Post Code" />';
  cols += `<button type="button" class="btn btn-success confirm-participant-button" onclick="confirmParticipant(this)">
        <ion-icon name="checkmark" class="confirm-participant-icon"></ion-icon></button>`;
  cols += `<button type="button" class="btn btn-danger delete-participant-button" onclick="deleteParticipantRow(this)">
            <ion-icon name="trash" class="delete-participant-icon" /></button>`;
  newRow.append(cols);
  $("#who-is-coming-table").append(newRow);
  document.querySelector("#addrow").scrollIntoView(false);
}

function deleteParticipantRow(event) {
  $(event)
    .closest("div")
    .remove();
}

const confirmParticipant = button => {
  const row = button.parentNode;
  const participant = participantFactory(row);

  const location = fetchLocation(participant.country, participant.postCode);

  if (location) {
    lockRow(row);
  } else {
    notifyFetchLocationFailed(row, participant);
  }
};

const fetchLocation = row => {
  console.log(`fetching location for ${row}... `);
  return 1;
};

const notifyFetchLocationFailed = (row, participant) => {
  alert(`failed to fetch location for \n${JSON.stringify(participant)}`);
};

const lockRow = row => {
  Array.from(row.getElementsByTagName("input")).forEach(element =>
    element.setAttribute("disabled", "disabled")
  );

  row.removeChild(row.querySelector("[class*=confirm-participant-button]"));
};

class Participant {
  constructor(name, country, postCode) {
    this.name = name;
    this.country = country;
    this.postCode = postCode;
  }
}

const participantFactory = row => {
  const [name, country, postCode] = Array.from(
    row.getElementsByTagName("input")
  ).map(input => input.value);
  return new Participant(name, country, postCode);
};

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
}
