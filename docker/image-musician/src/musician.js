const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5';
const PROTOCOL_PORT = 2205;

const uuidv4 = require('uuid/v4');

const dgram = require('dgram');

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
  this.uuid = uuidv4();

  function play() {
    const musicianplaying = {
      uuid: this.uuid,
      sound: instruments[instrument],
    };
    const payload = JSON.stringify(musicianplaying);
    const message = Buffer.from(payload);
    s.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS,
      () => {
        console.log(`Sending payload: ${message} via port ${s.address().port}`);
      });
    console.log(`${message}`);
  }

  setInterval(play.bind(this), 1000);
}


const instrument = process.argv[2];
const musician = new Musician(instrument);
