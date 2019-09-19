/*let date = new Date(2018, 0, 31);
// let date = this.value;
// console.log(date);
let firstDay = date.setDate(1); //会改变date //只有保证在28号之前 月份+1才不会出问题(多跳一个月) 比如new Date(2018, 0, 31); +1个月得到的是2.3(因为+1月，是加本月的天数，而不会智能的按照下一个月的天数)
// console.log(new Date(firstDay));
// console.log(date); //会改变date
date.setMonth(date.getMonth()+1);
let lastDay = date.setDate(0); //0是特殊的，表示是上个月的最后一天
//等同于↓
//let last = new Date(year,month+1,0)
console.log(new Date(lastDay));*/

export default {
  getYearMonthDate(date){
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    return [year, month, day];
  }
  ,firstDayOfMonth(date){
    let [year, month] = this.getYearMonthDate(date);
    return new Date(year, month, 1); // 只有day才是默认从1开始 day后面的参数都是从0开始 和month一样 只不过 month没有初始值
  }
  ,lastDayOfMonth(date){
    let [year, month] = this.getYearMonthDate(date);
    return new Date(year, month+1, 0); // 但day是可以设置为0的，表示上一个月最后一天
  }
  ,addYear(date,n){
    const [year] = this.getYearMonthDate(date);
    const newYear = year + n;
    const copy = new Date(date);
    copy.setFullYear(newYear);
    return copy;
  }
  ,addMonth(date,n){
    const [,month,] = this.getYearMonthDate(date);
    const newMonth = month + n;
    const copy = new Date(date);
    copy.setMonth(newMonth);
    return copy;
  }
  //[x,y)
  ,range(begin,end){
    const array = [];
    for(let i=begin;i<end;++i){
      array.push(i);
    }
    return array;
  }
  ,pad2(number){
    if(typeof number !== 'number'){
      throw new Error('wrong param');
    }
    return number >= 10 ? '' + number : '0' + number;
  }
}
