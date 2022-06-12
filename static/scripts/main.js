console.log("js loaded");

// from Django Docs
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie("csrftoken");

const add_button = document.querySelector('button[type="submit"]');
// const add_new_entry_button = document.getElementById("add-new-entry-button");
// add_new_entry_button.style.display = 'none';
let edit_button = document.getElementById("edit-button-save");
// edit_button.style.display = 'none'

const entry_content = document.getElementById("action-entry");
const edit_anchors = document.getElementsByClassName("edit-anchor");
let editInsulin = null;
let editCarbs = null;
let editFood = null;

for (let i = 0; i < edit_anchors.length; i++) {
  edit_anchors[i].addEventListener("click", function () {
    const elementId = edit_anchors[i].id;
    editInsulin = document.getElementById(
      `edit-insulin-${elementId}`
    ).innerHTML;
    editCarbs = document.getElementById(`edit-carbs-${elementId}`).innerHTML;
    editFood = document.getElementById(`edit-food-${elementId}`).innerHTML;
    window.localStorage.setItem(
      "sugafree",
      JSON.stringify({ editInsulin, editCarbs, editFood, elementId })
    );
  });
}

const editFormInsulin = document.getElementById("edit_insulin_in_units");
const editFormCarbs = document.getElementById("edit_carbs_in_grams");
const editFormFood = document.getElementById("edit_food_intake");
const data = JSON.parse(window.localStorage.getItem("sugafree"));

editFormInsulin.value = data?.editInsulin;
editFormCarbs.value = data?.editCarbs;
editFormFood.value = data?.editFood;

const InputForm = document.querySelector("#input-form");

const inputURL = "api/inputs/";

InputForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const user_id = InputForm.dataset.user;
  let formData = new FormData(InputForm);
  formData.append("user", user_id);

  fetch(inputURL, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "X-Request-With": "XMLHttpRequest",
      "X-CSRFToken": csrftoken,
    },
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //save data related to entry to be able to edit
      InputForm.dataset.inputId = data.id;
      // add_button.style.display = "none";
      // add_new_entry_button.style.display = "inline";
      // edit_button.style.display = "inline";
      // entry_content.innerHTML = "Edit Entry";
    });
});

function updateInput(inputId, content) {
  console.log(inputId, content);
  fetch(`api/inputs/${inputId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Request-With": "XMLHttpRequest",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(content),
  });
}

edit_button.addEventListener("click", function (event) {
    event.preventDefault();
  const inputId = data.elementId;

  const EditForm = document.querySelector("#edit-form");
  const user_id = EditForm.dataset.user;

  const food_intake = document.getElementById("edit_food_intake").value;
  const insulin_in_units = document.getElementById(
    "edit_insulin_in_units"
  ).value;
  const carbs_in_grams = document.getElementById("edit_carbs_in_grams").value;

  window.localStorage.setItem(
    "sugafree",
    JSON.stringify({
      editInsulin: insulin_in_units,
      editCarbs: carbs_in_grams,
      editFood: food_intake,
      elementId: inputId,
    })
  );

  const content = {
    user: user_id,
    food_intake: food_intake,
    insulin_in_units: insulin_in_units,
    carbs_in_grams: carbs_in_grams,
  };

  debugger;

  updateInput(inputId, content);
});
