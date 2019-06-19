$(document).ready(whoIsComingTable);

function whoIsComingTable() {
  $("#addrow").on("click", function() {
    var newRow = $("<tr class='row'>");
    var cols = "";

    cols +=
      '<td><input type="text" class="form-control col-sm" name="name"/></td>';
    cols +=
      '<td><input type="text" class="form-control col-sm" name="mail"/></td>';
    cols +=
      '<td><input type="text" class="form-control col-sm" name="phone"/></td>';

    cols +=
      '<td class="col-sm"><ion-icon name="trash" class="delete-participant badge-danger"/></td>';
    newRow.append(cols);
    $("table.order-list").append(newRow);
  });

  $("table.order-list").on("click", ".delete-participant", function(event) {
    $(this)
      .closest("tr")
      .remove();
  });
}
