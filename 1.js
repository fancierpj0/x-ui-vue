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


console.log([1, 2, 3].includes(1));

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
fn(...[1, 2, 3]);
