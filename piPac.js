const mcp23017 = require('node-mcp23017'), // sur la carte K1-K16 -> un état haut (1) -> relais éteint NO -> tète thermostatique ouverte -> chauffe
      mcp = new mcp23017({ address: 0x20, device: '/dev/i2c-1', debug: false }), 
      fs = require('fs'), Gpio = require('onoff').Gpio,
      maxPACenInterval = 54000000,
      maxAlphaTimeout  = 30000,
      ledBlinkTimeout  = 500,
      resCircuTimeout  = 300000;    

class pacStatus {
    constructor() { 
        this.api = "piPac";          
        this.autoPac = false; 
        this.pac = false; 
        this.circulateurs = false; 
        this.circuBouteille = false; 
        this.circuPac = false; 
        this.circuResistance = false; 
        this.semaine = true; 
        this.weekend = false; 
        this.etage = false;     
        this.sam = true; 
        this.cuisine = true; 
        this.salon = true; 
        this.sdb = true; 
        this.cac = true; 
        this.caPierre = false;
        this.caJulien = false;
        this.sdj = false;
        this.sdd = false;
        this.couloir = false;
        this.bureau = true;
        this.dressing = true;
        this.alpha = 0;
        this.temp = 0;
        this.bouInTemp = 0;
        this.bouOutTemp = 0;
        this.pacInTemp = 0;
        this.pacOutTemp = 0;
        this.resInTemp = 0;
        this.resOutTemp = 0;
        this.resPower = 0;
        this.consignes = require('./consignes.json');        
    }
}      

