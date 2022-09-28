import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ImagePixelated } from "react-pixelate"

export default function Home() {
  const inputRef = useRef(undefined);
  const imageRef = useRef(undefined);

  const [picture, setPicture] = useState(undefined);
  const [link, setLink] = useState('');

  const changeHandler = (e) => {
    const file = e.target.files?.item(0);
    setPicture(URL.createObjectURL(file));
  }

  const uploadHandler = async () => {
    html2canvas(imageRef.current).then((canvas) => {
      try {
        fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ data: canvas.toDataURL() }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            setLink(data.data);
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
  return (
    <div className='container'>
      <nav>
        <h2>Image pixelation</h2>
        #Nextjs #Cloudinary
      </nav>
      <div className='row'>
        <div className='column'>
          {picture ?
            <h3>original  image</h3>
            :
            <h3>select an image file</h3>
          }
          <input ref={inputRef} type="file" hidden onChange={changeHandler} />
          <button onClick={() => { inputRef.current.click() }}>Select File</button><br />
          {picture &&
            <img src={picture} />
          }
        </div>
        {picture &&
          <div className='column'>
            <h2>Pixelated image</h2>
            {link && <a href={link}><p>Get link</p></a>}

            <div ref={imageRef} >
              <ImagePixelated src={picture} width={500} height={300} fillTransparencyColor={"grey"} />
            </div>
            <button onClick={uploadHandler}>Upload Image</button>
          </div>
        }
      </div>
    </div>
  )
}
