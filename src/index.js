let addToy = false;

const toyAPI = 'http://localhost:3000/toys'

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//CHALLENGE - Fetch Andy's Toys

fetch(toyAPI)
  .then(res => res.json())
  //Loop through the array of toy objects
  .then(toyData => toyData.forEach(toy => addNewToy(toy)))

function addNewToy(toy) {
  //Use the elements of the toy object to build the card (dot notation)
  const toyCollection = document.querySelector('#toy-collection')
  const newToy = document.createElement('div')
  newToy.className = 'card'
  newToy.innerHTML = `
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar"/>
  <p>Likes: ${toy.likes}</p>
  `
  //Created like buttons outside of innerHTML so I can add event listeners as I go
  const likeButton = document.createElement('button')
  likeButton.className = 'like-btn'
  likeButton.id = toy.id
  likeButton.textContent = 'Like'
  //Create increaselikes function in-line so I have access to the toy.likes and toy.id on the DOM. Build callback function within for PATCH request
  likeButton.addEventListener('click', function increaseLikes(e){
    console.log(e.target)
    // First increase likes in function
    toy.likes += 1
    //Then increase likes on DOM
    newToy.querySelector('p').textContent = `Likes: ${toy.likes}`
    //Then increase likes on server
    increaseLikesServer(toy)
  })
  newToy.append(likeButton)
  toyCollection.append(newToy)
}

//CHALLENGE - Add Toy Info to Card / Add New Toy to Server

//Add event listeners to form submission
const toyForm = document.querySelector('.add-toy-form')
toyForm.addEventListener('submit', handleSubmit)

//Form event handler
function handleSubmit(e) {
  //Prevent default
  e.preventDefault()
  //Create toyObj using form inputs
  let toyObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  //Send cat object to addNewToy - ADD TO DOM
  addNewToy(toyObj)
  //Call function for POST request - ADD TO JSON SERVER
  postNewToy(toyObj)
}

//Create POST function to add new objects to json server
function postNewToy(toyObj) {
  fetch(toyAPI, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    body: JSON.stringify(toyObj)
  })
  .then(res => res.json)
  .then(data => console.log(data))
}

//CHALLENGE - Update Likes on DOM via buttons / update Likes on server via PATCH

//Added to function above 

function increaseLikesServer(toyObj){
  console.log('I will update the server')
  fetch(`${toyAPI}/${toyObj.id}`,{
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toyObj)
  }
  )
  .then(res => res.json())
  //Console log updated object
  .then(data => console.log(data))
}

