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

const inputURL = "api/inputs/";

// Just to verify that there is an user 
const userElement = document.getElementById("user_id");
let user_id = null;
if (userElement) {
  user_id = JSON.parse(userElement.innerText);
}

// To avoid errors during logout - wrap the whole code in a if based on
// user presence
if (user_id) {
  let add_button = document.getElementById("add-info");
  let update_button = document.getElementById("update-info");
  let resultsDiv = document.querySelector("#results");
  let action_entry = document.getElementById("action-entry");

  if (update_button) {
    update_button.disabled = true;
  }

  let editInput = null;

  let InputForm = document.querySelector("#input-form");
  let user_id = null;
  if (InputForm) {
    user_id = InputForm.dataset.user;
  }

  function fetchAndBuildResults() {
    fetch(inputURL, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "X-Request-With": "XMLHttpRequest",
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        buildResults(data);
      });
  }

  fetchAndBuildResults();

  // InputForm is listening to submit event coming from the add button
  if (InputForm) {
    InputForm.addEventListener("submit", function (event) {
      event.preventDefault();

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
        .then(() => {
          fetchAndBuildResults();
        });
    });
  }

  function buildResults(resultsArray) {
    for (let item of resultsArray) {
      const existentDiv = document.getElementById(item.id);
      if (existentDiv) {
        existentDiv.remove();
      }
    }

    for (let input of resultsArray) {
      let newDiv = document.createElement("div");
      newDiv.setAttribute("id", input.id);
      newDiv.classList.add('item')
      newDiv.innerText = `INSULIN: ${input.insulin_in_units} CARBS: ${input.carbs_in_grams} FOOD: ${input.food_intake}`;
      let anchor_edit = document.createElement("a");
      let link = document.createTextNode(" Edit");
      anchor_edit.appendChild(link);
      anchor_edit.setAttribute("id", input.id);
      anchor_edit.classList.add("f6", "link", "dim", "br-pill", "pl30", "ph2", "pv1", "mb2", "dib", "black", "bg-dark-pink")

      anchor_edit.addEventListener("click", function () {
        const info = document.getElementById(anchor_edit.id);
        const formInsulin = document.getElementById("id_insulin_in_units");
        formInsulin.value = info.dataset.insulin;
        const formCarbs = document.getElementById("id_carbs_in_grams");
        formCarbs.value = info.dataset.carbs;
        const formFood = document.getElementById("id_food_intake");
        formFood.value = info.dataset.food;
        InputForm.setAttribute("entry", input.id);
        update_button.disabled = false;
        add_button.disabled = true;
        // pass the id of the input that will edit to the
        // editInput variable to be used later on when editing the form
        editInput = input.id;
        action_entry.innerHTML = "Edit Entry";
      });
      newDiv.appendChild(anchor_edit);
      newDiv.setAttribute("data-insulin", input.insulin_in_units);
      newDiv.setAttribute("data-carbs", input.carbs_in_grams);
      newDiv.setAttribute("data-food", input.food_intake);
      resultsDiv.appendChild(newDiv);
    }
  }

  function updateInput(inputId, content) {
    fetch(`api/inputs/${inputId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Request-With": "XMLHttpRequest",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(content),
    }).then(() => {
      fetchAndBuildResults();
    });
  }

  if (update_button) {
    update_button.addEventListener("click", function () {
      const food_intake = document.getElementById("id_food_intake");
      const insulin_in_units = document.getElementById("id_insulin_in_units");
      const carbs_in_grams = document.getElementById("id_carbs_in_grams");

      const content = {
        user: user_id,
        food_intake: food_intake.value,
        insulin_in_units: insulin_in_units.value,
        carbs_in_grams: carbs_in_grams.value,
      };

      updateInput(editInput, content);

      // Reset form after edit
      food_intake.value = null;
      insulin_in_units.value = null;
      carbs_in_grams.value = null;

      add_button.disabled = false;
      update_button.disabled = true;

      action_entry.innerHTML = "Add a New Entry";
    });
  }
}
