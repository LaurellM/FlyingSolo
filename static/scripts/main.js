console.log('js loaded')

// from Django Docs 
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const add_button = document.querySelector('button[type="submit"]');
const add_new_entry_button = document.getElementById("add-new-entry-button");
add_new_entry_button.style.display = 'none';
let edit_button = document.getElementById("edit-button");
edit_button.style.display = 'none'

const entry_content = document.getElementById("action-entry");

const InputForm = document.querySelector('#input-form');
const user_id = InputForm.dataset.user;
const inputURL = 'api/inputs/';

InputForm.addEventListener('submit', function (event){
    event.preventDefault()

    let formData = new FormData(InputForm);
    formData.append('user', user_id);

fetch(inputURL, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
     Accept: 'application/json',
            'X-Request-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        },
        body: formData
    })
    .then((response) => {
        return response.json();
    })
    .then(data => {
        //save data related to entry to be able to edit
        InputForm.dataset.inputId = data.id;
        add_button.style.display = "none";
        add_new_entry_button.style.display = "inline";
        edit_button.style.display = "inline";
        entry_content.innerHTML = "Edit Entry";
    });
});

function updateInput(inputId, content) {
    fetch(`api/inputs/${inputId}/`, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json', 
         Accept: 'application/json',
      'X-Request-With': 'XMLHttpRequest',
      'X-CSRFToken': csrftoken, 
      },
      body: JSON.stringify(content),
      }); 
    }

    edit_button.addEventListener("click", function() {
        const inputId = InputForm.dataset.inputId;
        const food_intake = document.getElementById('id_food_intake')
        const insulin_in_units = document.getElementById('id_insulin_in_units')
        const carbs_in_grams = document.getElementById('id_carbs_in_grams')

        const content = {
            user: user_id,
            food_intake: food_intake.value,
            insulin_in_units: insulin_in_units.value,
            carbs_in_grams: carbs_in_grams.value,
        }

        if (inputId) {
            updateInput(inputId, content);
        } else {
            window.location.reload(true);
        }
    });

    add_new_entry_button.addEventListener("click", function() {
        window.location.reload(true);
    });
      



