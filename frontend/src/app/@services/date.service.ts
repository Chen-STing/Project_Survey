import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  //將帶入的日期 轉換 為 YYYY-MM-DD 格式
  changeDateFormat(dateDate: Date, dateType: string = "-") {
    let year;
    let month;
    let date;
    if(dateDate) {
      year = dateDate.getFullYear();
      month = dateDate.getMonth() + 1;
      if (String(month).length == 1) {
        month = "0" + month;
      }
      date = dateDate.getDate();
      if (String(date).length == 1) {
        date = "0" + date;
      }
      return year + dateType + month + dateType + date;
    }else {
      return '';
    }
  }

  // 將當前的時間 化為DateTime YYYY-MM-DD HH:MM:SS
  changeDateTime(dateDate: Date) {
    let time = new Date();
    let result = time.toLocaleTimeString().slice(2,);
    // 當不足8位字元時，前面補一個0
    if(result.length != 8) {
      result = 0 + result;
    }
    return this.changeDateFormat(dateDate, "-") + " " + result;
  }

  constructor() { }
}
