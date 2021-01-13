
const socket = io()

/* ----------------------------- Event Listener: counter -----------------------------  */
    /*
// server -> client: server display increment message on the client-side
socket.on('countUpdated', (count) => {
    console.log('The count has been updated.', count)
})

// client -> server: button is clicked on the client-side
document.querySelector('#increment')
    .addEventListener('click', () => {
        console.log('Clicked')
        socket.emit('increment')
    })
    */
/* ---------------------------- End Event Listener: counter ---------------------------  */

/* ---------------------------- Event Listener: Display msg ---------------------------- */
// server -> client: server display increment message on the client-side
socket.on('message', (data) => {
    console.log(data) // receives welcome message + user chat messages
    const html = Mustache.render(messageTemplate, { // from mustache library
       // username: data.username,
        message: data.text,
        createdAt: moment(data.createdAt).format('h:mm a').toUpperCase() // from moment library
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
/* ---------------------------- End Event Listener: Display msg ---------------------------- */

/* ------------------- Add event listener : Support user messages ------------------- */
/* ================== Elements ================== */
const $messageForm = document.querySelector('#message-form')
const $msgInput = $messageForm.querySelector('input')
const $submitBtn = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
/* ================== End Elements ================== */

//  ================== Templates ==================
const messageTemplate = document.querySelector('#message-template').innerHTML
/* ================== End Templates ================== */

/* ================== Options ================== */
 // const { username: us, room: rm } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // from query string library
const url = location.search
const getQuery = url.split('?')[1]
const params =  getQuery.split('&')// array params = ["param1=value1", "param2=value2"]
const username = params[0].split('=')[1]
const room = params[1].split('=')[1]
/* ================== End Options ================== */

// Add event listener to the form (not the button): one client -> server
$messageForm.addEventListener('submit', (event) => {
        event.preventDefault() // prevent refresh

        let message = event.target.elements.message.value // grabs input.value
        $submitBtn.setAttribute('disabled', 'disabled')
        socket.emit('send', message, (eventAcknowledged) => {
            $msgInput.value = ''
            $msgInput.focus()
            $submitBtn.removeAttribute('disabled')
            console.log("Aknowledged: ", eventAcknowledged) // only the sender will see this
        })
    })

/* ------------------- End event listener : Support user messages ------------------- */

/* ------------------- Event listener : Username and room ------------------- */
 socket.emit('join', {  username, room }, (error) => {
     if (error) {
         alert('username already taken.')
         // redirect to join page
         location.href = '/'
     }

 })

/* ------------------- End event listener : Username and room ------------------- */