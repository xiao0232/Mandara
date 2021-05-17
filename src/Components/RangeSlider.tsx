import React, {useState} from 'react';
import "./RangeSlider.scss";

function RangeSlider({changeVertex}: {changeVertex: Function}) {
  const [str, setStr] = useState("3");
  const [taskId, setTimeoutId] = useState<any>();
  const changeSliderValue = (e: any) => {
    clearTimeout(taskId)
    const tId = setTimeout(() => {
      changeVertex(Number(e.target.value))
    }, 15)
    setTimeoutId(tId)
  };

  return (
    <div className="range-container">
        <input
         type="range"
         id="range" 
         min="4" 
         max="100"
         value={str}
         onChange={e => {
           setStr(e.target.value)
           changeSliderValue(e)
         }}
        />
        <label htmlFor="range">{str}</label>
      </div>
  );
}

export default RangeSlider;
