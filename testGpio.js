const Gpio = require('onoff').Gpio; // Gpio class
const led = new Gpio(20, 'out');       // Export GPIOxx as an output

// Toggle the state of the LED connected to GPIO17 every 200ms
const iv = setInterval(_ => led.writeSync(led.readSync() ^ 1), 300);

// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(iv); // Stop blinking
  led.writeSync(0);
  led.unexport();    // Unexport GPIO and free resources
}, 10000);
