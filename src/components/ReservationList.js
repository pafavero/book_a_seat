import React from 'react';
import CalendarContainer from './CalendarContainer.js'
import Modal from './Modal.js'
import Alert from './Alert.js'
import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import styled from 'styled-components'
import moment from 'moment'
import utils from '../api/utils.ts'
import AuthContext from '../context/AuthProvider'

const ElementStyle = styled.div`

  {
    // padding: 1em;
    margin: 5px 0;
  }

  .alert{
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .div_date_list{
    display:flex;
    flex-direction: column;
    width: 800px;

    p{
      background-color: lightgray;
      margin:0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border-bottom: 1px solid white;
      font-weight: bold;
    }

    .wrapper-scroll {
      background-color: lightgray;
      overflow-y: auto;
      max-height: 300px;
    }
  }

  tr {
    font-size: 14px;
    background: lightgray;
    padding: 3px 2px;
    border-bottom-width: 2px;
  }

  tr:hover {
    background-color: gainsboro;
    cursor: pointer;
  }

  tr.sel-tr{
    background-color: gainsboro;
    border-bottom: 2px solid gray;
    border-right: 2px solid gray;
    border-top: 2px solid white;
  }

  td {
    padding: 4px 0.5rem;
    vertical-align: middle;
  }

  .btn {
    padding: 0px;
  }

  .wrapper-plus {
    background-color: lightgray;
    text-align: right;
    padding: 3px;

    button {
      width: 2.5rem;
      height: 2.3rem;
      line-height: 1rem;
      margin: 0.5rem;
    }
  }
`;

