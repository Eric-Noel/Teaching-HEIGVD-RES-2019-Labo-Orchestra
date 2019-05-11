const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5';
const PROTOCOL_PORT = 2205;

/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams
 */
const s = dgram.createSocket('udp4');

const instruments = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
};

function Musician(instrument) {
  this.instrument = instrument;

  function play() {
    const message = Buffer.from(instruments[instrument]);
    s.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS,
      (err, bytes) => {
        console.log(`Sending payload: ${instrument} via port ${s.address().port}`);
      });
    console.log(instruments[instrument]);
  }

  setInterval(play.bind(this), 1000);
}


const instrument = process.argv[2];

const musician = new Musician(instrument);
