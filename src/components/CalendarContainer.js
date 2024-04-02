import React from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import moment from 'moment';
import Times from './Times';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import utils from '../api/utils.ts'
import Alert from './Alert.js'
import CloseButton from 'react-bootstrap/CloseButton';

const ElementStyle = styled.div`
  .wrapper-date-edit {
    box-shadow: 2px 2px 1px gray;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-top: 20px;
    width: 368px;
    padding: 5px;
    background-color: white;
    position: absolute;
    top: 150px;
    right: 0px;
  }

  .disabled-all .react-calendar button{
    pointer-events: none;
  }

  .react-calendar {
    width: 100%;
    // border: none;
  }

  p{
    margin-bottom: 0;
  }

  .btn-close{
    float: right;
  }

  button.btn	{
    margin: 3px;
    width: 100%;
  }
`;

function CalendarContainer(props) {
  // console.log('props.selSeat in TimeContainer', props.selSeat);
  const selSeat = props.selSeat;
  const wrappeClassName = `wrapper-date-edit ${!props.isCalendarActive?'disabled-all':''}`;
  const [dateInterval, setDateInterval]  = useState([selSeat.startDate, selSeat.endDate]);
  const [timeInterval, setTimeInterval]  = useState([utils.timeToDecimal(moment(selSeat.startDate).format('HH:mm')), 
    utils.timeToDecimal(moment(selSeat.endDate).format('HH:mm'))]);
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

  function check(mode, dt){
    // console.log('check');
    let errorData = null;
    if(mode == 'edit' && (dt[1] < props.currentDate )){
      errorData = 'Not possibile to modify values in the past';
    }
    else if(mode == 'add' && dt[0] < props.currentDate){
      errorData = 'Not possibile to start a new reservation in the past';
    } else {
      errorData = props.check(dt, selSeat.id);
    }
    // console.log('errorData);
    if(errorData){
      setShowAlert2(true);
      setMsgAlert2(errorData);
      return false;
    }
    return true;
  }

  const save = function(){
    // console.log('save');
    const dt0 = utils.mergeDateAndtime(dateInterval[0], timeInterval[0]);
    const dt1 = utils.mergeDateAndtime(dateInterval[1], timeInterval[1]);
    if(check(selSeat.id?'edit':'add', [dt0, dt1])){
      const params = {
        id: selSeat.id,
        seatId: selSeat.seatId,
        user: props.user,
        interval: [dt0.toString().slice(0, 24), dt1.toString().slice(0, 24)]
      };

      const callback = function(resp) {
        // console.log('=====> insReservationDb resp', resp);
        if(resp && !resp.successfull){
          setShowAlert2(true);
          setMsgAlert2(`In the same time ${params.interval.join(' - ')} the user has other reservations (desk ids: ${resp.rows.join(', ')})`);
        } else {
          props.refreshFn(selSeat.id?props.msg.edit:props.msg.add);
        }
      }
      utils.insReservationDb(params, selSeat, callback)
    }
  }

  return (
    <ElementStyle>
      <Alert show={showAlert2} msg={msgAlert2} variant="danger" setShow={setShowAlert2}/>
      <div className={wrappeClassName}>
        <CloseButton onClick={()=>props.setSelRow(null)} />
        <div className="calendar-container">
          <Calendar onChange={(evt1)=>{setDateOnChange(evt1)}}
            showWeekNumbers={false} showNeighboringMonth={true} 
            value={dateInterval} selectRange={true} 
            /> 
        </div>
        <p>
          <span>from</span>{' '}{moment(dateInterval[0]).format('DD.MM.yyyy')}{' '}{utils.decimealToTime(timeInterval[0])}
          <span>{' '}to{' '}</span> {moment(dateInterval[1]).format('DD.MM.yyyy')}{' '}{utils.decimealToTime(timeInterval[1])}
        </p>
        {props.isCalendarActive && (
        <>
          <div> 
            {dateInterval[0] && 
              <Times timeInterval={timeInterval} setTimeOnChange={setTimeOnChange}/>
            }
          </div>
          <Button type="button" onClick={()=>props.setSelRow(null)} variant="secondary" >Close</Button>
          <Button type="button" onClick={save} >
            Save <FontAwesomeIcon icon={faSave}/>
          </Button>
        </>
        )}
      </div>
    </ElementStyle>
  );
}

export default CalendarContainer;

