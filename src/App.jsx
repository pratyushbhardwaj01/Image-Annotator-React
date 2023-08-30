import { useEffect, useState } from "react";
import "./App.css";
import ImageAnnotator from "./ImageAnnotator";
import Image1 from "../src/assests/Pic1.png";
import Image2 from "../src/assests/Pic2.png";
import Image3 from "../src/assests/Pic3.png";

const images = [Image1, Image2, Image3];
const defaultImageAnnotatorState = {
  0: [],
  1: [],
  2: [],
};

function App() {
  const [imageAnnotatorState, setImageAnnotator] = useState(
    defaultImageAnnotatorState
  );
  const [hovered, setHovered] = useState(null);
  const [imagesState, setImages] = useState(0);
  const [rectangles, setRectangles] = useState([]);

  useEffect(() => {
    setRectangles([...imageAnnotatorState[imagesState]]);
  }, [imagesState, imageAnnotatorState]);
  function handlePrev() {
    if (imagesState === 0) {
      setImages(images.length - 1);
    } else {
      setImages((prev) => prev - 1);
    }
    setRectangles([]);
  }

  function handleNext() {
    if (imagesState === images.length - 1) {
      setImages(0);
    } else {
      setImages((prev) => prev + 1);
    }
    setRectangles([]);
  }

  return (
    <div className="wrapper">
      <ImageAnnotator
        setImageAnnotator={setImageAnnotator}
        imageAnnotatorState={imageAnnotatorState}
        image={images[imagesState]}
        rectangles={rectangles}
        setRectangles={setRectangles}
        imageInd={imagesState}
        hovered={hovered}
      />
      <div className="btnContainer">
        <button className="btn" onClick={handlePrev}>
          Prev
        </button>

        <button className="btn" onClick={handleNext}>
          Next
        </button>
      </div>
      {Object.entries(imageAnnotatorState).map(([key, val]) => {
        if (val.length === 0) {
          return null;
        }
        return (
          <div key={key} className="result-box">
            <p>{key}</p> :
            {val.map((v, idx) => {
              return (
                <p
                  className="box-details"
                  key={v}
                  onMouseOver={() => {
                    setHovered(v.key);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                  }}
                >
                  Box: {idx + 1} {JSON.stringify(v)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
