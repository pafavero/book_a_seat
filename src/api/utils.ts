import axios from './axios';
import moment from 'moment';

const SERVER_URL =  process.env.REACT_APP_SERVER_URL;
const RESERVATION_URL =  SERVER_URL + 'api/reservations';

type Params = {
  selSeat: number,
};

type Params2 = {
  id: number | null, 
  seatId: number, 
  user: string, 
  interval: Date[]
};

type SelSeat = {
  id: number, 
  seatId: number, 
  user: string, 
  startDate: Date,
  endDate: Date,
};

type Response = {
  config: any 
  data: {successfull: boolean}
  headers: any, 
  request: XMLHttpRequest
  status: number 
  statusText: string
}

const utils ={
  MSG: {
    del: 'Row has been successfully deleted!',
    add: 'Row has been successfully added!',
    edit: 'Row has been successfully modified!'
  },

  timeToDecimal: function(t: string): number {
    /**
     * Convert hh:mm to a float
     */
    const arr: string[] = t.split(':');
    const dec: number = parseInt(arr[1], 10) / 6 * 10;
    return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
  },
  
  decimealToTime: function(t: number): string {
    /**
     * Convert number to hh:mm
     */
    return Math.floor(t)+':'+(t%1===0?'00':'30');
  },
  
  mergeDateAndtime: function (date: Date, time: number): Date {
    return moment(date).startOf('date').add(time, 'hours').toDate();
  },

  getReservationDb: function (params: Params, callback: Function): void {
    const loadRequest = async () => {
      try {
        const response = await axios.get(
          RESERVATION_URL,
          { params}
        );
        callback(response.data?.rslt);
      } catch (err) {
        console.log("ERROR loadData", err);
      }
    }
    loadRequest();
  },

  delReservationDb: function(idToDel: number, callback: Function): void{
    // console.log('delDb', idToDel);
    const sendRequest = async () => {
      try {
          const params = {
            id: idToDel,
          };
          // console.log('params', params);
          await axios.delete(
            RESERVATION_URL,
            { params: params},
          );
          callback()
      } catch (err) {
        console.log("ERROR delDb", err)
      }
    }
    sendRequest();
  },

  insReservationDb: async (params: Params2, selSeat: SelSeat, callback: Function) => {
    try {    
      let response: Response;
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
      callback(response.data)
    } catch (err) {
      console.log("ERROR save in reservation", err);
    }
  }
}

export default utils

