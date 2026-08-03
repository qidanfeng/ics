export default {
  accMul(arg1,arg2){
    //小数相乘
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    var result = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    return m > 6 ? result.toFixed(6) : result;
  },
 addFloatNum(num1, num2) {
    //小数相加
    var sq1,sq2,m;
    try {
      sq1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
      sq1 = 0;
    }
    try {
      sq2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
      sq2 = 0;
    }
    m = Math.pow(10,Math.max(sq1, sq2));
    return (this.accMul(num1,m) + this.accMul(num2,m)) / m;
  },
  //调用：accDiv(arg1,arg2,digit)
  // 除数，被除数， 保留的小数点后的位数
  accDiv (arg1,arg2,digit){
    if(arg1==0 || arg2==0){
      return 0;
    }
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    r1=Number(arg1.toString().replace(".",""))
    r2=Number(arg2.toString().replace(".",""))
    //获取小数点后的计算值
    var result= ((r1/r2)*Math.pow(10,t2-t1)).toString()
    var result2=result.split(".")[1];
    result2=result2.substring(0,digit>result2.length?result2.length:digit);
    return Number(result.split(".")[0]+"."+result2);
  },
}

// 浮点数加法
export function floatAdd(arg1, arg2) {
  let re1, re2, m, n;
  try {
    re1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    re1 = 0;
  }
  try {
    re2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    re2 = 0;
  }
  m = Math.pow(10, Math.max(re1, re2));
  n = (re1 >= re2) ? re1 : re2;
  // arg1、 arg2 为浮点数
  return (floatMul(arg1, m) + floatMul(arg2, m)) / m;
}

//浮点数减法
export function floatSub(arg1, arg2){
  var re1, re2, m, n;
  try {
    re1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    re1 = 0;
  }
  try {
    re2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    re2 = 0;
  }
  m = Math.pow(10, Math.max(re1, re2));
  n = (re1 >= re2) ? re1 : re2;
  // arg1、 arg2 为浮点数
  return (floatMul(arg1, m) - floatMul(arg2, m)) / m;
}

// 浮点数乘法
export function floatMul(arg1, arg2) {
  var m=0, s1=arg1.toString(), s2=arg2.toString(), r1, r2;
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
    m += 0;
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
    m += 0;
  }
  r1 = Number(s1.replace(".",""));
  r2 = Number(s2.replace(".",""));
  return r1 * r2 / Math.pow(10, m);
}

// 浮点数除法
export function floatDiv(arg1, arg2) {
  var t1=0, t2=0, s1=arg1.toString(), s2=arg2.toString(), r1, r2;
  try {
    t1 = s1.split(".")[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = s2.split(".")[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(s1.replace(".",""));
  r2 = Number(s2.replace(".",""));
  if (t2 - t1 >= 0) {
    return (r1 / r2) * Math.pow(10, t2-t1);
  }else {
    // 当 t2 - t1 < 0时， Math.pow(10, t2-t1)为小数，产生浮点数问题，继续调用乘法
    return floatMul((r1 / r2), Math.pow(10, t2-t1))
  }
}

// 浮点数四舍五入
export function floatRound(num, len = 2) {
  let n = floatDiv(Math.round(floatMul(num, Math.pow(10, len))), Math.pow(10, len));
  return n.toFixed(len);
}
