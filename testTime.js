
start = process.hrtime();

setInterval(_ => {
    duration = process.hrtime(start);
    console.log(duration[0] * 1000 + duration[1] / 1000000);
}, 500);

