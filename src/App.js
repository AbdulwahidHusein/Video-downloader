import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
const Api = process.env.REACT_APP_API_KEY;
console.log(Api);
function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadformats, setDownloadformats] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState(0);

  const handleDownload = (url) => {
    const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('download', 'video.mp4');
  document.body.appendChild(link);
  link.click();
  };

const handleUrl = ()=>{
    const url = new URL(videoUrl);
    const searchParams = new URLSearchParams(url.search);
    const id = searchParams.get('v');
    return id;
}



  const processClick = async ()=>{
    let options = {};
    let id;
    if (videoUrl)//make a request
  {
    try{
      id = handleUrl(videoUrl);
    }
    catch{
      setError('invalid Url please make sure you entered a correct url');
      return;
    }
    
    
    options = {
      method: 'GET',
      url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
      params: {id: id},
      headers: {
        'X-RapidAPI-Key': Api,
        'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
      }
    };
    try {
      setLoading(true);
      const response = await axios.request(options);
      setDownloadformats(response.data.formats);
      setTitle(response.data.title);
      setThumbnail(response.data.thumbnail[2].url);
      console.log(response.data);
      setLoading(false);
      setError();
    } catch (error) {
      setError('can not retrive the video');
      setLoading(false);
      //console.error(error);
    }
  }
  else{
    return;
  }
  }
 const handleInput = (e)=>{
  setVideoUrl(e.target.value);
  processClick();
 }



  return (
    <div className='container'>
    <div className="App">
      <div className="search-box">
        <button onClick={processClick} className="btn-search"><i class="fas fa-search"></i></button>
        <input
          id="url-input"
            onPaste={(e) => handleInput(e)}
            onChange={(e) => handleInput(e)}
            type="text"
            className="input-search"
            placeholder="paste url of your Video here..."/>
      </div>
      </div>
      {title && <p style={{'color':'white','fontSize':'200%'}}>{title}</p>}
      {loading && <p style={{'color':'white', 'fontSize':'200%','position':'relative','left':'100px'}}>Searching ... </p>}
      {
      !loading && error && <p className='error'>{error}</p>
      }
    {
      !loading && downloadformats && !error &&( 
        downloadformats.map((format)=>{
          return(
          <div key={format.id} className='video-holder'>
            <p className='quality-holder'>{format.qualityLabel}</p>
            <img className='thumbnail'src={thumbnail} />
            <div className='quality-button-holder'>
           <button className='download-button' onClick={()=>{handleDownload(format.url)}}>Download</button>
          </div>
          </div>
          )
        }

        )
        

      )
    }
    </div>
  );
}

export default App;


