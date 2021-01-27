let createField = document.getElementById("create-field") //html icindeki create field idli yapacaklar list. e yeni oge ekledigimiz yere yazilani createField variableina atadik 

//Create feature
//html icindeki create-form id tanimli yere ulasilip addEventListenerla submit basildiginda fonksiyon harekete geciyor
document.getElementById("create-form").addEventListener("submit", function(e){
  e.preventDefault()

  axios.post('/create-item', {text: createField.value}).then(function () { // create-item urline async post gonderioyoruz . app.post create-item isimli server.jsdeki yerle iletisim saglayip donen value yi createField yaptik
    //create a html for a new item
  }).catch(function() {
    console.log("Please try again later.")
  })
})

document.addEventListener("click", function(e) {

  
  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function () {
        e.target.parentElement.parentElement.remove()
      }).catch(function() {
        console.log("Please try again later.")
      })
    }
  }


  //#region update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if (userInput) {
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
      }).catch(function() {
        console.log("Please try again later.")
      })
      //#endregion
    }
  }
})
