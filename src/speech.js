const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const path = require('path');
const { fetchOpenAI } = require('./openai');
const { ipcMain } = require('electron');
require('dotenv').config();

// Configure speech SDK with subscription key and region
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechRecognitionLanguage = "en-US";

/**
 * Converts an MP3 file to WAV format.
 *
 * @param {string} mp3FilePath - The path to the MP3 file.
 * @param {string} wavFilePath - The path to save the converted WAV file.
 * @param {function} callback - The callback to execute after conversion.
 */
function convertMp3ToWav(mp3FilePath, wavFilePath, callback) {
    ffmpeg(mp3FilePath)
        .toFormat('wav')
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
            console.log('Conversion finished!');
            callback();
        })
        .save(wavFilePath);
}

/**
 * Handles the speech recognition process from an audio file.
 */
async function fromFile() {
    const mp3FilePath = path.join(__dirname, '../audio/YourAudioFile.mp3');
    const wavFilePath = path.join(__dirname, '../audio/YourAudioFile.wav');

    convertMp3ToWav(mp3FilePath, wavFilePath, () => {
        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(wavFilePath));
        let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        speechRecognizer.recognizeOnceAsync(async (result) => {
            if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                console.log(`RECOGNIZED: Text=${result.text}`);
                ipcMain.emit('stt-response', null, `Voz: ${result.text}`);
                try {
                    const openAIResponse = await fetchOpenAI(result.text);
                    console.log(`OpenAI Response: ${openAIResponse}`);
                    ipcMain.emit('stt-response', null, `Bot: ${openAIResponse}`);
                } catch (error) {
                    console.error('Error calling the OpenAI API', error);
                }
            } else if (result.reason === sdk.ResultReason.NoMatch) {
                console.log("NOMATCH: Speech could not be recognized.");
            } else if (result.reason === sdk.ResultReason.Canceled) {
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason === sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
            }
            speechRecognizer.close();
        });
    });
}

module.exports = { fromFile };
