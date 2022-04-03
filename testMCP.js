const MCP23017 = require('node-mcp23017'), mcp = new MCP23017({ address: 0x20, device: '/dev/i2c-1', debug: false })
            
for (var i = 0; i < 16; i++) mcp.pinMode(i, mcp.OUTPUT);
for (var i = 0; i < 16; i++) mcp.digitalWrite(i, 0);
