import React, {useState, useRef, useEffect} from 'react';
import shortAudio1 from '../assets/music/short1.mp3';
import longAudio1 from '../assets/music/long1.mp3';

const Player = ({ type, isOnBreak, setIsOnBreak, setIsActive}) => {

  const audioEl = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFile, setAudioFile] = useState(shortAudio1);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchVideoAndPlay = () => {
    if (isOnBreak && type === 'long') {
      fetch(longAudio1)
      .then(() => {
        setAudioFile(longAudio1);
      })
      .then(()=> {
        return audioEl.current.play();
      })
      .catch(error => {
        console.log(error)
      })
    } else if (isOnBreak && type === 'short') {
      fetch(shortAudio1)
      .then(() => {
        setAudioFile(shortAudio1);
      })
      .then(() => {
        return audioEl.current.play();
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  useEffect(() => {
    fetchVideoAndPlay();
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnBreak, type]);

  const audioDuration = new Promise((resolve, reject) => {
    audioEl.current.duration ? resolve('audio duration found') : reject('no duration for audio')
  });

  audioDuration
    .then(message => {
      setDuration(Math.floor(audioEl.current.duration));
      setIsPlaying(true);
      console.log('this is the then ' + message);
    })
    .catch(errMessage => console.log('this is the then ' + errMessage))

  const audioEnd = () =>{
    setIsOnBreak(false)
    setIsActive(true);
    setIsMuted(false);
    setIsPlaying(false);
  }

  return (
    <section className="musicPlayer">
      
      <button onClick={()=>{setIsMuted(!isMuted)}}>mute</button>
      {isMuted 
        ? <audio muted src={audioFile} ref={audioEl} onEnded={audioEnd}></audio>
        : <audio src={audioFile} ref={audioEl} onEnded={audioEnd}></audio>
      }

      {type === 'short'
        ? <h4>time to relax your eyes </h4> 
        : <h4>time to go for a walk</h4>
      }


      <p>{isPlaying ? `${(duration - seconds).toString()} secs of breaktime left` : null }</p>
    </section>
  )
}

export default Player

