import axios from './axios'
import moment from 'moment'

const SERVER_URL =  process.env.REACT_APP_SERVER_URL;
const RESERVATION_URL =  SERVER_URL + 'api/reservations';

const utils ={
  MSG: {
    del: 'Row has been successfully deleted!',
    add: 'Row has been successfully added!',
    edit: 'Row has been successfully modified!'
  },

  timeToDecimal: function(t) {
    var arr = t.split(':');
    var dec = parseInt((arr[1]/6)*10, 10);
    return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
  },
  
  decimealToTime: function(t) {
    return Math.floor(t)+':'+(t%1===0?'00':'30');
  },
  
  mergeDateAndtime: function (date, time) {
    return moment(date).startOf('date').add(time, 'hours').toDate();
  },

  getReservationDb: function (params, callback) {
    const loadRequest = async () => {
      try {
        const response = await axios.get(
          RESERVATION_URL,
          { params},
          {
            withCredentials: true,
          }
        );
        // console.log('response.data', response.data);
        callback(response.data?.rslt);
      } catch (err) {
        console.log("ERROR loadData", err);
      }
    }
    loadRequest();
  },

  delReservationDb: function(idToDel, callback){
    // console.log('delDb', idToDel);
    const sendRequest = async () => {
      try {
          const params = {
            id: idToDel,
          };
          // console.log('params', params);
          const response = await axios.delete(
              RESERVATION_URL,
              { params: params},
              {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
          );
          callback()
      } catch (err) {
        console.log("ERROR delDb", err)
      }
    }
    sendRequest();
  },

  insReservationDb: async (params, selSeat, callback) => {
    try {    
        let response;
        if(selSeat.id){ // edit
          response = await axios.put(
            RESERVATION_URL,
              params,
              {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
          );
        } else { // add
          response = await axios.post(
            RESERVATION_URL,
            params,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
        }
        // console.log('response', response)
        callback(response.data)
    } catch (err) {
      console.log("ERROR save in reservation", err);
    }
  }
    
}

export default utils

