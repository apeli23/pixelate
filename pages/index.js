import { useRef, useEffect, useState } from "react";
import Image from 'next/image'
import html2canvas from "html2canvas";
import { ImagePixelated, ElementPixelated } from "react-pixelate"
import { buildUrl } from 'cloudinary-build-url';

export default function Home() {
  const inputRef = useRef(undefined);
  const canvasRef = useRef(undefined);
  const imageRef = useRef(undefined);
  const pximgRef = useRef(undefined);



  const [picture, setPicture] = useState(undefined);
  const [link, setLink] = useState('');
  const [pximg, setPximg] = useState(undefined);

  let canvas, image, context, pixelArr, sample_size;

  useEffect(() => {
    if (picture) {
      setTimeout(() => {
        setPicture(picture);
      }, 2000);
    }
  }, [picture])
  const changeHandler = (e) => {
    const file = e.target.files?.item(0);
    setPicture(URL.createObjectURL(file));
  }



  const uploadHandler = async () => {
    html2canvas(imageRef.current).then((canvas) => {
      console.log(canvas.toDataURL());
      try {
        fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ data: canvas.toDataURL() }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json()) 
          .then((data) => {
            console.log(data.data)
            setLink(data.data);
          }).then(() => {
            pixelate();
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
    const pixelate = () => {
    console.log('pix');
    const urlBlurred = buildUrl(link, {
      cloud: {
        cloudName: 'dogjmmett',
      },
      transformations: {
        effect: "blur:10",
        quality: 1
      }
    });
    setPximg(urlBlurred);
  }
  return (
    <div className='container'>
      <div className="row">
        <div className="column">
        <input ref={inputRef} type="file" hidden onChange={changeHandler} />
          <button onClick={() => { inputRef.current.click() }}>Select File</button><br />
        </div>
      </div>
    </div>
  )
}
