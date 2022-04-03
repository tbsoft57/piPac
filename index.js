// Copier le fichier pac.service --> /lib/systemd/system PUIS sudo systemctl enable pac ET sudo service pac start
// service pac start
// service pac restart
// service pac stop
// service pac status
// journalctl -u pac
const express = require('express'), app = express(), 
      cors = require('cors'),
      piPac = require('./piPac.js'), pac = new piPac(), 
      handleTimeout = 10, PORT = 4200,
      allowedOrigins = ['http://192.168.0.22:3500', 'http://photowatt.tbsoft.fr'];

app.use(express.urlencoded({ extended: true })).
use(express.json()).
use(cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1) return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      return callback(null, true);
    }
  })).
use(express.static(__dirname + '/static', {extensions:['html']})).
get("/PacOn"       , (req, res) => { console.log("/PacOn");       pac.pacOn();   res.json(pac.getStatus()); }).
get("/PacOff"      , (req, res) => { console.log("/PacOff");      pac.pacOff();  res.json(pac.getStatus()); }).
get("/AutoPacOn"   , (req, res) => { console.log("/AutoPacOn");   pac.AutoPacOn(); res.json(pac.getStatus()); }).
get("/AutoPacOff"  , (req, res) => { console.log("/AutoPacOff");  pac.AutoPacOff(); res.json(pac.getStatus()); }).
get("/CircuOn"     , (req, res) => { console.log("/CircuOn");     pac.circulateursOn();   res.json(pac.getStatus()); }).
get("/CircuOff"    , (req, res) => { console.log("/CircuOff");    pac.circulateursOff();  res.json(pac.getStatus()); }).
get("/CircuBOn"    , (req, res) => { console.log("/CircuBOn");    pac.circulateurBoutOn();   res.json(pac.getStatus()); }).
get("/CircuBOff"   , (req, res) => { console.log("/CircuBOff");   pac.circulateurBoutOff();  res.json(pac.getStatus()); }).
get("/CircuPOn"    , (req, res) => { console.log("/CircuPOn");    pac.circulateurPacOn();   res.json(pac.getStatus()); }).
get("/CircuPOff"   , (req, res) => { console.log("/CircuPOff");   pac.circulateurPacOff();  res.json(pac.getStatus()); }).
get("/CircuROn"    , (req, res) => { console.log("/CircuROn");    pac.circulateurResOn();   res.json(pac.getStatus()); }).
get("/CircuROff"   , (req, res) => { console.log("/CircuROff");   pac.circulateurResOff();  res.json(pac.getStatus()); }).
get("/Semaine"     , (req, res) => { console.log("/Semaine");     pac.semaine(); res.json(pac.getStatus()); }).
get("/Weekend"     , (req, res) => { console.log("/Weekend");     pac.weekend(); res.json(pac.getStatus()); }).
get("/Etage"       , (req, res) => { console.log("/Etage");       pac.etage(); res.json(pac.getStatus()); }).
get("/samOn"       , (req, res) => { console.log("/samOn");       pac.samOn(); res.json(pac.getStatus()); }).
get("/samOff"      , (req, res) => { console.log("/samOff");      pac.samOff(); res.json(pac.getStatus()); }).
get("/cuisineOn"   , (req, res) => { console.log("/cuisineOn");   pac.cuisineOn(); res.json(pac.getStatus()); }).
get("/cuisineOff"  , (req, res) => { console.log("/cuisineOff");  pac.cuisineOff(); res.json(pac.getStatus()); }).
get("/salonOn"     , (req, res) => { console.log("/salonOn");     pac.salonOn(); res.json(pac.getStatus()); }).
get("/salonOff"    , (req, res) => { console.log("/salonOff");    pac.salonOff(); res.json(pac.getStatus()); }).
get("/sdbOn"       , (req, res) => { console.log("/sdbOn");       pac.sdbOn(); res.json(pac.getStatus()); }).
get("/sdbOff"      , (req, res) => { console.log("/sdbOff");      pac.sdbOff(); res.json(pac.getStatus()); }).
get("/cacOn"       , (req, res) => { console.log("/cacOn");       pac.cacOn(); res.json(pac.getStatus()); }).
get("/cacOff"      , (req, res) => { console.log("/cacOff");      pac.cacOff(); res.json(pac.getStatus()); }).
get("/caPierreOn"  , (req, res) => { console.log("/caPierreOn");  pac.caPierreOn(); res.json(pac.getStatus()); }).
get("/caPierreOff" , (req, res) => { console.log("/caPierreOff"); pac.caPierreOff(); res.json(pac.getStatus()); }).
get("/caJulienOn"  , (req, res) => { console.log("/caJulienOn");  pac.caJulienOn(); res.json(pac.getStatus()); }).
get("/caJulienOff" , (req, res) => { console.log("/caJulienOff"); pac.caJulienOff(); res.json(pac.getStatus()); }).
get("/sdjOn"       , (req, res) => { console.log("/sdjOn");       pac.sdjOn(); res.json(pac.getStatus()); }).
get("/sdjOff"      , (req, res) => { console.log("/sdjOff");      pac.sdjOff(); res.json(pac.getStatus()); }).
get("/sddOn"       , (req, res) => { console.log("/sddOn");       pac.sddOn(); res.json(pac.getStatus()); }).
get("/sddOff"      , (req, res) => { console.log("/sddOff");      pac.sddOff(); res.json(pac.getStatus()); }).
get("/couloirOn"   , (req, res) => { console.log("/couloirOn");   pac.couloirOn(); res.json(pac.getStatus()); }).
get("/couloirOff"  , (req, res) => { console.log("/couloirOff");  pac.couloirOff(); res.json(pac.getStatus()); }).
get("/bureauOn"    , (req, res) => { console.log("/bureauOn");    pac.bureauOn(); res.json(pac.getStatus()); }).
get("/bureauOff"   , (req, res) => { console.log("/bureauOff");   pac.bureauOff(); res.json(pac.getStatus()); }).
get("/dressingOn"  , (req, res) => { console.log("/dressingOn");  pac.dressingOn(); res.json(pac.getStatus()); }).
get("/dressingOff" , (req, res) => { console.log("/dressingOff"); pac.dressingOff(); res.json(pac.getStatus()); }).
get("/setAlpha"    , (req, res) => { console.log("/setAlpha");    res.json(pac.setAlpha(+req.query.value)); }).
get("/getStatus"   , (req, res) => { console.log("/getStatus");   res.json(pac.getStatus()); }).
get("/Consignes"   , (req, res) => { console.log("/get Consignes"); res.json(pac.getConsignes()); }).
post("/Consignes"  , (req, res) => { console.log("/set Consignes"); res.end(pac.setConsignes(JSON.parse(req.body.consignes))); }).

listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    process.once('SIGTERM', function (code) { console.log('SIGTERM received...'); pac.stop(); });    
    setInterval(() => pac.handle(), handleTimeout * 1000);    
    setInterval(() => pac.hacheur(), 0);       
});