function RersevationList(props) {
  // console.log('props.selSeat', props.selSeat);  
  const [isCalendarActive, setCalendarActive] = useState(false);
  // const [id, setId] = useState(null);
  const [selRow, setSelRow] = useState(null);
  const [childKey, setChildKey] = useState(0);
  const [idToDel, setIdToDel] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [showAlert2, setShowAlert2] = useState(null);
  const { token } = useContext(AuthContext);

  const [reservationData, setReservation] = useState([]);

  const currentDate = moment(new Date()).startOf('hour').add(1, 'hours').toDate();

  useEffect(() => {
    if(props.selSeat)
      loadData(props.selSeat);
  }, [props.selSeat]);

  function loadData(selSeat){
    console.log('loadData reservation list', selSeat);
    const params = {
      selSeat: selSeat,
    };
    const callback = function(r){
      const rslt = r.map((val, key) => {
        if(typeof val.startdate === 'string'){
          val.startDate = new Date(val.startdate)
        }
        if(typeof val.enddate === 'string'){
          val.endDate = new Date(val.enddate)
        }
        val.name = `Id${val.id}`;
        return val;
      });
      // console.log('rslt', rslt);
      setReservation(rslt);
    }
    utils.getReservationDb(params, callback)
  }

  function onClickRow(_id) {
    // console.log('onClickRow', _id);
    setChildKey(_id);
    setCalendarActive(false);
    setSelRow(reservationData.find(item => item.id === _id));
  }

  function editRow(evt, _id) {
    // console.log('editRow', _id);
    evt.stopPropagation();
    setChildKey(_id);
    setCalendarActive(true);
    setSelRow(reservationData.find(item => item.id === _id));
  }

  function delRow(evt, _id, _startDate) {
    // console.log('delRow', _id);
    evt.stopPropagation();
    if(_startDate < currentDate){
      setShowAlert2('Not possibile to delete a book, which has been already started');
    }else{
      setIdToDel(_id);
    }
  }
  
  function addRow() {
    // console.log('addRow');
    const tomorrowAfternoon = moment(new Date()).startOf('date').add(42, 'hours').toDate();
    const newRow = { id: null, seatId: props.selSeat, user: token.user, 
      startDate: currentDate, endDate: tomorrowAfternoon};
    setChildKey(null);
    setCalendarActive(true);
    setSelRow(newRow);
  }

  function checkIfDisabled(item){
    let isDisabled = false;
    if(item.username!==token.user || item.endDate < currentDate) {
      isDisabled = true; 
    }
    return isDisabled
  }

  const handleClose = () => setIdToDel(false);
  const handleDel = () => {

    const callback = () => {
      refresh(utils.MSG.del);
      setIdToDel(null);
    }

    setChildKey(null);
    setReservation(reservationData.filter(item => item.id !== idToDel));
    utils.delReservationDb(idToDel, callback)
  }

  function refresh(msg) {
    loadData(props.selSeat);
    setCalendarActive(false);
    setSelRow(null);
    setShowAlert(msg);
    setTimeout(()=>{setShowAlert(null);}, 2500);
  }

  function check(dateInterval, id){
    // console.log('check in ReservationList', dateInterval, id);
    const errorData = reservationData
      .filter(
        function(item){
        return (item.id !== id && ((dateInterval[0] > item.startDate && dateInterval[0] < item.endDate)  // start inside existing dates
          || (dateInterval[1] > item.startDate && dateInterval[1] < item.endDate) // end inside existing dates
          || (dateInterval[0] <= item.startDate && dateInterval[1] >= item.endDate))) 
        })
    if(errorData.length===0)
      return null;
    const htmlData = errorData.map((item, key)=>{
      const id = item.id?"(id " + item.id + ")":"";
      const errorMsg1 = `ERROR: not possible to save selected reservation (${dateInterval[0].toLocaleDateString()} - ${dateInterval[1].toLocaleDateString()})`;
      const errorMsg2 = `overlaps the existing one with ${id} (${item.startDate.toLocaleDateString()} - ${item.endDate.toLocaleDateString()})`;
      return (<p key={key}>{errorMsg1}<br/>{errorMsg2}</p>)
    });
    return <div>{htmlData}</div>;
  }

  const tableContent = reservationData.map((val, key) => {
    const mStartDate = moment(val.startDate);
    const mEndDate = moment(val.endDate);
    const isDisabled = checkIfDisabled(val);
    return (
      <tr key={key} title="show reservation" onClick={() => onClickRow(val.id)} {...((selRow?.id===val.id) ? {className: 'sel-tr'} : {})} >
        <td>{val.name}</td>
        <td>{val.username}</td>
        <td><span>from</span>
        <span>
          &nbsp;{mStartDate.format('DD.MM.yyyy')}&nbsp;
          ({mStartDate.format('HH:mm')})
        </span>
        <span>&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;</span>
        <span>
          &nbsp;{mEndDate.format('DD.MM.yyyy')}&nbsp;
          ({mEndDate.format('HH:mm')})
        </span></td>
        {isDisabled ? 
          <td title="Edit booking not possible" ><FontAwesomeIcon className="fa-disabled" icon={faPen} /></td>
        :
          <td onClick={(evt) => { editRow(evt, val.id);}}>
            <button className="btn" title="Edit booking" >
              <FontAwesomeIcon icon={faPen} />
            </button>
          </td>
        }
        {isDisabled ? 
          <td><FontAwesomeIcon className="fa-disabled" icon={faTrash} /></td>
        :
          <td onClick={(evt) => {delRow(evt, val.id, val.startDate)}}>
            <button className="btn" title="Delete booking"  >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </td>
        }
      </tr>
    )
  })
  return (
    <ElementStyle>
      <Alert show={showAlert?true:false} msg={showAlert} variant="success" setShow={setShowAlert}/>
      <Alert show={showAlert2?true:false} msg={showAlert2} variant="danger" setShow={setShowAlert2}/>
      <Modal idToDel={idToDel} handleClose={handleClose} handleDel={handleDel} />
      <div className='div_date_list'>
        <p>Reservation for desk {props.selSeat}</p>
        <div className='wrapper-scroll'>
          {reservationData.length > 0 ?
          <Table>
            <tbody> 
                {tableContent}
            </tbody>
          </Table>:<>No booking</>}
        </div>
        {props.selSeat && token.role === 'user' && <div className='wrapper-plus'>
            <Button className='plus' type="button" onClick={() => { addRow()}}>Add <FontAwesomeIcon icon={faPlus} /></Button>
        </div>}
      </div>
      {selRow && <CalendarContainer isCalendarActive={isCalendarActive} setSelRow={setSelRow} selSeat={selRow} 
        user={token.user} key={childKey} refreshFn={refresh} msg={utils.MSG} check={check} currentDate={currentDate}/>}
    </ElementStyle>
  );
}
    
export default RersevationList;