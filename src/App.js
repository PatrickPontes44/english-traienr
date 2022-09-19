import React, { useState } from 'react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaVolumeUp, FaMicrophone, FaMicrophoneSlash, FaStopCircle } from 'react-icons/fa';
import { MdTranslate } from 'react-icons/md';
import Card from 'react-bootstrap/Card';

function App() {
  const [value, setValue] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setInputValue(result);
    },
  });

  const onEnd = () => {
    handleStopSpeaking();
  }

  const { speak, voices, cancel, speaking } = useSpeechSynthesis({onEnd});

  const handleSpeak = () => {
    if(value.length > 0){
      speak({ text: value , voice: voices[selectedVoice] });
    }
  }
  const handleStopSpeaking = () =>{
    cancel();
  }

  const handleStartListening = ()=>{
    if(value.length > 0){
      listen({ lang: 'en-US' });
    }
  }

  const handleCleanTheValues = ()=>{
    const auxTypedValue = value.toLocaleLowerCase();
    const auxSpokenValue = inputValue.toLocaleLowerCase();
    const regexdTypedValue = auxTypedValue.replace(/[^\w\s]/gi, '');
    const regexdSpokenValue = auxSpokenValue.replace(/[^\w\s]/gi, '');

    return regexdTypedValue === regexdSpokenValue;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>English Pronunciation Trainer</h2>
      </header>
      <section className="App-content p-4">
        <Card className='card'
        bg="dark"
        key="dark"
        text="white"
        >
          <Card.Body>
            <Card.Title className="card-title">
              <span>
                <MdTranslate />
              </span>
            </Card.Title>
            <div className='selectors-container'>
              <select className="voice-select" onChange={(evt)=> setSelectedVoice(evt.target.value)}>
                {
                  voices.map((v, index)=>{
                    return(
                      <option key={v.name} value={index}>{v.name}</option>
                    );
                  })
                }
              </select>
            </div>
            <div className='textarea-container'>
              <textarea 
              rows="5" 
              placeholder='Digite um texto para ser lido'
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setInputValue('');
              }} />
            </div>

            <div className='result-text-container'>
              <span className={`${ handleCleanTheValues() ? 'correct':'incorrect'}`}>{inputValue}</span>
            </div>

            <div className='buttons-container'>
              {
                !speaking ?
                <Button variant="success" className='button' onClick={handleSpeak}><FaVolumeUp /></Button>
                :
                <Button variant="danger" className='button' onClick={handleStopSpeaking}><FaStopCircle /></Button>
              }
                <Button variant={`${!listening ? 'primary' : 'danger'}`} className="button" onMouseDown={handleStartListening} onMouseUp={stop}>
                  {
                    !listening ?
                    <FaMicrophone />
                    :
                    <FaMicrophoneSlash />
                  }
                </Button>
            </div>

          </Card.Body>
        </Card>
      </section>
    </div>
  );
}

export default App;
