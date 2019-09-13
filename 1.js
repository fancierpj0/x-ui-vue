/*
console.log(Array.isArray([]));
console.log(Object.prototype.toString.call({})); //[object Object]

console.log([1, 2, 3, 4].indexOf(1)); //0

console.log(Promise.all([]));

Promise.all([]).then(r=>{ // 此时r 为 []
  console.log('promise all then')
  console.log('r:',r);
})


console.log(Promise.race([]).then(r => { //不会走这个then
  console.log('promise race then')
  console.log('r:', r);
})
*/


/*console.log([1, 2, 3].includes(1));

console.log([undefined, null].filter(i => i));

console.log(typeof '123');
console.log(typeof null); //object
console.log(typeof undefined); //undefined

console.log([].map(item=>item)); //[]

const arr = [];
console.log(arr.shift()); // undefined
console.log(arr); // []

const fn = (a,b,c)=>{
  console.log(a, b, c);
}
fn(...[1, 2, 3]);*/

let arr = [1,2,3];
console.log(JSON.parse(JSON.stringify(arr))===arr);

let fn = ()=>{}
console.log(typeof fn);

console.log((new Promise((resolve,reject)=>{

})) instanceof Promise);

console.log('123' instanceof Promise)
console.log({} instanceof Promise)
console.log(fn instanceof Promise)

Promise.reject({key:'username',msg:'重复'}).then(null,(err)=>{
  console.log(err);
})
