
voir https://www.npmjs.com/package/node-mcp23017

sudo modprobe i2c-bcm2708
sudo chmod o+rw /dev/i2c*

var MCP23017 = require('node-mcp23017');
 
var mcp = new MCP23017({
  address: 0x20, //default: 0x20
  device: '/dev/i2c-1', // '/dev/i2c-1' on model B | '/dev/i2c-0' on model A
  debug: true //default: false
});
 
/*var MCP23017 = require('node-mcp23017');
 
var mcp = new MCP23017({
  address: 0x20, //default: 0x20
  device: '/dev/i2c-1', // '/dev/i2c-1' on model B | '/dev/i2c-0' on model A
  debug: true //default: false
});
 
/*
  By default all GPIOs are defined as INPUTS.
  You can set them all the be OUTPUTs by using the pinMode-Methode (see below),
  You can also disable the debug option by simply not passing it to the constructor
  or by setting it to false
*/
 
//set all GPIOS to be OUTPUTS
for (var i = 0; i < 16; i++) {
    mcp.pinMode(i, mcp.OUTPUT);
    //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
    //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
  }
   
  mcp.digitalWrite(0, mcp.HIGH); //set GPIO A Pin 0 to state HIGH
  mcp.digitalWrite(0, mcp.LOW); //set GPIO A Pin 0 to state LOW
   
  /*
    to read an input use the following code-block.
    This reads pin Nr. 0 (GPIO A Pin 0)
    value is either false or true
  */
  mcp.digitalRead(0, function (err, value) {
    console.log('Pin 0', value);
  });

/*  
  By default all GPIOs are defined as INPUTS.
  You can set them all the be OUTPUTs by using the pinMode-Methode (see below),
  You can also disable the debug option by simply not passing it to the constructor
  or by setting it to false
*/
 
//set all GPIOS to be OUTPUTS
for (var i = 0; i < 16; i++) {
  mcp.pinMode(i, mcp.OUTPUT);
  //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
  //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
}
 
mcp.digitalWrite(0, mcp.HIGH); //set GPIO A Pin 0 to state HIGH
mcp.digitalWrite(0, mcp.LOW); //set GPIO A Pin 0 to state LOW
 
/*
  to read an input use the following code-block.
  This reads pin Nr. 0 (GPIO A Pin 0)
  value is either false or true
*/
mcp.digitalRead(0, function (err, value) {
  console.log('Pin 0', value);
});
