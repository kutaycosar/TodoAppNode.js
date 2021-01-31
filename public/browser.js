function itemTemplate(item){  // item==response.data yani res.json(info.ops[0])
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
  <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
  <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
  </li>`
}
//Initial page load render
let ourHTML = items.slice(0).reverse().map(function(item){ //listeyi datadan alip html e ceviriyor. her bi item icin itemTemplate i kullanarak
  return itemTemplate(item)
}).join('')  // join arrary i string e ceviriyor. empty quote '' koyunca virgul le ayrilmayacaklar
document.getElementById("item-list").insertAdjacentHTML("afterbegin", ourHTML)

//Create feature

let createField = document.getElementById("create-field") //html icindeki create field idli yapacaklar list. e yeni oge ekledigimiz yere yazilani createField variableina atadik 


//html icindeki create-form id tanimli yere ulasilip addEventListenerla submit basildiginda fonksiyon harekete geciyor
document.getElementById("create-form").addEventListener("submit", function(e){ 
  e.preventDefault() //submit eventinin default fonksiyonunu onluyor
// create-item urline async post gonderioyoruz . app.post create-item isimli server.jsdeki yerle iletisim saglayip donen value yi createField yaptik
//function (response) yazarak server.js app.post create item in response ini(res.json(info.ops[0])) aliyoruz.
  axios.post('/create-item', {text: createField.value}).then(function (response) {  
    // todolist e eklendiginde html de eklenenin gorunmesini saglar. response.data ile res.json(info.ops[0]) nin datasini itemTemplate e atiyoruz
    document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data)) //server create-item responseindan sonra caliscak
    createField.value = "" //gorev eklendikten sonra giris alanini bos birakiyor 
    createField.focus()
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
