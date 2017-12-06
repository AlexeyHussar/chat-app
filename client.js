(() => {
  let getElement = (id) => {
    return document.getElementById(id);
  };

  let messages = getElement('messages');
  let chatForm = getElement('chatForm');
  let nameInput = getElement('nameInput');
  let messageInput = getElement('messageInput');
  let clearButton = getElement('clear');

  let socket = io.connect('http://127.0.0.1:3001');

  if (socket !== undefined) {
    console.log('Connected to socket');

    socket.on('output', data => {
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          let message = document.createElement('div');
          message.setAttribute('class', 'chatMessage');
          message.textContent = data[i].name + ': ' + data[i].message;
          messages.appendChild(message);
        }
      }
    });

    chatForm.addEventListener('submit', (event) => {
      socket.emit('input', {
        name: nameInput.value,
        message: messageInput.value
      });
      event.preventDefault();
    });

    clearButton.addEventListener('click', () => {
      socket.emit('clear');
    });

    socket.on('cleared', () => {
      messages.textContent = '';
    });
  } else {
    console.log('Error');
  }
})();