var date = new Date();
var bigMonth = [1,3,5,7,8,10,12];
var smallMonth = [4,6,9,11];
var spacialMonth = 2;


function timeFormatHandle(time) {
  let text = "";
  if (time<10){
    text = "0"+time;
    return text;
  }
  text = time
  return text;
}
export function getNowDate() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();

  var mon = timeFormatHandle(month);
  var d = timeFormatHandle(day);

  let res =year+"-"+mon+"-"+d;
  return res
}

export function getNowDateEndTime() {
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();

  var mon = timeFormatHandle(month);
  var d = timeFormatHandle(day);

  let res =year+"-"+mon+"-"+d + ' 23:59:59';
  return res
}

export function getNowTime() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var h = timeFormatHandle(hours);
  var min = timeFormatHandle(minutes);
  var s = timeFormatHandle(seconds);

  let res = " "+h+":"+min+":"+s;
  return res
}

export function getNowDateTime() {
  var res = "";
  var day = "";
  var month = "";
  var year = "";
  var hours = "";
  var minutes = "";
  var seconds = "";
  let date =new Date();
  day = date.getDate();
  month = date.getMonth()+1;
  year = date.getFullYear();
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();

  var h = timeFormatHandle(hours);
  var min = timeFormatHandle(minutes);
  var s = timeFormatHandle(seconds);

  var mon = timeFormatHandle(month);
  var d = timeFormatHandle(day);

  res = ""+year+"-"+mon+"-"+d+" "+h+":"+min+":"+s;
  return res
}

export function getYesterday() {
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();

  let yesterday;
  if(day>1){
    yesterday = day -1;
  }else{
    /* 判断月份有多少天 */
    if(month > 1){
      month = month -1;
      if(month === spacialMonth){
        if(year%4 === 0){
          yesterday = 29;
        }else{
          yesterday = 28;
        }
      }else if(bigMonth.indexOf(month) > 0){
        yesterday = 31;
      }else if(smallMonth.indexOf(month) > 0){
        yesterday = 30;
      }else{
        yesterday = day;
      }
    }else{
      year --;
      month = 12;
      yesterday = 31;
    }
  }
  month = timeFormatHandle(month);
  yesterday = timeFormatHandle(yesterday);

  let res = {
    year:year,
    month:month,
    day:yesterday
  }
  return res;

}

export function getYesterdayTime() {
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();

  let yesterday;
  if(day>1){
    yesterday = day -1;
  }else{
    /* 判断月份有多少天 */
    if(month > 1){
      month = month -1;
      if(month === spacialMonth){
        if(year%4 === 0){
          yesterday = 29;
        }else{
          yesterday = 28;
        }
      }else if(bigMonth.indexOf(month) > 0){
        yesterday = 31;
      }else if(smallMonth.indexOf(month) > 0){
        yesterday = 30;
      }else{
        yesterday = day;
      }
    }else{
      year --;
      month = 12;
      yesterday = 31;
    }
  }
  month = timeFormatHandle(month);
  yesterday = timeFormatHandle(yesterday);
  return "" + year + "-" + month + "-" + yesterday + " " + "00:00:00"
}

/**
 * 获取当前日期 day天的数据，传入的day为一个数字
 * @param day  若为0表示获取今天的日期；若为正数表示获取后day天的日期；若为负数表示获取前day天的日期
 * @returns {string}  日期字符串
 */
export  function getDay(day){
  let days = new Date();
  let gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day;
  days.setTime(gettimes);
  let year = days.getFullYear();
  let month = days.getMonth()+1;
  if(month<10){
    month="0"+month;
  }
  let today = days.getDate();
  if(today<10){
    today="0"+today;
  }
  return year + "-" + month + "-" + today;
}

export  function getDayTime(day){
  let days = new Date();
  let gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day;
  days.setTime(gettimes);
  let year = days.getFullYear();
  let month = days.getMonth()+1;
  // let hours = days.getHours();
  // let minutes = days.getMinutes();
  // let seconds = days.getSeconds();
  //
  // let h = timeFormatHandle(hours);
  // let min = timeFormatHandle(minutes);
  // let s = timeFormatHandle(seconds);

  if(month<10){
    month="0"+month;
  }
  let today = days.getDate();
  if(today<10){
    today="0"+today;
  }
  return year + "-" + month + "-" + today + " 00:00:00";
  // return year + "-" + month + "-" + today +" "+ h + ":" + min + ":" + s;
}

export function formatYYYYMMDDHHMMSS(date) {
  let res = "";
  let day = "";
  let month = "";
  let year = "";
  let hours = "";
  let minutes = "";
  let seconds = "";
  day = date.getDate();
  month = date.getMonth()+1;
  year = date.getFullYear();
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();

  let h = timeFormatHandle(hours);
  let min = timeFormatHandle(minutes);
  let s = timeFormatHandle(seconds);

  let mon = timeFormatHandle(month);
  let d = timeFormatHandle(day);

  res = ""+year+"-"+mon+"-"+d+" "+h+":"+min+":"+s;
  return res
}
