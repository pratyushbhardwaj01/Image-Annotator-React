/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Label, Layer, Rect, Stage, Text } from "react-konva";
import Shape from "./Shape";
import "../src/App.css";

const ImageAnnotator = ({
  setImageAnnotator,
  image,
  rectangles,
  setRectangles,
  imageInd,
  hovered,
}) => {
  const [rectangle, setRectangle] = useState([]);
  const [selectedRect, setSelectedRect] = useState(null);

  const resizingRef = useRef(false);

  const handleDelete = () => {
    setRectangles((prev) => prev.filter(({ key: k }) => k !== selectedRect));
    setSelectedRect(null);
  };

  function mouseDown(e) {
    const { x, y } = e.target.getStage().getPointerPosition();

    const insideSomeRect = rectangles.some((rect) => {
      return (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
      );
    });

    if (insideSomeRect) {
      return;
    }

    if (resizingRef.current) {
      return;
    }
    if (rectangle.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      setRectangle([
        {
          x: x,
          y: y,
          widht: 0,
          height: 0,
          key: Math.floor(Math.random() * 1000),
        },
      ]);
    }
    const isClickedOutside = e.target === e.target.getStage();
    if (isClickedOutside) {
      setSelectedRect(null);
    }
  }

  function mouseUp(e) {
    if (rectangle[0]?.height <= 4 || rectangle[0]?.width <= 4) {
      setRectangle([]);
      return;
    }
    if (resizingRef.current) {
      return;
    }
    if (rectangle.length === 0) {
      return;
    }

    const { x, y } = e.target.getStage().getPointerPosition();
    const rectBegCordX = rectangle[0].x;
    const rectBegCordY = rectangle[0].y;
    const rectObj = {
      x: rectBegCordX,
      y: rectBegCordY,
      height: Math.floor(y - rectBegCordY),
      width: Math.floor(x - rectBegCordX),
      key: rectangle[0].key,
    };

    setRectangles((prev) => {
      return [...prev, rectObj];
    });
    setRectangle([]);
  }
  function mouseMove(e) {
    if (resizingRef.current) {
      return;
    }
    if (rectangle.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const rectBegCordX = rectangle[0].x;
      const rectBegCordY = rectangle[0].y;
      const rectObj = {
        x: rectBegCordX,
        y: rectBegCordY,
        height: y - rectBegCordY,
        width: x - rectBegCordX,
        key: rectangle[0].key,
      };
      setRectangle([rectObj]);
    }
  }

  function handleSave() {
    setImageAnnotator((prev) => {
      return {
        ...prev,
        [imageInd]: rectangles,
      };
    });
  }

  const allRectangles = [...rectangles, ...rectangle];

  return (
    <>
      <Stage
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        width={window.innerWidth}
        height={600}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
        }}
        className="stage"
      >
        <Layer>
          {allRectangles.map((rect) => {
            return (
              <Shape
                rect={rect}
                key={rect.key}
                rectangles={rectangles}
                setRectangles={setRectangles}
                setSelectedRect={setSelectedRect}
                isSelected={rect.key === selectedRect}
                resizingRef={resizingRef}
                highlight={hovered == rect.key}
              />
            );
          })}
        </Layer>
      </Stage>
      <div className="annotator-btns">
        <button className="btn">Submit</button>
        <button onClick={handleSave} className="btn">
          Save
        </button>
        {selectedRect && (
          <button className="btn delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </>
  );
};
export default ImageAnnotator;
