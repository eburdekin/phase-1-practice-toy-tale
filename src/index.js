let addToy = false;
//Set toyList as a variable. [] are reminders it's an array
let toyList = [];

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
  .then(toyData => {
    //Store returned data in array that was defined at top
    //No matter what code does, toyList will be a globally avail array
    toyList = toyData;
    renderToys(toyList)
  }
  )

function renderToys(toyList) {
  //Loop through array returned from json. For each object within the array, run addNewToy
  const toyCollection = document.querySelector('#toy-collection')
  toyCollection.innerHTML = ''
  toyList.forEach(toyObj => addNewToy(toyObj))
}

function addNewToy(toyObj) {
  //Use the elements of the toy object to build the card (dot notation)
  const toyCollection = document.querySelector('#toy-collection')
  const toyCard = document.createElement('div')
  toyCard.className = 'card'
  toyCard.innerHTML = `
  <h2>${toyObj.name}</h2>
  <img src="${toyObj.image}" class="toy-avatar"/>
  <p>Likes: ${toyObj.likes}</p>
  `
  //Created like buttons outside of innerHTML so I can add event listeners as I go
  const likeButton = document.createElement('button')
  likeButton.className = 'like-btn'
  likeButton.id = toyObj.id
  likeButton.textContent = 'Like'

  //Add event listeners to Like buttons as they are created. 
  likeButton.addEventListener('click', (e) => handleAddLike(toyObj));
  toyCard.append(likeButton)
  toyCollection.append(toyCard)
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

function handleAddLike(toyObj) {
  console.log('button clicked')
  // First increase likes in function
  const likes = toyObj.likes + 1;
  console.log(likes)
  fetch(`${toyAPI}/${toyObj.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({likes})
  }
  )
    .then(res => res.json())
    //NOTHING IN THE ARGUMENT for the function below
    .then(() => {
      toyObj.likes = likes;
      renderToys(toyList)
    })
}