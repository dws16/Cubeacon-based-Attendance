const Noble = require("noble");
const mysql = require('mysql');

const connection = mysql.createConnection({
 host: 'localhost',
 user: 'jsn',
 password: '1234asdf',
 database: 'jsn' 
});

const BeaconScanner = require("node-beacon-scanner");

var scanner = new BeaconScanner();
xmlhttp = new XMLHttpRequest();

scanner.onadvertisement = (advertisement) => {
    var beacon = advertisement["iBeacon"];
    beacon.rssi = advertisement["rssi"];
    //console.log(JSON.stringify(beacon, null, "    "))

    //cek absensi mahasiswa
	var uuid ={uuid:beacon.uuid};
	connection.query('SELECT nrp FROM mahasiswa WHERE ?',uuid, function (err, result, field) {
	    	jumlahMhs = result.length;
		nrp = result[0].nrp;
	    	if(jumlahMhs>0){
			nrp={nrp:nrp};
			connection.query('SELECT * FROM absen WHERE ? ',nrp, function (err, result) {
		    		sudahAbsen = result.length;
				if(sudahAbsen<1){
					insert={nrp:nrp, timestamp:new Date()}
					connection.query('INSERT INTO absen SET ?', nrp);
					console.log(insert);
				}
			});
		}
    	});
};

scanner.startScan().then(() => {
    console.log("Scanning for BLE devices...")  ;
}).catch((error) => {
    console.error(error);
});