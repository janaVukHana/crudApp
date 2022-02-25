// UI variables
const inputWebsite = document.querySelector('#website')
const inputPassword = document.querySelector('#password')

const passwordsContainer = document.querySelector('tbody')

const btnClear = document.querySelector('.btn-clear')

const btnAdd = document.querySelector('.btn-add')
const btnDelete = document.querySelector('.btn-delete')
const btnUpdate = document.querySelector('.btn-update')
const btnCancel = document.querySelector('.btn-cancel')

// on document load, load data from ls and put in items variable
let items

document.addEventListener('DOMContentLoaded', () => {
  items = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : []

  addItemsToUI()
})

// event listenters

// add button
btnAdd.addEventListener('click', (e) => {
  if (inputWebsite.value !== '' && inputPassword.value !== '') {
    const item = {
      website: inputWebsite.value,
      password: inputPassword.value,
    }

    items.push(item)

    localStorage.setItem('items', JSON.stringify(items))

    addItemsToUI()

    showMessage('Item added', 'add-item')

    resetInputButtons()
  } else if (inputWebsite.value === '') {
    showMessage('Enter website', 'delete-item')
    inputWebsite.focus()
  } else if (inputPassword.value === '') {
    showMessage('Enter password', 'delete-item')
    inputPassword.focus()
  }

  e.preventDefault()
})

// edit

// initialize index of item you want to delete or update
let index

passwordsContainer.addEventListener('click', (e) => {
  if (e.target.className === 'edit') {
    showEditButtons()

    const website =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent
    const password = e.target.parentElement.previousElementSibling.textContent

    inputWebsite.value = website
    inputPassword.value = password

    // find index of item you want to delete or update
    index = items.findIndex((item) => {
      return item.website === website && item.password === password
    })
  }
})

// delete button
btnDelete.addEventListener('click', (e) => {
  // delete item from list
  items.splice(index, 1)

  localStorage.setItem('items', JSON.stringify(items))

  addItemsToUI()

  showMessage('Item deleted', 'delete-item')

  hideEditButtons()

  resetInputButtons()

  e.preventDefault()
})

// update button
btnUpdate.addEventListener('click', (e) => {
  const item = {
    website: inputWebsite.value,
    password: inputPassword.value,
  }

  items.splice(index, 1, item)

  localStorage.setItem('items', JSON.stringify(items))

  addItemsToUI()

  showMessage('Item updated', 'update-item')

  hideEditButtons()

  resetInputButtons()

  e.preventDefault()
})

// cancel button
btnCancel.addEventListener('click', (e) => {
  hideEditButtons()

  resetInputButtons()

  e.preventDefault()
})

// clear button
btnClear.addEventListener('click', () => {
  showAlert()
})

// functions which you later maybe can put into modules if you want
function showEditButtons() {
  btnAdd.style.display = 'none'
  btnDelete.style.display = 'inline-block'
  btnUpdate.style.display = 'inline-block'
}

function hideEditButtons() {
  btnAdd.style.display = 'inline-block'
  btnDelete.style.display = 'none'
  btnUpdate.style.display = 'none'
}

function resetInputButtons() {
  inputWebsite.value = ''
  inputPassword.value = ''
  inputWebsite.focus()
}

function addItemsToUI() {
  passwordsContainer.innerHTML = ''

  items.forEach((item) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
          <td>${item.website}</td>
          <td>${item.password}</td>
          <td><a href="#" class="edit">Edit</a></td>
        `
    passwordsContainer.appendChild(tr)
  })
}

function showMessage(message, className) {
  const p = document.createElement('p')
  p.textContent = message
  p.classList.add('item')
  p.classList.add(className)
  document.querySelector('.main-content .inner-container').prepend(p)

  setTimeout(() => {
    p.remove()
  }, 1700)
}

// show alert and ask confirmation if user try to delete all data
let btnYes
let btnNo

function showAlert() {
  const div = document.createElement('div')
  div.className = 'alert-message'
  div.innerHTML = `
        <div class="alert-container">
            <p>You want to delete everything?</p>
            <button class="btn-yes">Yes</button>
            <button class="btn-no">No</button>
        </div>
    `
  document.querySelector('.main-content .inner-container').prepend(div)

  btnYes = document.querySelector('.btn-yes')
  btnNo = document.querySelector('.btn-no')

  // if user press yes
  btnYes.addEventListener('click', () => {
    div.remove()
    items = []
    localStorage.clear()
    passwordsContainer.innerHTML = ''

    hideEditButtons()

    resetInputButtons()
  })

  // if user press no
  btnNo.addEventListener('click', () => {
    hideEditButtons()
    div.remove()
    resetInputButtons()
  })
}
