import React, { useState, useEffect } from "react";
import Button from "../../UI/Button/Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState("");
  const [imgPreview, setImgPreview] = useState();
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
        {imgPreview && <img className="img" src={imgPreview} alt="Preview" />}
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
