
import React from 'react'
import {useState} from 'react';
import styled from 'styled-components';

const ElementStyle = styled.div`
  >div{
    text-align: right;
    position: relative;
    margin-bottom: 15px;
  }
  
  input{
    width: 100%;
  }
  input[type=range]::-webkit-slider-runnable-track {
    background: #0d6efd;
    height: 5px;
    padding-top: -5px;
    border-radius: 5px;
  }
  input[type=range]::-webkit-slider-thumb {
    margin-top: -5px;
  }

  output{
    position: absolute;
    top: 18px;
    right: 0;
  }
`;

const MIN = 0;
const MAX = 24;
function Times(props) {

  const startValue = props.timeInterval[0];
  const endValue = props.timeInterval[1];
  // console.log('startValue  endValue', startValue, endValue);

  const onStartChange = (val) => {
    props.setTimeOnChange([val, endValue])
  };
  
  const onEndChange = (val) => {
    props.setTimeOnChange([startValue, val])
  };

  function getHhMm(val) {
    const mm = val-Math.floor(val)==0.5?'30':'00'
    return `${Math.floor(val)}:${mm}`;
  }


return (
  <ElementStyle>
    <div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={0.5}
        onChange={(e) => onStartChange(e.target.value)}
        value={startValue}
      />
      <output>{getHhMm(startValue)}</output>
    </div>
    <div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={0.5}
        onChange={(e) => onEndChange(e.target.value)}
        value={endValue}
      />
      <output>{getHhMm(endValue)}</output>
    </div>
  </ElementStyle>
  )
}
export default Times;