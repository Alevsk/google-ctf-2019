const https = require('https');

const away = 'away';
const too_fast = 'too fast';
const closer = 'closer';
const directions = [[1,0], [-1, 0], [0, 1], [0, -1]];

let token = 'gAAAAABdRm92XMLi7znF548k-NyMvH-tBIX5USH3-ZMDfyphU-dEXtr1fZAFOGo_1Urzq3Fw7sGkurFJeUe6K7aU8N-9JmAZvPNWgtNLGUWm1wAhZfpwRUDxARwOll3MctmoMx_cemZT';
let lat = 51.49203;
let long = -0.19285000000000452;
let speed = 0.0001;
let slp = 10;
let i = 0;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds * 1000){
      break;
    }
  }
}

const drive = (lat, long, token) => new Promise((resolve, reject) => {
	const url = `https://drivetothetarget.web.ctfcompetition.com/?lat=${lat}&lon=${long}&token=${token}`;
	console.log('====================================================================================');
	https.get(url, (resp) => {
	  let data = '';

	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	  	// console.log(data);
	  	// console.log(data.match(/<p>([^<]+)<\/p>/));
		const message =  data.match(/<p>([^<]+)<\/p>/)[1];
		const lat =  data.match(/name="lat" value="([^<]+)" min=/)[1];
		const long =  data.match(/name="lon" value="([^<]+)" min=/)[1];
		const token =  data.match(/name="token" value="([^<]+)"/)[1];

		console.log('message', message);
		console.log('lat', lat);
		console.log('long', long);
		console.log('token', token);

		
		let hint = null

		if (message.includes(away)) {
			hint = away;
		} else if (message.includes(too_fast)) {
			hint = too_fast;
		} else if (message.includes(closer)) {
			hint = closer;
		} else {
			return resolve({ hint, lat, long , token });
			// return process.exit()
		}

		resolve({ hint, lat, long , token, data });

	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

const run = async () => {

	let data = await drive(lat, long, token);

	while (true) {
		// console.log('old ...', lat, long, token);
		lat = parseFloat(data.lat) + directions[i % 4][0] * speed;
		long = parseFloat(data.long) + directions[i % 4][1] * speed;
		token = data.token
		// console.log('new ...', lat, long, token);
		data = await drive(lat, long, token);
		switch (data.hint) {
			case away: {
				i += 1;
				speed = 0.0001;
				sleep(0.5);
				break;
			}
			case closer: {
				speed = 0.00015;
				sleep(0.8);
				break;
			}
			case too_fast: {
				sleep(0.5)
				break;
			}
			default:
				return process.exit()
		}
	}

}

run();
