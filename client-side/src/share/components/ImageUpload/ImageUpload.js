import React, { useState, useEffect } from "react";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState(props.image && props.image);
  const [imgPreview, setImgPreview] = useState(
    `https://www.shareicon.net/data/512x512/2016/05/24/770137_man_512x512.png`
  );

  const imgPickedHandler = (e) => {
    const pickedImg = e.target.files;
    if (pickedImg && pickedImg.length === 1) {
      setFile(pickedImg[0]);
      props.inputValues(pickedImg[0], true, props.id);
    }
  };

  useEffect(() => {
    if (!file) {
      return;
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImgPreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="img-upload">
      <div className="img-preview">
        <img className="img" src={imgPreview} alt="Preview" />
      </div>
      <input
        onChange={imgPickedHandler}
        className="img-upload__input"
        type="file"
        accept=".jpg,.jpeg,.png"
      />
    </div>
  );
};

export default ImageUpload;
