import { getRandomColor } from "./randomColorGenerator";

interface Props {
  onChangeColor(newChildColor: string): void;
  color: string;
}

function Child({ onChangeColor, color }: Props) {
  function handleClick() {
    const newColor = getRandomColor();
    onChangeColor(newColor);
  }

  return (
    <div
      onClick={handleClick}
      className="child"
      style={{ backgroundColor: color }}
    />
  );
}

export default Child;