class piPac { 
    constructor() { 
        this.pacStatus = new pacStatus();      
        this.duration = process.hrtime();
        this.ledTimeout = process.hrtime();
        this.alphaTimeout = process.hrtime();
        this.hashTimeout = process.hrtime();
        this.resTimeout = process.hrtime();    
        this.PACenTimer = process.hrtime();        
        this.led = new Gpio(20, 'out'); this.led.writeSync(0);
        this.hash = new Gpio(21, 'out'); this.hash.writeSync(0);
        this.mcpInit(); 
        this.handle(); 
    }   
    stop() { this.led.unexport(); this.hash.unexport(); this.weekend(); this.circulateursOn(); } 
    handle() {
        this.duration = process.hrtime(this.PACenTimer); this.duration = this.duration[0] * 1000 + this.duration[1] / 1000000;
        if (this.pacStatus.pac && this.duration > maxPACenInterval) pacOff();        
        if (this.pacStatus.autoPac) {
            const d = new Date(), t = ("0"+d.getHours()).substr(-2) + ("0"+d.getMinutes()).substr(-2); 
            //if (t>this.pacStatus.consignes.circulateurOn && t<this.pacStatus.consignes.circulateurOff) this.circulateursOn(); else this.circulateursOff();        
        }        
    }
    hacheur() {
        if (this.pacStatus.alpha == 0) {
            this.hash.writeSync(0);
            this.duration = process.hrtime(this.ledTimeout); this.duration = this.duration[0] * 1000 + this.duration[1] / 1000000;
            if (this.duration > ledBlinkTimeout) {                
                this.led.writeSync(this.led.readSync() ^ 1);    
                this.ledTimeout = process.hrtime();                
            }
            this.duration = process.hrtime(this.resTimeout); this.duration = this.duration[0] * 1000 + this.duration[1] / 1000000;
            if (this.duration > resCircuTimeout) {                
                //this.circulateurResOff();
                this.resTimeout = process.hrtime();                
            }

        } else {
            this.duration = process.hrtime(this.alphaTimeout); this.duration = this.duration[0] * 1000 + this.duration[1] / 1000000;
            if (this.duration > maxAlphaTimeout) this.pacStatus.alpha = 0;
            else {
                //this.circulateurResOn();
                //this.circulateurBoutOn();
                this.resTimeout = process.hrtime();  
                this.duration = process.hrtime(this.hashTimeout); this.duration = this.duration[0] * 1000 + this.duration[1] / 1000000;
                if (this.duration > this.pacStatus.alpha*100) {
                    this.hash.writeSync(this.hash.readSync() ^ 1);    
                    this.led.writeSync(this.led.readSync() ^ 1);                     
                    this.hashTimeout = process.hrtime();                    
                }
            }
        }
    }
    setAlpha(value)      { this.pacStatus.alpha = value; this.alphaTimeout = process.hrtime(); return this.pacStatus; }    
    getStatus()          { return this.pacStatus; }
    setConsignes(value)  { this.pacStatus.consignes = value; this.writeConsignes(); return "Ok"; } 
    getConsignes()       { this.pacStatus.consignes = require('./consignes.json'); return this.pacStatus.consignes; }
    writeConsignes()     { fs.writeFile('./consignes.json', this.pacStatus.consignes, (err) => { if (err) console.log(err); }); }     
    mcpInit()            { for (var i = 0; i < 16; i++) { mcp.pinMode(i, mcp.OUTPUT); mcp.digitalWrite(i, 1); }}
    AutoPacOn()          { this.pacStatus.autoPac=true; } 
    AutoPacOff()         { this.pacStatus.autoPac=false; }     
    pacOn()              { this.pacStatus.pac=true; mcp.digitalWrite(4 , 0); this.circulateurPacOn(); this.circulateurBoutOn(); this.PACenTimer = process.hrtime(); } // NO/NC not 220V
    pacOff()             { this.pacStatus.pac=false; mcp.digitalWrite(4 , 1); } // NO/NC not 220V     
    circulateurPacOn()   { this.pacStatus.circuPac=true; mcp.digitalWrite(15, 1); this.testCircu(); }
    circulateurPacOff()  { this.pacStatus.circuPac=false; mcp.digitalWrite(15, 0); this.testCircu(); }    
    circulateurBoutOn()  { this.pacStatus.circuBouteille=true; mcp.digitalWrite(7 , 1); this.testCircu(); }
    circulateurBoutOff() { this.pacStatus.circuBouteille=false; mcp.digitalWrite(7 , 0); this.testCircu(); }    
    circulateurResOn()   { this.pacStatus.circuResistance=true; mcp.digitalWrite(11, 1); this.testCircu(); } // Inutilisé actuellement -> NO/NC not 220V -> Circulateur Resistance 7K 
    circulateurResOff()  { this.pacStatus.circuResistance=false; mcp.digitalWrite(11, 0); this.testCircu(); } // Inutilisé actuellement -> NO/NC not 220V -> Circulateur Resistance 7K      
    circulateursOn()     { this.pacStatus.circulateurs=true; this.circulateurPacOn();  this.circulateurBoutOn(); }    
    circulateursOff()    { this.pacStatus.circulateurs=false; this.circulateurPacOff(); this.circulateurBoutOff(); } 
    testCircu()          { if (this.pacStatus.circuPac && this.pacStatus.circuBouteille) this.pacStatus.circulateurs = true; else this.pacStatus.circulateurs = false; }    
    wseOff()             { this.pacStatus.weekend = false; this.pacStatus.semaine = false; this.pacStatus.etage = false; }    
    samOn()              { this.wseOff(); this.pacStatus.sam = true; mcp.digitalWrite(10, 1); }
    samOff()             { this.wseOff(); this.pacStatus.sam = false; mcp.digitalWrite(10, 0); }
    cuisineOn()          { this.wseOff(); this.pacStatus.cuisine = true; mcp.digitalWrite(8 , 1); }
    cuisineOff()         { this.wseOff(); this.pacStatus.cuisine = false; mcp.digitalWrite(8 , 0); }
    salonOn()            { this.wseOff(); this.pacStatus.salon = true; mcp.digitalWrite(6 , 1); }
    salonOff()           { this.wseOff(); this.pacStatus.salon = false; mcp.digitalWrite(6 , 0); }    
    sdbOn()              { this.wseOff(); this.pacStatus.sdb = true; mcp.digitalWrite(9 , 1); }
    sdbOff()             { this.wseOff(); this.pacStatus.sdb = false; mcp.digitalWrite(9 , 0); }
    cacOn()              { this.wseOff(); this.pacStatus.cac = true; mcp.digitalWrite(5 , 1); }
    cacOff()             { this.wseOff(); this.pacStatus.cac = false; mcp.digitalWrite(5 , 0); }
    caPierreOn()         { this.wseOff(); this.pacStatus.caPierre = true; mcp.digitalWrite(12, 0); }
    caPierreOff()        { this.wseOff(); this.pacStatus.caPierre = false; mcp.digitalWrite(12, 1); }
    caJulienOn()         { this.wseOff(); this.pacStatus.caJulien = true; mcp.digitalWrite(3 , 0); }
    caJulienOff()        { this.wseOff(); this.pacStatus.caJulien = false; mcp.digitalWrite(3 , 1); }
    sdjOn()              { this.wseOff(); this.pacStatus.sdj = true; mcp.digitalWrite(2 , 0); }
    sdjOff()             { this.wseOff(); this.pacStatus.sdj = false; mcp.digitalWrite(2 , 1); }
    sddOn()              { this.wseOff(); this.pacStatus.sdd = true; mcp.digitalWrite(13, 0); }
    sddOff()             { this.wseOff(); this.pacStatus.sdd = false; mcp.digitalWrite(13, 1); }
    couloirOn()          { this.wseOff(); this.pacStatus.couloir = true; mcp.digitalWrite(1 , 0); }
    couloirOff()         { this.wseOff(); this.pacStatus.couloir = false; mcp.digitalWrite(1 , 1); }    
    bureauOn()           { this.wseOff(); this.pacStatus.bureau = true; mcp.digitalWrite(14, 1); }
    bureauOff()          { this.wseOff(); this.pacStatus.bureau = false; mcp.digitalWrite(14, 0); }
    dressingOn()         { this.wseOff(); this.pacStatus.dressing = true; mcp.digitalWrite(0 , 1); }
    dressingOff()        { this.wseOff(); this.pacStatus.dressing = false; mcp.digitalWrite(0 , 0); }
    weekend()  { 
        this.pacStatus.weekend = true;
        this.pacStatus.semaine = false;
        this.pacStatus.etage = false;
        this.samOn();
        this.cuisineOn();        
        this.salonOn();
        this.sdbOn();
        this.cacOn();
        this.bureauOn();
        this.dressingOn();
        this.caPierreOn();
        this.caJulienOn();
        this.sdjOn();     
        this.sddOn();     
        this.couloirOn();             
    }   
    semaine() {
        this.pacStatus.weekend = false;
        this.pacStatus.semaine = true;
        this.pacStatus.etage = false;
        this.samOn();
        this.cuisineOn();        
        this.salonOn();
        this.sdbOn();
        this.cacOn();
        this.bureauOn();
        this.dressingOn();
        this.caPierreOff();
        this.caJulienOff();
        this.sdjOff();     
        this.sddOff();     
        this.couloirOff(); 
    }
    etage() {
        this.pacStatus.weekend = false;
        this.pacStatus.semaine = false;
        this.pacStatus.etage = true;
        this.samOff();
        this.cuisineOff();        
        this.salonOff();
        this.sdbOff();
        this.cacOff();
        this.bureauOff();
        this.dressingOff();
        this.caPierreOn();
        this.caJulienOff();
        this.sdjOn();     
        this.sddOn();     
        this.couloirOn(); 
    }            
} module.exports = piPac;
