const OPENAI_KEY = "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";
const speech = new SpeechSynthesisUtterance();
// Store voices
let voices = [];
// Wait on voices to be loaded before fetching list
window.speechSynthesis.onvoiceschanged = () => { 
    voices = window.speechSynthesis.getVoices(); 
  };

// Speech to Text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true; // If true, the silence period is longer
recognition.interimResults = true;
// Your OpenAI API key
const apiKey = OPENAI_KEY;

// Define a function to send a message to ChatGPT and receive a response
async function sendMessage(message) {
  const customHeaders = new Headers();
  customHeaders.append("Content-Type", "application/json");
  customHeaders.append("Authorization",`Bearer ${apiKey}`)
  let requestOptions = {
    method: 'POST',
    headers: customHeaders,
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are the interviewer.' }, { role: 'user', content: message }],
      }),
    redirect: 'follow'
  };
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(apiUrl,requestOptions);
  const data = await response.json();
  return data.choices[0].message.content;
}

// Set the text and voice attributes.
function readOutLoud(message) {
    console.log("readOutLoud called! ",message)
    //const speech = new SpeechSynthesisUtterance();
    
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1.8;
    speech.voice = voices[3];
  
    window.speechSynthesis.speak(speech);
  }
// Main interview loop
async function conductInterview() {
    console.log('Interview Started!')
    if (typeof SpeechRecognition === "undefined") {
    startBtn.remove();
    result.innerHTML = "<strong>Your browser does not support Speech API. Please download latest Chrome version.<strong>";
    }else {
        readOutLoud('Welcome to the interview. Please answer the following questions:')
        console.log('Welcome to the interview. Please answer the following questions:');
        recognition.onresult = async event => {
            const current = event.resultIndex;
            const recognitionResult = event.results[current];
            console.log("recognitionResult ",recognitionResult)
            const recognitionText = recognitionResult[0].transcript;
            // Welcome message
            console.log(`Interviewee: ${recognitionText}`);
            const botResponse = await sendMessage(recognitionText);
            readOutLoud(`${botResponse}`);
            console.log(`Interviewer: ${botResponse}`);
        }
    }

//   while (userResponse.toLowerCase() !== 'exit') {
//     userResponse = 'ok';
//     console.log(`Interviewee: ${userResponse}`);

//     if (userResponse.toLowerCase() === 'exit') {
//       console.log('Interview ended.');
//       break;
//     }

//     const botResponse = await sendMessage(userResponse);
//     readOutLoud(`${botResponse}`);
//     console.log(`Interviewer: ${botResponse}`);
//   }
}

// Function to ask a question to the user
// function askQuestion() {
//   return new Promise((resolve) => {
//     const readline = require('readline');
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     rl.question('You: ', (answer) => {
//       rl.close();
//       resolve(answer);
//     });
//   });
// }

// Start the interview
// conductInterview();

// sendMessage("Tell me about yourself")
