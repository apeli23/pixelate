### Pixellating Images using Nextjs and Cloudinary

## Introduction

This article demonstrates how to use Nextjs and Cloudinary to create an image pixelation transformation.  
Cloudinary will enable us to achieve pixelation programmatically without designer apps using its own [SDK](https://cloudinary.com/documentation/cloudinary_sdks)  tool.

## Codesandbox

Check the final demo on [Codesandbox](/).
<CodeSandbox
title="pixelation"
id=" "
/>

You can also find the GitHub repository using [Github](/).

## Prerequisites

Entry-level javascript and React/Nextjs knowledge.


## Cloudinary

[Cloudinary](https://cloudinary.com/?ap=em) refers to an end-to-end image- and video-management tool for various websites and mobile applications. It constitutes a wide range of services including online storage, image, and video manipulations and optimizations e.t.c.
In this article, we explore one of the Cloudinary transformation capabilities, that is, the online storage feature. 

For more on Cloudinary's comprehensive APIs and administration capabilities, explore the following [link](https://cloudinary.com/documentation/react_image_transformations).

Let's begin!

## Project Setup

Create a new nextjs project using `npx create-next-app pixelate`  in your terminal.
Head to the directory using `cd pixelate`.

We will handle all our code in the `pages/index` directory. 

## Dependencies

To use Cloudinary, we need to import the `cloudinary` package 

```
npm install cloudinary
```

 Create your Cloudinary account using [Link](https://cloudinary.com/console) and log into it. Each user account will have a dashboard containing environmental variable keys that are necessary for the intergration in our project.

In your project directory, start by including Cloudinary in your project dependencies `npm install cloudinary`
 create a new file named `.env` and paste the following code. Fill the blanks with your environment variables from the Cloudinary dashboard.

```
CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET =
```

Restart your project: `npm run dev`.

In the `pages/api` folder, create a new file named `upload.js`. 
Start by configuring the environment keys and libraries.

```
var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Create a handler function to execute the POST request. The function will receive media file data and post it to the Cloudinary website. It then captures the media file's Cloudinary link and sends it back as a response.

```
export default async function handler(req, res) {
    if (req.method === "POST") {
        let url = ""
        try {
            let fileStr = req.body.data;
            const uploadedResponse = await cloudinary.uploader.upload_large(
                fileStr,
                {
                    resource_type: "video",
                    chunk_size: 6000000,
                }
            );
            url = uploadedResponse.url
        } catch (error) {
            res.status(500).json({ error: "Something wrong" });
        }

        res.status(200).json({data: url});
    }
}
```

 

The code above concludes our backend.

In our front end, we use `react-pixelate` to pixelate our image and `html2canvas` to capture our final image for Cloudinary upload. We use `useRef` and `useState` hooks to reference our DOM elements and track our media files respectively.

```
"pages/index.js"

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ImagePixelated } from "react-pixelate"

```

In the home function, start by including the state hook variables

```
"pages/index.js"

    const inputRef = useRef(undefined);
    const imageRef = useRef(undefined);

    const [picture, setPicture] = useState(undefined);
    const [link, setLink] = useState('');

```

Our UI will have a single column with two rows. One contains the original image and the other contains the pixelated image.

We create a function named `changeHandler` to capture the user's selected file and display it to the user by creating a string of the file object representztion using `URL.createObjectURL()` method.

```
"pages/index.js"

  const changeHandler = (e) => {
    const file = e.target.files?.item(0);
    setPicture(URL.createObjectURL(file));
  }
```

As mentioned before, we'll require `html2canvas` to be installed to capture the final image for Cloudinary upload using a POST method. We place it inside the `uploadHandler` function. The function will return the image file's Cloudinary link as a response which will be displayed to the user through a use state hook.

```
"pages/index.js"

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
```

The `ImagePixelated` import will be used in the return statement to create a pixelated version of the selected image.

```
"pages/index.js"

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

```

The UI will be rendered as follows:

![complete UI](https://res.cloudinary.com/dogjmmett/image/upload/v1664375386/Screenshot_2022-09-28_at_17.29.25_xwovgu.png "complete UI")
 
At this point, we have successfully created an image pixelation app. Feel free to go through the article and enjoy the experience.