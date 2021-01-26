//Create Feature
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault
    axios.post('/create-item', {text: createField.value}).then(function () {
        // create the html for a new item
        alert("you just created new item")
      }).catch(function() {
        console.log("Please try again later.")
      })
})

document.addEventListener("click", function(e) {
    //delete feature
    if (e.target.classList.contains("delete-me")){
        if(confirm("Do you really want to delete this item permanently?")){
            axios.post('/delete-item', { id: e.target.getAttribute("data-id")}).then(function () {
                e.target.parentElement.parentElement.remove()
                console.log("Please try again later.")
              })
        }
    }

    //update feature
    if (e.target.classList.contains("edit-me")) {
      let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
      if (userInput) {
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        }).catch(function() {
          console.log("Please try again later.")
        })
      }
    }
  })