console.log(Array.isArray([]));
console.log(Object.prototype.toString.call({})); //[object Object]

console.log([1, 2, 3, 4].indexOf(1)); //0

console.log(Promise.all([]));

Promise.all([]).then(r=>{ // 此时r 为 []
  console.log('promise all then')
  console.log('r:',r);
})


Promise.race([]).then(r=>{ //不会走这个then
  console.log('promise race then')
  console.log('r:',r);
})
