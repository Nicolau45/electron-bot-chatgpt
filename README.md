# Electron ChatBot with Azure OpenAI and Speech Services
This project develops a chat application, similar to ChatGPT, that uses Azure OpenAI and Electron. Additionally, it has the functionality to transform audio files into text using Azure Speech Services. I created this project to better understand Azure tools, specifically Azure OpenAI and Azure Speech Services, and to familiarize myself with Electron.

The chatbot has a fun prompt where it imagines itself as a pirate who believes it is a real human being. The prompt is: "You are a helpful assistant, that is a pirate, and likes to think that he is a real person."

## Project Structure
+ main.js: The main process file that initializes the Electron application, creates the main window, and handles inter-process communication (IPC) events.
+ openai.js: Contains the logic for interacting with the OpenAI API to fetch responses based on user input.
+ speech.js: Manages the speech-to-text functionality using Azure's Speech SDK, converting audio files to text and sending the recognized text to the OpenAI API.
+ preload.js: Sets up a secure bridge between the main process and the renderer process using Electron's contextBridge and ipcRenderer.
+ renderer.js: The renderer process file that handles the user interface interactions, including sending and receiving messages.
+ index.html: The HTML file that defines the structure of the user interface.
+ audio/: A directory where audio files are stored for the STT process.

## File Relationships and Functionality
1. main.js

   - Purpose: Initializes the Electron app, creates the main browser window, and manages IPC events.
   - Key Functions:
     - createWindow(): Sets up the main window of the application.
     - ipcMain.on('request-response', ...): Listens for text input from the renderer and requests a response from the OpenAI API.
     - ipcMain.on('start-stt', ...): Initiates the STT process when triggered by the renderer.
     - ipcMain.on('stt-response', ...): Sends the STT results back to the renderer process.
   - Relationships:
     - Uses fromFile from speech.js to handle STT.
     - Uses fetchOpenAI from openai.js to handle OpenAI API interactions.
     
2. openai.js

   - Purpose: Handles communication with the OpenAI API to fetch chatbot responses.
   - Key Functions:
     - fetchOpenAI(userInput): Sends a user message to the OpenAI API and returns the response.
   - Relationships:
     - Called by main.js and speech.js to fetch responses from OpenAI based on user input or recognized speech text.
       
3. speech.js

   - Purpose: Manages the conversion of audio files to text using Azure's Speech SDK.
   - Key Functions:
     - convertMp3ToWav(mp3FilePath, wavFilePath, callback): Converts MP3 files to WAV format.
     - fromFile(): Handles the STT process, sending the recognized text to OpenAI and then sending the responses back to the renderer.
   - Relationships:
     - Calls fetchOpenAI from openai.js to get responses based on recognized speech text.
     - Uses ipcMain.emit to communicate STT results back to the main process, which forwards them to the renderer.

3. preload.js

   - Purpose: Creates a secure context bridge for IPC between the main process and renderer process.
   - Key Functions:
     - contextBridge.exposeInMainWorld('myAPI', ...): Exposes specific IPC functions to the renderer process.
   - Relationships:
     - Provides the renderer process with methods to send and receive messages to/from the main process.

4. renderer.js

   - Purpose: Manages user interactions within the renderer process (UI).
   - Key Functions:
     - Listens for button clicks to send user input to the main process.
     - Updates the chatbox with messages from the user and the bot.
     - Listens for STT events to display recognized speech text and bot responses.
   - Relationships:
     - Uses the myAPI methods exposed by preload.js to communicate with the main process.

5. index.html

   - Purpose: Defines the user interface structure.
   - Key Elements:
     - Input field for user text input.
     - Buttons for sending text input and starting STT.
     - Chatbox for displaying conversation history.
   - Relationships:
     - The UI elements interact with renderer.js to handle user actions and display chat messages.

## Explanation of How the Project Works
1. Initialization:

   - The Electron app is initialized in main.js, creating a main browser window and loading index.html.

2. User Interaction:

   - The user can type a message in the input field and click the "Enviar" button to send the message.
   - Alternatively, the user can click the "STT" button to start the speech-to-text process.

3. Handling Text Input:

   - When the user clicks "Enviar", renderer.js captures the input and sends it to the main process via IPC (request-response event).
   - The main process handles the event, calling fetchOpenAI to get a response from the OpenAI API, and then sends the response back to the renderer.

4. Handling Speech Input:

   - When the user clicks "STT", renderer.js triggers the startSTT event via IPC.
   - The main process calls fromFile in speech.js, which handles the STT process.
   - speech.js converts the audio file to text, sends the recognized text to OpenAI, and then sends both the recognized text and the bot's response back to the renderer.

5. Updating the UI:

   - The renderer process listens for responses from both text and speech inputs.
   - It updates the chatbox with the user's input and the bot's response, displaying the conversation history.

## Conclusion
This Electron-based chatbot project leverages OpenAI's GPT for intelligent responses and Azure's Speech Service for speech-to-text functionality. The project is organized with clear separation of concerns, ensuring that each file handles a specific part of the functionality, and uses IPC to facilitate communication between the main process and renderer process.

## Image
![image](https://github.com/user-attachments/assets/2f91cab8-f79c-4953-ae11-bb267b28fa5e)
