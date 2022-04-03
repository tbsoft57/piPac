const now = new Date();
let x = Date.now();

console.log(x);
console.log(now.getTime());

setTimeout(() => {
    console.log(now.getTime());
}, 2000);
