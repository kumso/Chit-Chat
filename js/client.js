const socket = io('http://localhost:8000');

// Getting DOM Element in resp. variable
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play while receiving messages
let audio = new Audio('message.mp3')

// function which will append event info to the container
const append = (message, position) => {
   const messageElement = document.createElement('div');
   messageElement.innerText = message;
   messageElement.classList.add('message');
   messageElement.classList.add(position);
   messageContainer.append(messageElement);
   if(position === 'left') {
      audio.play()
   }
}

// ask new user for his/her name and let the server know
let name = prompt("Enter your name...")
console.log(name)
socket.emit("new-user-joined", name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
   append(`${name} joined the chat`, 'right');
})

// If server sends a message, receive it
socket.on('receive', data => {
   append(`${data.name}: ${data.message}`, 'left');
})

// If user left the chat, append the info to the container
socket.on('left', name => {
   append(`${name} left the chat`, 'right');
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
   // Page does not reload
   e.preventDefault();
   const message = messageInput.value;
   append(`You: ${message}`, 'right');
   socket.emit('send', message);
   messageInput.value = '';
})