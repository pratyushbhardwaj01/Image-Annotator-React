/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Group, Label, Rect, Text, Transformer } from "react-konva";

const Shape = ({
  rect,
  isSelected,
  rectangles,
  setRectangles,
  setSelectedRect,
  resizingRef,
  highlight,
}) => {
  const rectangleRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([rectangleRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  function updateRectangle(key, scaleX, scaleY) {
    const updatedState = rectangles.map((rect) => {
      if (rect.key === key) {
        return {
          x: rect.x,
          y: rect.y,
          width: Math.floor(rect.width * scaleX),
          height: Math.floor(rect.height * scaleY),
        };
      }
      return rect;
    });

    setRectangles(updatedState);
  }

  function updateRectanglePos(key, x, y) {
    const updatedState = rectangles.map((rect) => {
      if (rect.key === key) {
        return {
          ...rect,
          x,
          y,
        };
      }
      return rect;
    });

    setRectangles(updatedState);
  }

  return (
    <>
      <Rect
        draggable
        x={rect.x}
        ref={rectangleRef}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        stroke={highlight ? "yellow" : "white"}
        onDragEnd={(e) => {
          const { x, y } = e.target.attrs;
          updateRectanglePos(rect.key, x, y);
        }}
        onMouseDown={(e) => {
          setSelectedRect(rect.key);
        }}
        onTransformEnd={() => {
          const rectNode = rectangleRef.current;
          const scaleX = rectNode.scaleX();
          const scaleY = rectNode.scaleY();
          rectNode.scaleX(1);
          rectNode.scaleY(1);
          updateRectangle(rect.key, scaleX, scaleY);
          resizingRef.current = false;
        }}
        onTransformStart={() => {
          resizingRef.current = true;
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Shape;
