// Создадим массив для хранения задач (массив будет содержать текст каждого инпута)
let tasks = []

// Флаг, который указывает - нажимали ли мы на кнопку сортировки 
let isSorted = false


// Получим наш ToDo   
let toDO = document.querySelector(".toDo-list-wrapper")





// Получим список ul,  в который будем добавлять li-шки 
let ul = toDO.querySelector(".list")

ul.addEventListener(`dragstart`, (evt) => {
  evt.target.classList.add(`selected`);

  evt.target.querySelector(".list-item").classList.add(`yellow`);
})

ul.addEventListener(`dragend`, (evt) => {
  evt.target.classList.remove(`selected`);

  evt.target.querySelector(".list-item").classList.remove(`yellow`);


});


ul.addEventListener(`dragover`, (evt) => {
  evt.preventDefault();

  const activeElement = ul.querySelector(`.selected`);
  const currentElement = evt.target.closest(".tasks__item");
  const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains(`tasks__item`);

  if (!isMoveable) {
    return;
  }

  // evt.clientY — вертикальная координата курсора в момент,
  // когда сработало событие
  const nextElement = getNextElement(evt.clientY, currentElement);

  // Проверяем, нужно ли менять элементы местами
  if (
    nextElement && 
    activeElement === nextElement.previousElementSibling ||
    activeElement === nextElement
  ) {
    // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
    return;
  }

  ul.insertBefore(activeElement, nextElement);
});



const getNextElement = (cursorPosition, currentElement) => {
  // Получаем объект с размерами и координатами
  const currentElementCoord = currentElement.getBoundingClientRect();
  // Находим вертикальную координату центра текущего элемента
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

  // Если курсор выше центра элемента, возвращаем текущий элемент
  // В ином случае — следующий DOM-элемент
  const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;

  return nextElement;
};






// Получим синюю кнопку "Добавить"
let addButton = toDO.querySelector(".add-new-list")

// Повесим обработчик по клику на кнопку "Добавить"
addButton.addEventListener("click", () => {

  // Создаю НОВУЮ li-шку и физически вставляю её на страницу , в список ul



  // let newLi = `<li class="tasks__item" draggable= true>
  //               <input class="list-item" type="text">
  //               <button class="delete-button"></button>
  //             </li>`

  // Создаём тег li 
  let newLi = document.createElement("li")

  newLi.className = "tasks__item"

  newLi.draggable = true



  let input = document.createElement("input")

  input.className = "list-item"

  input.type = "text"

  newLi.append(input)




  let button = document.createElement("button")

  button.className = "delete-button"

  newLi.append(button)


  // // Вставляю созданную li-шку в список:
  // ul.insertAdjacentHTML("beforeend", newLi)

  ul.append(newLi)


  // Теперь ищу её (как последний элемент списка ul) и ставлю в ней фокус 
  ul.querySelector("li:last-of-type input").focus()

})







// Реализуем возможность ДОБАВЛЕНИЯ, путём нажатия кнопки Enter 
document.addEventListener("keyup", (event) => {

  if(event.key == "Enter") {
    // Создаю НОВУЮ li-шку и физически вставляю её на страницу , в список ul
    let newLi = document.createElement("li")

    newLi.className = "tasks__item"
  
    newLi.draggable = true
  
  
  
    let input = document.createElement("input")
  
    input.className = "list-item"
  
    input.type = "text"
  
    newLi.append(input)
  
  
  
  
    let button = document.createElement("button")
  
    button.className = "delete-button"
  
    newLi.append(button)
  
  
    // // Вставляю созданную li-шку в список:
    // ul.insertAdjacentHTML("beforeend", newLi)
  
    ul.append(newLi)


    // Теперь ищу её (как последний элемент списка ul) и ставлю в ней фокус 
    ul.querySelector("li:last-of-type input").focus()

  }

})








// Теперь сделаем возможность УДАЛИТЬ  задачу / li-шку. Для этого на ВЕСЬ список ul повешу событие по клику
ul.addEventListener("click", (event) => {

  if(event.target.closest(".delete-button")) {

    // Здесь будет проверка - если количество li-шек больше одной, тогда мы можем удалить эту li-шку.
    // Это необходимо для того, чтобы на странице была хотя бы одна li-шка

    if(ul.querySelectorAll("li").length > 1) {

      event.target.closest("li").remove()

    // Если li-шка одна, то у неё удалится текстовое содержимое
    } else {
      event.target.closest("li").querySelector("input").value = ""
    }

  }

})













// Сделаем возможность СОРТИРОВКИ
// Найдём кнопку сортировки
let sortBurron = toDO.querySelector(".sort-button")

// Повесим на неё обработчик 
sortBurron.addEventListener("click", () => {

  // Получим стрелку 
  let arrow = sortBurron.querySelector(".arrow-svg-icon") 


  // Получим ВСЕ li-шки, переберём их и текст каждой запушим в массив tasks
  let allLi = ul.querySelectorAll("li")

  allLi.forEach( elem => {

    tasks.push(elem.firstElementChild.value)

  })




  // Теперь обнулим содержимое списка ul, то есть сделаем список пустым.
  // В него мы положим li-шки, которые будут идти в порядке сортировки 
  ul.innerHTML = ""



  // На этом этапе я отсеиваю li-шки, которые были пустыми (незаполненные инпуты)
  tasks = tasks.filter( elem => {
    return elem != ""
  } )

  // В случае, если массив значений оказался пустым
  if(tasks.length === 0) {
    tasks = [""]
  }



  // Будем сортировать только если в массиве БОЛЬШЕ одного элемента 
  // Имеет смысл сортировать , когда ЕСТЬ ЧТО сортировать 
  if(tasks.length > 1) {
    if(isSorted) {
      // Отсортируем массив tasks
      // tasks.sort( (a, b) => {
      //   return a - b
      // } )
  
      tasks.reverse()
      console.log(tasks)



      arrow.classList.remove("rotate")
  
      isSorted = false
  
    }
  
    // Если ВПЕРВЫЕ нажали на сортировку 
    else {
      // tasks.sort( (a, b) => {
      //   return b - a
      // } ) 

      tasks.sort()
      console.log(tasks)

  
      arrow.classList.add("rotate")
  
  
      isSorted = true
  
    }
  
  }


    // И теперь, на основе отсортированного массива мы создадим разметку (li-шки), которые вставим 
    let liHTML = tasks.forEach( elem => {
  
      // Создаю НОВУЮ li-шку и физически вставляю её на страницу , в список ul
      let newLi = document.createElement("li")

      newLi.className = "tasks__item"
    
      newLi.draggable = true
    
    
    
      let input = document.createElement("input")
    
      input.className = "list-item"
    
      input.type = "text"

      input.value = elem
    
      newLi.append(input)
    
    
    
    
      let button = document.createElement("button")
    
      button.className = "delete-button"
    
      newLi.append(button)
    

    
      ul.append(newLi)
  

  
    } )
  
    























  
    tasks = []



})

