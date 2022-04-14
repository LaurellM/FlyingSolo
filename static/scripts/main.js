console.log('js loaded')
// show that the js is connected

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

let InputForm = document.querySelector('#input-form')
console.log(InputForm)
let user_id = InputForm.dataset.user
const inputURL = 'api/inputs/'

fetch(inputURL, {
    method: 'GET',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest',
        'X-CSRFToken': csrftoken,
    },
    // body: formData
})
.then(response => {
    return response.json()
})
.then(data => {
    console.log("inputs", data)
    buildResults(data)
})

InputForm.addEventListener('submit', function (event){
    event.preventDefault()
    console.log(event.target)

    formData = new FormData(InputForm)
    formData.append('user', user_id)
    fetch(inputURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'Accept': 'application/json',
            'X-Request-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        },
        body: formData
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
})

let inputs = []

let resultsDiv = document.querySelector('#results')
console.log(resultsDiv)

function buildResults (resultsArray){
    console.log(resultsArray)
    for (let input of resultsArray){
      let newDiv = document.createElement('div')
      let food = document.createElement('p')
      food.innerText= `this is food intake ${input.food_intake}`
      newDiv.appendChild(food)
      newDiv.innerText = `INSULIN: ${input.insulin_in_units} CARBS: ${input.carbs_in_grams} FOOD: ${input.food_intake}`
    console.log(input.insulin_in_units, input.carbs_in_grams, input.food_intake)
      resultsDiv.appendChild(newDiv)
    }
  
  }