import { getRandomColor } from "./randomColorGenerator";

function Child({ onChangeColor }) {
  return (
    <div
      onClick={onChangeColor}
      className="child"
      style={{ backgroundColor: "#FFF" }}
    />
  );
}

export default Child;
