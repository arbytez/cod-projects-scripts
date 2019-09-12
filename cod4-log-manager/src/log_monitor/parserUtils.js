exports.getLogEventAction = action => {
  switch (true) {
    case action.startsWith('D;'):
      return 'damage';
    case action.startsWith('K;'):
      return 'kill';
    case action.startsWith('J;'):
      return 'join';
    case action.startsWith('Q;'):
      return 'quit';
    case action.startsWith('say;'):
      return 'say';
    case action.startsWith('sayteam;'):
      return 'sayteam';
    case action.startsWith('Weapon;'):
      return 'weapon';
    case action.startsWith('InitGame:'):
      return 'nextmap';
    case action.startsWith('ShutdownGame:'):
      return 'exitmap';
    case action.startsWith('ExitLevel: executed'):
      return 'mapend';
    case action.startsWith('VD;'):
      return 'vehicledamage';
    case action.startsWith('AD;'):
      return 'actordamage';
    case action.startsWith('JT;'):
      return 'jointeam';
    case action.startsWith('T;'):
      return 'tie';
    case action.startsWith('W;'):
      return 'win';
    case action.startsWith('L;'):
      return 'loss';
    case action.startsWith('FC;'):
      return 'flagcaptured';
    case action.startsWith('FT;'):
      return 'flagtaken';
    case action.startsWith('FR;'):
      return 'flagreturned';
    case action.startsWith('RC;'):
      return 'hqcaptures';
    case action.startsWith('RD;'):
      return 'hqdestroyed';
    case action.startsWith('BP;'):
      return 'bombplanted';
    case action.startsWith('BD;'):
      return 'bombdefused';
    case action.startsWith('A;'):
      return 'action';

    default:
      return 'unknown';
  }
};

exports.parseParts = (line, action) => {
  let parts = null;
  switch (action) {
    case 'damage':
    case 'weapon':
    case 'kill':
    case 'join':
    case 'quit':
    case 'vehicledamage':
    case 'actordamage':
    case 'jointeam':
    case 'tie':
    case 'win':
    case 'loss':
    case 'flagcaptured':
    case 'flagtaken':
    case 'flagreturned':
    case 'hqcaptures':
    case 'hqdestroyed':
    case 'bombplanted':
    case 'bombdefused':
    case 'action':
      parts = line.split(';');
      return parts;
    case 'say':
    case 'sayteam':
      parts = line.split(';', 5);
      if (parts[4][0] === String.fromCharCode(21)) {
        parts[4] = parts[4].substr(1);
      }
      return parts;
    case 'mapend':
    case 'exitmap':
      return [];
    case 'nextmap':
      const explode = line.split('\\');
      parts = {};
      for (let i = 1; i < explode.length; i += 2) {
        parts[explode[i]] = explode[i + 1];
      }
      return parts;
    case 'unknown':
    default:
      return [];
  }
};
