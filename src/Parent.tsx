import { useState } from "react";
import { getRandomColor } from "./randomColorGenerator";
import Child from "./Child";

function Parent() {
  const randomColor = getRandomColor();
  const [color, setColor] = useState(randomColor);
  const [childrenColor, setChildrenColor] = useState("#FFF");

  function handleChangeColor(newChildColor: string) {
    const newRandomColor = getRandomColor();
    setColor(newRandomColor);
    setChildrenColor(newChildColor);
  }

  return (
    <div className="parent" style={{ backgroundColor: color }}>
      <Child onChangeColor={handleChangeColor} color={childrenColor} />
      <Child onChangeColor={handleChangeColor} color={childrenColor} />
    </div>
  );
}

export default Parent;
