// Add event listener to the send button
document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
      document.getElementById('chat-box').innerHTML += `<p>User: ${userInput}</p>`;
      window.myAPI.sendMessage(userInput);
    }
});

// Handle responses from the OpenAI API
window.myAPI.onResponse((response) => {
    document.getElementById('chat-box').innerHTML += `<p>Bot: ${response}</p>`;
});

// Add event listener to the STT button
document.getElementById('stt-button').addEventListener('click', () => {
    window.myAPI.startSTT();
});

// Handle responses from the STT process
window.myAPI.onSTTResponse((response) => {
    document.getElementById('chat-box').innerHTML += `<p>${response}</p>`;
});
