import { useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import Modal from './Modal.js'
import BModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components'
import moment from 'moment';
import axios from '../api/axios'
import utils from '../api/utils.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash} from '@fortawesome/free-solid-svg-icons'

const SERVER_URL =  process.env.REACT_APP_SERVER_URL
const GET_URL =  SERVER_URL + 'api/my_reservations'
const CONTENT_WIDTH =  650

const ElementStyle = styled.div`

  .wrapper_month{
    width: ${CONTENT_WIDTH + 120}px;
    padding: 0 10px;
    font-weight: bold;
    text-align: left;
    background-color: lightgray;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 2px solid #dee2e6;
  }

  table{
    width: ${CONTENT_WIDTH + 120}px;
    position: relative;

    td{
      padding: 0;
      height: 28px;
    }

    td{
      background: lightgray;
      border-bottom-width: 2px;
      
    }

    td:nth-child(1){
      width:65px; 
      text-align: left;
      padding-left: 4px;
    }

    td:nth-child(2){
      width:${CONTENT_WIDTH}px; 
      position: relative;
    }

    td:nth-child(3){
      width:46px; 
    }

    tr.today td{
      background: #d8d85a;
    }

    div.today{
      background-color: lightgray;
      position: absolute;
      right: -180px;
      width: 120px;
      height:25px;
      // padding-left:20px;
    }
    div.today:before{
      width:0;
      height:0;
      content:"";
      display:inline-block;
      border-top:12px solid transparent;
      border-right:12px solid lightgray;
      border-bottom:12px solid transparent;
      position:absolute;
      left: -12px;
    }

    .div_bar{
      font-size: 12px;
      position: absolute;
      display: block;
      height: 18px;
      top: 3px;
      border-radius: 5px;
      margin: 2px 1px;
    }

    button{
      padding: 0;
    }
  }
`;

const currentDate = moment(new Date()).startOf('day').toDate();

export default function MyBooking(props) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const [reservationList, setReservationList] = useState([])
  const [reservationData, setReservation] = useState([])
  const [idToDel, setIdToDel] = useState(null);
  const [showAlert, setShowAlert] = useState(null);

  function loadData(){
    console.log('load booking');

    const params = {
      id: props.username
    };
    const loadRequest = async () => {
      try {
        const response = await axios.get(
          GET_URL,
          { params: params},
          {
              withCredentials: true,
          }
        );
        const rslt = response.data?.rslt.map((val, key) => {
          if(typeof val.startdate === 'string'){
            val.startDate = new Date(val.startdate)
          }
          if(typeof val.enddate === 'string'){
            val.endDate = new Date(val.enddate)
          }
          val.mmtS = moment(val.startDate)
          val.startHour  = parseFloat(val.mmtS.format('HH')) + parseFloat(val.mmtS.format('mm')/60)
          val.startDay = parseInt(val.mmtS.format('D'))
          val.startMonth = parseInt(val.mmtS.format('M'))
          val.startYear  = parseInt(val.mmtS.format('YYYY'))
          val.weekday = val.mmtS.format('ddd')
          
          val.mmtE = moment(val.endDate)
          val.endHour = parseInt(val.mmtE.format('HH')) + parseFloat(val.mmtE.format('mm')/60)
          val.endDay = parseInt(val.mmtE.format('D'))
          val.endMonth = parseInt(val.mmtE.format('M'))
          val.endYear  = parseInt(val.mmtE.format('YYYY'))
          val.weekday = val.mmtS.format('ddd')
          return val;
        });

        const finalMap = []
        rslt.forEach(item => {
          let monthYearItem = finalMap.find(item2 => item2.year === item.startYear && item2.month === item.startMonth)
          if (!monthYearItem){
            if (item.startDay === item.endDay){  
              monthYearItem = {year: item.startYear, month: item.startMonth, days: [{day: item.startDay,
                dayBook: [{id: item.id, seatId: item.seatid, from: item.startHour, to: item.endHour}]}]}
              finalMap.push(monthYearItem)
            }else{
              addMultiDays(item, finalMap)
            }

          }else{
            const dayItem = monthYearItem.days.find(item3 => item3.day === item.startDay)
            if(!dayItem){
              if (item.startDay === item.endDay){  
                monthYearItem.days.push({day: item.startDay, dayBook: [{id: item.id, seatId: item.seatid, from: item.startHour, to: item.endHour}]}) 
              }else{
                addMultiDays(item, finalMap)
              }
            }else{
              dayItem.dayBook.push({id: item.id, seatId: item.seatid, from: item.startHour, to: item.endHour})
            } 
          }
        });
        console.log('modify rslt', rslt);
        console.log('finalMap', finalMap)
        setReservation(finalMap)
        setReservationList(rslt)
      } catch (err) {
        console.log("ERROR loadData", err);
      }
    }
    loadRequest();
  }

  function addMultiDays(item, finalMap){
    const currDate = item.mmtS.startOf('day')
    const lastDate = item.mmtE.startOf('day')
    let startHour = null
    while(currDate.diff(lastDate) <= 0) {
      const day = parseInt(currDate.format('D'))
      const weekday = currDate.format('ddd')
      const month = parseInt(currDate.format('M'))
      const year = parseInt(currDate.format('YYYY'))
      startHour = startHour===null?item.startHour:0
      // console.log(item)
      const endHour = currDate.isSame(lastDate)?item.endHour:24
      
      // console.log(startHour, endHour, day, month, year)
      let monthYearItem = finalMap.find(item2 => item2.year === year && item2.month === month)
      if(!monthYearItem){
        monthYearItem = {year: year, month: month, days: [{day, weekday,
          dayBook: [{id: item.id, seatId: item.seatid, from: startHour, to: endHour}]}]}
        finalMap.push(monthYearItem)
      }else{
        const dayItem = monthYearItem.days.find(item3 => item3.day === day)
        if(!dayItem){
          monthYearItem.days.push({day, weekday, dayBook: [{id: item.id, seatId: item.seatid, from: startHour, to: endHour}]})  
        }else{
          dayItem.dayBook.push({id: item.id, seatId: item.seatid, from: startHour, to: endHour})
        }
      }
      currDate.add(1, 'days')
    }
  }

  useEffect(() => {
      // only in dev mode is called 2 times 
      console.log('==============> user effect', props.loadBooking)
      loadData();
  }, [props.loadBooking]);

  // function onClickBar(ev, item) {
  //   const rItem = reservationList.find(item2 => item.id === item2.id)
  //   // console.log('onClickBar item:', item, rItem);
  //   setSelRow(item)
  //   const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  //   const y = ev.clientY + scrollTop
  //   setYPos(y)
  // }

  const barEl = (dayBook, dayMonthKey) => {
    return dayBook.map((val, key) => {
      // console.log(val, key)
      const colorId4SeatId = val.seatId % 4
      const widthBar = (val.to - val.from) / 24 * CONTENT_WIDTH    // 24hh
      const left = val.from  / 24 * CONTENT_WIDTH
      const style = {width: (widthBar + 'px'), left: left + 'px', backgroundColor:  COLORS[colorId4SeatId]}
      const fTDayMonthKey = val.from  + '_' +  val.to + '_' + dayMonthKey
      const r = reservationList.find(item2 => val.id === item2.id)
      const fTime = r.mmtE.format('HH:mm')
      const txtContent = `from  ${r.mmtS.format('HH:mm')} to ${fTime==='00:00'?'24:00':fTime}, desk id: ${val.seatId}`
      const titleContent = `from ${r.mmtS.format('DD.MM.yyyy HH:mm')} to ${r.mmtE.add(-1, 'ss').format('DD.MM.yyyy HH:mm')}, desk id: ${val.seatId}`
      return (
        <div key={fTDayMonthKey} className="div_bar" style={style} title={titleContent}  >
          {(widthBar > 250)?txtContent:''}
        </div>
      )
    })
  }

  const days4Month = (item) => {
    return item.days.map((val, key) => {
      // console.log(val, item)
      const selDay = new Date(item.year, item.month - 1, val.day, 0, 0, 0)
      const startDate = reservationList.find(item2 => val.dayBook.at(-1).id === item2.id).startDate
      const isDisabled = (startDate <= currentDate)?true:false
      const isToday = (selDay.getTime() === currentDate.getTime())?true:false
      const titleText = 'Delete booking' + (isDisabled?' not possible. In the past':'')
      return (
        <tr key={item.month+ '_' + key } {...(isToday ? {className: 'today'} : {})} >
          <td>{val.day} {val.weekday}</td>
          <td>
            {barEl(val.dayBook, val.day + '_' + item.month)}
            {isToday && <div className='today'>Today</div>}
          </td>
          <td>
            <button className="btn" title={titleText} onClick={(evt) => {delRow(evt, isDisabled, val)}} >
              <FontAwesomeIcon {...(isDisabled ? {className: 'fa-disabled'} : {})} icon={faTrash}  />
            </button>
          </td>
        </tr>
      )
    })
  }

  const tableContent = reservationData.map((val, key) => {
    // const mStartDate = moment(val.startDate);
    // const mEndDate = moment(val.endDate);
    return (
      <div key={'div_' + key} className='wrapper_table' >
        <div className='wrapper_month'>{moment(val.month, 'M').format('MMMM')} {val.year}</div>
        <Table>
          <tbody>
            {days4Month(val)}
          </tbody>
        </Table>
      </div>
    )
  })

  function delRow(evt, isDisabled, item) {
    // console.log('delRow', evt, isDisabled, item);
    evt.stopPropagation();
    if(isDisabled)
      return

    setIdToDel(item.dayBook.at(-1).id);
  }

  const handleClose = () => setIdToDel(false);
  const handleDel = () => {
    const callback = () => {
      refresh()
      setIdToDel(null)
    }
    utils.delReservationDb(idToDel, callback)
  }

  function refresh() {
    // console.log(msg)
    loadData();
    setShowAlert(utils.MSG.del);
    setTimeout(()=>{setShowAlert(null);}, 2500);
  }
  
  return(
    <ElementStyle >
      <BModal show={showAlert?true:false} size= 'sm' centered='true' backdrop="static">
        <BModal.Body>{showAlert}</BModal.Body>
        <BModal.Footer>
          <Button variant="secondary" onClick={()=>setShowAlert(null)}>Close</Button>
        </BModal.Footer>
      </BModal>

      <Modal idToDel={idToDel} handleClose={handleClose} handleDel={handleDel} />
      {reservationData.length > 0 ? tableContent : <h2>No reservations until now!"</h2>}
    </ElementStyle>
  )
}