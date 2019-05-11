const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5';
const PROTOCOL_PORT = 2205;

const dgram = require('dgram');

const moment = require('moment');

const s = dgram.createSocket('udp4');

const net = require('net');

const sounds = {
  'ti-ta-ti': 'piano',
  pouet: 'trumpet',
  trulu: 'flute',
  'gzi-gzi': 'violin',
  'boum-boum': 'drum',
};

const musiciansList = new Map();

s.bind(PROTOCOL_PORT, () => {
  console.log('Joining multicast group');
  s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

s.on('message', (msg, source) => {
  console.log(`Data has arrived: ${msg}. Source port: ${source.port}`);
  const m = JSON.parse(msg);

  if (musiciansList.has(m.uuid)) {
    musiciansList.get(m.uuid).lastSound = moment().toISOString();
  } else {
    musiciansList.set(m.uuid, {
      instrument: sounds[m.sound],
      firstSound: moment().toISOString(),
      lastSound: moment().toISOString(),
    });
  }

  const TcpServ = net.createServer();
  TcpServ.listen(PROTOCOL_PORT);
  TcpServ.on('connection', (TcpSocket) => {
    const informations = [];
    musiciansList.forEach((mu, ke) => {
      const musicianInfo = {
        uuid: ke,
        instrument: mu.instrument,
        activeSince: mu.firstSound,
      };
      informations.push(musicianInfo);
    });

    TcpSocket.write(JSON.stringify(informations));
    TcpSocket.write('\r\n');
    TcpSocket.end();
  });
});
