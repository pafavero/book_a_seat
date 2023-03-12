import React, { useState, useRef, useEffect } from "react";
import DatePicker, {Calendar,  DateObject } from "react-multi-date-picker"
import moment from 'moment'
import Times from './Times'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const ElementStyle = styled.div`
  .wrapper-date-edit {
    position: absolute;
    right: -200px;
    padding: 4px;
    z-index: 1000;
    background-color: white;
    box-shadow: 0 0 5px #8798ad;
    box-sizing: border-box;
    border-radius: 5px;
  }

  p{
    font-size: 14px;
  }

  .rmdp-top-class{
    margin-left: 7px;
  }

  button.btn	{
    margin: 3px;
    width: 100%;
    padding: 3px;
  }
`;

function timeToDecimal(t) {
  var arr = t.split(':');
  var dec = parseInt((arr[1]/6)*10, 10);
  return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
}

function decimealToTime(t) {
  return Math.floor(t)+':'+(t%1===0?'00':'30');
}

function mergeDateAndtime(date, time) {
  return moment(date).startOf('date').add(time, 'hours').toDate();
}

export default function NewCalendar(props) {
  /**
   * https://shahabyazdi.github.io/react-multi-date-picker/other-examples/ 
   */
  
  const divStyle = {
    top: `${props.yPos - 125}px`
  };

  const wrappeClassName = `wrapper-date-edit ${!props.isCalendarActive?'disabled-all':''}`;

  const [dateInterval, setDateInterval]  = useState([props.selRow.startDate, props.selRow.endDate]);
  const [timeInterval, setTimeInterval]  = useState([timeToDecimal(moment(props.selRow.startDate).format('HH:mm')), 
      timeToDecimal(moment(props.selRow.endDate).format('HH:mm'))]);
  // console.log('dateInterval', dateInterval);
  // console.log('timeInterval', timeInterval);
  const [showAlert2, setShowAlert2] = useState(false);
  const [msgAlert2, setMsgAlert2] = useState({});

  function setDateOnChange(evt){
    // console.log('=========> setDateOnChange', evt);
    setDateInterval(evt)
  }

  function setTimeOnChange(evt){
    // console.log('=========> setTimeOnChange', evt);
    setTimeInterval(evt)
  }

  const check = function(mode, dt){}

  const save = function(){}

  return (<ElementStyle >
    <div className={wrappeClassName} style={divStyle} > 
      <Calendar value={dateInterval} onChange={setDateInterval}       
      range></Calendar>
      <p>
        <span>from</span>{' '}{moment(dateInterval[0]).format('DD.MM.yyyy')}{' '}{decimealToTime(timeInterval[0])}
        <span>{' '}to{' '}</span> {moment(dateInterval[1]).format('DD.MM.yyyy')}{' '}{decimealToTime(timeInterval[1])}
      </p>
      
      <div> 
        {dateInterval[0] && 
          <Times timeInterval={timeInterval} setTimeOnChange={setTimeOnChange}/>
        }
      </div>
      <Button type="button" onClick={()=>props.setSelRow(null)} variant="secondary" >Close</Button>
      <Button type="button" onClick={save} >
        Save <FontAwesomeIcon icon={faSave}/>
      </Button>
    </div>
  </ElementStyle>)
  }