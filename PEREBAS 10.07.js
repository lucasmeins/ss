// Stats: "Auth" : '["0-Games", "1-Wins", "2-Draws", "3-Losses", "4-Winrate", "5-Goals", "6-Assists", "7-GK", "8-CS", "9-CS%", "10-Role", "11-Nick"]'

/* VARIABLES */

/* ROOM */

const roomName = "🔥 FMT 🔥| PEREBAS | X3";
const botName = "🔥";
const maxPlayers = 25;
const roomPublic = true;
const geo = {
  code: "BR",
  lat: -20,
  lon: -47,
};

class Pix {
  constructor(pixKey, description, merchantName, merchantCity, txid, amount) {
    this.pixKey = pixKey;
    this.description = description;
    this.merchantName = merchantName;
    this.merchantCity = merchantCity;
    this.txid = txid;
    this.amount = amount.toFixed(2);

    this.ID_PAYLOAD_FORMAT_INDICATOR = "00";
    this.ID_MERCHANT_ACCOUNT_INFORMATION = "26";
    this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
    this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
    this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
    this.ID_MERCHANT_CATEGORY_CODE = "52";
    this.ID_TRANSACTION_CURRENCY = "53";
    this.ID_TRANSACTION_AMOUNT = "54";
    this.ID_COUNTRY_CODE = "58";
    this.ID_MERCHANT_NAME = "59";
    this.ID_MERCHANT_CITY = "60";
    this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
    this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
    this.ID_CRC16 = "63";
  }

  _getValue(id, value) {
    const size = String(value.length).padStart(2, "0");
    return id + size + value;
  }

  _getMechantAccountInfo() {
    const gui = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI,
      "br.gov.bcb.pix"
    );
    const key = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY,
      this.pixKey
    );
    const description = this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION,
      this.description
    );

    return this._getValue(
      this.ID_MERCHANT_ACCOUNT_INFORMATION,
      gui + key + description
    );
  }

  _getAdditionalDataFieldTemplate() {
    const txid = this._getValue(
      this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,
      this.txid
    );
    return this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
  }

  getPayload() {
    const payload =
      this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR, "01") +
      this._getMechantAccountInfo() +
      this._getValue(this.ID_MERCHANT_CATEGORY_CODE, "0000") +
      this._getValue(this.ID_TRANSACTION_CURRENCY, "986") +
      this._getValue(this.ID_TRANSACTION_AMOUNT, this.amount) +
      this._getValue(this.ID_COUNTRY_CODE, "BR") +
      this._getValue(this.ID_MERCHANT_NAME, this.merchantName) +
      this._getValue(this.ID_MERCHANT_CITY, this.merchantCity) +
      this._getAdditionalDataFieldTemplate();

    return payload + this._getCRC16(payload);
  }

  _getCRC16(payload) {
    function ord(str) {
      return str.charCodeAt(0);
    }
    function dechex(number) {
      if (number < 0) {
        number = 0xffffffff + number + 1;
      }
      return parseInt(number, 10).toString(16);
    }

    //ADICIONA DADOS GERAIS NO PAYLOAD
    payload = payload + this.ID_CRC16 + "04";

    //DADOS DEFINIDOS PELO BACEN
    let polinomio = 0x1021;
    let resultado = 0xffff;
    let length;

    //CHECKSUM
    if ((length = payload.length) > 0) {
      for (let offset = 0; offset < length; offset++) {
        resultado ^= ord(payload[offset]) << 8;
        for (let bitwise = 0; bitwise < 8; bitwise++) {
          if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
          resultado &= 0xffff;
        }
      }
    }

    //RETORNA CÓDIGO CRC16 DE 4 CARACTERES
    return this.ID_CRC16 + "04" + dechex(resultado).toUpperCase();
  }
}

// store the both teams uniforms
const uniUsing = {
  red: null,
  blue: null,
};

// create a object containing all the uniforms, with its command and the code to be used in the game
const uniformes = {
  // 90, 0x8c6d29, [0x222e4a]
  
  
  //Uniformes Exclusivos//
//nfl//

"!ari": {
    name: "ARIZONA CARDINALS",
    angle: 60,
    fontColor: 0xcbcdd8,
    backgroundColor: [0x7E2231],
  },

"!bal": {
    name: "BALTIMORE RAVENS",
    angle: 60,
    fontColor: 0xd4d4e1,
    backgroundColor: [0x413863],
  },

"!buf": {
    name: "BUFFALO BILLS",
    angle: 60,
    fontColor: 0xd4d4e1,
    backgroundColor: [0x2C3C7A],
  },

"!chi": {
    name: "CHICAGO BEARS",
    angle: 60,
    fontColor: 0xbfc3bd,
    backgroundColor: [0xE15A38],
  },

"!pat": {
    name: "PATRIOTS",
    angle: 60,
    fontColor: 0xd2d6e1,
    backgroundColor: [0x252E41],
  },


  // Brasileirão //

 "!fla": {
  name: "Flamengo",
  angle: 90,
  fontColor: 0xFFFFFF,
  backgroundColor: [0xFF0505, 0x000000, 0xFF0505],
},

"!bot": {
  name: "Botafogo",
  angle: 50,
  fontColor: 0xFFFFFF,
  backgroundColor: [0x000000, 0x000000, 0x000000],
},

"!pal": {
  name: "Palmeiras",
  angle: 90,
  fontColor: 0x877D77,
  backgroundColor: [0x006400, 0xFFFFFF, 0x006400],
},

"!flu": {
  name: "Fluminense",
  angle: 0,
  fontColor: 0xB8A64D,
  backgroundColor: [0x215E21, 0xFFFAFA, 0xA62A2A],
},

"!apr": {
  name: "Athletico Paranaense",
  angle: 40,
  fontColor: 0xFFFFFF,
  backgroundColor: [0x000000, 0xFF0000, 0x000000],
},

"!cru": {
  name: "Cruzeiro",
  angle: 0,
  fontColor: 0xFFFFFF,
  backgroundColor: [0x0C2DD1, 0x0C2DD1, 0x0C2DD1],
},

"!for": {
  name: "Fortaleza",
  angle: 90,
  fontColor: 0xFFFFFF,
  backgroundColor: [0xFF2929, 0x1C3AFF, 0xFF2929],
},

"!sao": {
  name: "São Paulo",
  angle: 90,
  fontColor: 0xFFDB78,
  backgroundColor: [0xFF0000, 0xFFFFFF, 0x000000],
},

"!amg": {
  name: "Atlético Mineiro",
  angle: 0,
  fontColor: 0xB33939,
  backgroundColor: [0x000000, 0xFFFFFF, 0x000000],
},

"!san": {
  name: "Santos",
  angle: 0,
  fontColor: 0x0D0404,
  backgroundColor: [0xFFFFFF, 0xFFFFFF, 0xFFFFFF],
},

"!gre": {
  name: "Gremio",
  angle: 0,
  fontColor: 0xEBEBEB,
  backgroundColor: [0x000000, 0x71ACD9, 0x000000],
},

"!int": {
  name: "Internacional",
  angle: 0,
  fontColor: 0xFFFFFF,
  backgroundColor: [0x9E0000, 0x9E0000, 0x9E0000],
},

"!bah": {
  name: "Bahia",
  angle: 0,
  fontColor: 0xFEFCFF,
  backgroundColor: [0xFF1F0F, 0x2E50FF, 0xFF1F0F],
},

"!vas": {
  name: "Vasco",
  angle: 135,
  fontColor: 0xFF0000,
  backgroundColor: [0xFFFFFF, 0x000000, 0xFFFFFF],
},

"!rbb": {
  name: "Red Bull Bragantino",
  angle: 0,
  fontColor: 0xFF0808,
  backgroundColor: [0xFFFFFF, 0xFFFFFF, 0xFFFFFF],
},

"!cor": {
  name: "Corinthians",
  angle: 0,
  fontColor: 0xFAFAFA,
  backgroundColor: [0x000000, 0x000000, 0x000000],
},

"!cui": {
  name: "Cuiabá",
  angle: 0,
  fontColor: 0xFAFAFA,
  backgroundColor: [0xFFFF2B, 0x167010, 0xFFFF2B],
},

"!goi": {
  name: "Goias",
  angle: 0,
  fontColor: 0xFAFAFA,
  backgroundColor: [0x255710, 0x255710, 0x255710],
},

"!crtb": {
  name: "Coritiba",
  angle: 90,
  fontColor: 0xFAFAFA,
  backgroundColor: [0xFFFFFF, 0x264710, 0xFFFFFF],
},

"!ame": {
  name: "América Mineiro",
  angle: 0,
  fontColor: 0xFAFAFA,
  backgroundColor: [0x2D8020, 0x000000, 0x2D8020],
},


//NBA/


"!lak": {
    name: "LAKERS",
    angle: 180,
    fontColor: 0xFFFFFF,
    backgroundColor: [0x3D227B, 0xFBB204, 0x3D227B],
  },

"!bos": {
    name: "BOSTON CELTICS",
    angle: 180,
    fontColor: 0x007940,
    backgroundColor: [0xF0E8EE],
  },

"!bull": {
    name: "CHICAGO BULLS",
    angle: 180,
    fontColor: 0x151d20,
    backgroundColor: [0xBC161A],
  },

"!cav": {
    name: "CLEVELAND CAVALIERS",
    angle: 180,
    fontColor: 0xbb9539,
    backgroundColor: [0x521D27],
  },

"!gol": {
    name: "GOLDEN STATE WARRIORS",
    angle: 180,
    fontColor: 0xfbbf16,
    backgroundColor: [0xD9E2E9],
  },

//Unis Comuns//
//CHAMPIONS//

"!nap": {
    name: "NAPOLI",
    angle: 180,
    fontColor: 0xFBFBFB,
    backgroundColor: [0x3FABEE],
  },

"!liv": {
    name: "LIVERPOOL",
    angle: 180,
    fontColor: 0xFBFBFB,
    backgroundColor: [0xB31639],
  },

"!aja": {
    name: "AJAX",
    angle: 180,
    fontColor: 0xFBFBFB,
    backgroundColor: [0xE6E6EA, 0xD80E3B, 0xE6E6EA],
  },

"!ran": {
    name: "RANGERS",
    angle: 180,
    fontColor: 0xefbc53,
    backgroundColor: [0x0062C2],
  },


"!atlm": {
    name: "ATLÉTICO DE MADRID",
    angle: 180,
    fontColor: 0xCCCCCC,
    backgroundColor: [0xD91B30, 0xF2F2F2, 0XD91B30],
  },

"!lev": {
    name: "BAYER LEVERKUSEN",
    angle: 180,
    fontColor: 0xfff1f6,
    backgroundColor: [0xB2001C],
  },

"!bru": {
    name: "CLUB BRUGGE",
    angle: 180,
    fontColor: 0xfff1f6,
    backgroundColor: [0x000000, 0x00A0E7, 0x000000],
  },

"!porto": {
    name: "PORTO",
    angle: 180,
    fontColor: 0x07a9f2,
    backgroundColor: [0x084FA9, 0xBED3EE, 0x084FA9],
  },

"!bay": {
    name: "BAYERN DE MUNIQUE",
    angle: 180,
    fontColor: 0xF2F2F2,
    backgroundColor: [0x8D1711],
  },

"!intm": {
    name: "INTER DE MILÃO",
    angle: 180,
    fontColor: 0xFFFFFF,
    backgroundColor: [0x292E53, 0x0968F7, 0x292E53],
  },

"!piz": {
    name: "VIKTORIA PIZEN",
    angle: 180,
    fontColor: 0xFFFFFF,
    backgroundColor: [0x2A6CC5, 0xC5302A, 0x2A6CC5],
  },

"!bar": {
    name: "BARCELONA",
    angle: 180,
    fontColor: 0xFFFFFF,
    backgroundColor: [0xCA4645, 0x6199D8, 0x324168],
  },

"!tot": {
    name: "TOTTENHAM",
    angle: 180,
    fontColor: 0x2b3458,
    backgroundColor: [0xF4F4FC],
  },

"!ein": {
    name: "EINTRACHT FRANKFURT",
    angle: 180,
    fontColor: 0xfafafa,
    backgroundColor: [0x282828],
  },

"!spt": {
    name: "SPORTING",
    angle: 90,
    fontColor: 0x000000,
    backgroundColor: [0x00542F, 0xE3E7E9, 0x00542F],
  },

"!oly": {
    name: "OLYMPIQUE DE MARSELHA",
    angle: 180,
    fontColor: 0xF1F1FF,
    backgroundColor: [0x02A1EC],
  },

"!che": {
    name: "CHELSEA",
    angle: 180,
    fontColor: 0xebeae6,
    backgroundColor: [0x143177],
  },

"!mil": {
    name: "MILAN",
    angle: 180,
    fontColor: 0xebeae6,
    backgroundColor: [0xDB0237, 0x222127, 0xDB0237],
  },

"!rbs": {
    name: "RB SALZBURG",
    angle: 180,
    fontColor: 0xfff5ff,
    backgroundColor: [0xF90F32],
  },

"!dnz": {
    name: "DINAMO ZAGREB",
    angle: 90,
    fontColor: 0xe7e0c3,
    backgroundColor: [0x0778AB, 0x0C577D, 0x0778AB],
  },

"!rmd": {
    name: "REAL MADRID",
    angle: 90,
    fontColor: 0x2f71cd,
    backgroundColor: [0xE4E6EA],
  },

"!rbl": {
    name: "RB LEIPZIG",
    angle: 90,
    fontColor: 0xce2637,
    backgroundColor: [0xD9DDE8],
  },

"!sha": {
    name: "SHAKTAR DONETSK",
    angle: 180,
    fontColor: 0xFFFFFF,
    backgroundColor: [0xE7550E, 0x34241F, 0xE7550E],
  },

"!cel": {
    name: "CELTICS",
    angle: 90,
    fontColor: 0xdea111,
    backgroundColor: [0x008F51, 0xF5F5F7, 0x008F51],
  },

"!cty": {
    name: "MANCHESTER CITY",
    angle: 90,
    fontColor: 0x403f56,
    backgroundColor: [0x5796CF],
  },

"!bor": {
    name: "BORUSSIA DORTMUND",
    angle: 90,
    fontColor: 0x000000,
    backgroundColor: [0xFCD32B],
  },

"!sev": {
    name: "SEVILLA",
    angle: 90,
    fontColor: 0xbcbcba,
    backgroundColor: [0x6C1A0F, 0x74160E, 0x6C1A0F],
  },

"!cop": {
    name: "COPENHAGEN FC",
    angle: 180,
    fontColor: 0xf0f5f8,
    backgroundColor: [0x22222A, 0x0254BA, 0x22222A],
  },

"!ben": {
    name: "BENFICA",
    angle: 180,
    fontColor: 0xf0f5f8,
    backgroundColor: [0xFA3944],
  },

"!psg": {
    name: "PARIS SAINT GERMAIN",
    angle: 180,
    fontColor: 0xf0f5f8,
    backgroundColor: [0x142245, 0x841013, 0x142245],
  },

"!mch": {
    name: "MACCABI HAIFA",
    angle: 180,
    fontColor: 0x101012,
    backgroundColor: [0x015539, 0xE8E4F8],
  },

};

const provoUsers = [];

const calladminTime = [];

const votedPlayers = new Set();
let votekickTimes = {};
let votekickCount = {};
var votekickTimeout = 60000;
var temp_ban_timeout = 300000;
var PlayerFound = false;
var playerList = [];
var conns = [];
var temp_banlist = [];

var recWebHook;

var roomToCode;
if (roomName.split(" ").length > 5) {
  roomToCode = roomName.split(" ")[3] + roomName.split(" ")[4];
} else roomToCode = roomName.split(" ")[3];

if (roomName === "🔥 FMT 🔥| RAPIDEX | X3") {
  recWebHook =
    "https://discord.com/api/webhooks/1084519296136392837/2geGwFFe5AhJGHkBY_Pn52PwO2hcyGsYezIEi9GmXGkxSCXNZ9gLyaDyEJVd2JYcff5h";
}
if (roomName === "🔥 FMT 🔥| PEREBAS | X3") {
  recWebHook =
    "https://discord.com/api/webhooks/1084519400863965296/aPNJ0Y-vmFq630SyanQuxMs8yOQOYoVmJLlB_2tlKbHTIeI2Drv7uZQLx0EyzctoKTNn";
}
if (roomName === "🔥 FMT 🔥| FABULOSOS | X3") {
  recWebHook =
    "https://discord.com/api/webhooks/1083886546593255586/Hid2gBpzhvS87yUHAUhU9IKi5HuL9A41xkP6Mn-ygjU0F5azRaDHAlOGvaW4NbI5JVPr";
}

if (roomName === "🔥 FMT 🔥| FAMINTOS | X4") {
  recWebHook =
    "https://discord.com/api/webhooks/1084602575464177727/-aNU83PHsgOZg67Uhq5uD-8cLdEd01erRBHlgvm46ZBq6o1K65OBWKDy_05w_5ePaeJR";
}

var teamMessageCommand = "!t";
var teamMessageColors = [0xc0c0c0, 0xe56e56, 0x5689e5];
var teamMessageFont = "bold";
var teamMessageSound = 1;

const room = HBInit({
  roomName: roomName,
  maxPlayers: maxPlayers,
  public: roomPublic,
  playerName: botName,
  geo: geo,
});

const adminPassword = "!bolsolula12";

const vipPassword = "fc_passwordxzvip";

const playersToSetVIP = 28;
const playersToSetPublic = 27;

const scoreLimitPractice = 3;
const timeLimitPractice = 3;

const scoreLimitx3 = 3;
const timeLimitx3 = 3;


const scoreLimitx4 = 1;
const timeLimitx4 = 4;

const scoreLimitx5 = 3;
const timeLimitx5 = 5;

const scoreLimitx7 = 3;
const timeLimitx7 = 7;

const frasesgoles = [
  " LAÇO LAÇO LAÇO!!!!! DO MONSTRO! É DA FERA! ",
  " GOOOOOOOOOOOLLLLLLLLLLLLLLL! AUTOR DESSA PINTURA FOI ",
  " GOOOOOOOOOOL! QUE TAPA FOI ESSE ?! FALA DA FERA! ",
  " O MONSTRO NÃO PARA 🔥🔥🔥 ",
  " GOLAÇO DE ",
  " MINHA NOSSA SENHORA!!!! O IMPOSSÍVEL ACONTECEU MEU DEUS DO CÉU!!! ",
  " QUE TIRO! ABAIXEM A CABEÇA! ",
  " Finalização com classe de",
  " QUANDO QUER ELE FAZ ATÉ CHOVER ",
];

const frasesasis = [
  " 🔥🔥 O GARÇOM FOI O ",
  " E QUE ASSISTÊNCIA FOI ESSA? FOI A FERA ",
  " PASSE DE GALA DO JOGADOR ",
  " TOQUE SUTIL DO ",
  " PASSE COM A MÃO DE ",
];

const frasesautogol = [
  "😂😂  ANIMAL DEMAIS KKKKKKKKKKKKKKKKKKKKKKKK GOL CONTRA! ",
  " 😂 SEU É PARA O OUTRO LADO KKKKKKKKKKKKKK ",
  " TROLLA MUITO!!! ",
  " INCRIVEL O QUE ESSA LENDA FAZ, MAS SERIA MELHOR SE FOSSE PARA O OUTRO LADO 😂 ",
  " PARABÉNS!! AGORA TENTA NO OUTRO GOL... ",
  " ERROU O LADO!!! 😂 ",
  " DESSE LADO NÃO CARA!!! ",
];

var isTimeAddedShown = false;
var isTimeAddedShowndos = false;
var isTimeAddedShowntres = false;
var isTimeAddedShowncuatro = false;
var isTimeAddedShowncinco = false;
var isTimeAddedShownseis = false;
var isTimeAddedShownquince = false;
var isTimeAddedShownsiete = false;
room.setTeamsLock(true);

/* STADIUM */

const playerRadius = 15;
var ballRadius = 6.25;
const triggerDistance = playerRadius + ballRadius + 0.01;

var practiceMap =
  '{"name":"FMT - x3 - Perebas","width":620,"height":270,"spawnDistance":350,"bg":{"type":"","width":550,"height":240,"kickOffRadius":80,"cornerRadius":0,"color":"343A41"},"vertexes":[{"x":550,"y":240,"trait":"ballArea"},{"x":550,"y":-240,"trait":"ballArea"},{"x":0,"y":270,"trait":"kickOffBarrier"},{"x":0,"y":80,"bCoef":0.15,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":180},{"x":0,"y":-80,"bCoef":0.15,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":180},{"x":0,"y":-270,"trait":"kickOffBarrier"},{"x":-550,"y":-80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,-80],"_data":{"mirror":{}}},{"x":-590,"y":-80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,-80],"_data":{"mirror":{}}},{"x":-590,"y":80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,80],"_data":{"mirror":{}}},{"x":-550,"y":80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,80],"_data":{"mirror":{}}},{"x":550,"y":-80,"cMask":["red","ball"],"trait":"goalNet","curve":0,"color":"8ED2AB","pos":[700,-80],"_data":{"mirror":{}}},{"x":590,"y":-80,"cMask":["red","ball"],"trait":"goalNet","curve":17.15926950149646,"color":"8ED2AB","pos":[700,-80],"_data":{"mirror":{}}},{"x":590,"y":80,"cMask":["red","ball"],"trait":"goalNet","curve":17.15926950149646,"color":"8ED2AB","pos":[700,80],"_data":{"mirror":{}}},{"x":550,"y":80,"cMask":["red","ball"],"trait":"goalNet","curve":0,"color":"8ED2AB","pos":[700,80],"_data":{"mirror":{}}},{"x":-550,"y":80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[-700,80]},{"x":-550,"y":240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":-550,"y":-80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[-700,-80]},{"x":-550,"y":-240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":-550,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false},{"x":550,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","pos":[700,80]},{"x":550,"y":240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"479BD8","vis":false},{"x":550,"y":-240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":550,"y":-80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[700,-80]},{"x":550,"y":-240,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":-240,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-550,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":550,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":0,"y":-240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"trait":"kickOffBarrier","vis":true,"color":"F8F8F8"},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"trait":"kickOffBarrier","vis":true,"color":"F8F8F8"},{"x":0,"y":80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":-180},{"x":0,"y":-80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":-180},{"x":0,"y":80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":0},{"x":0,"y":-80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":0},{"x":-557.5,"y":80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[-700,80]},{"x":-557.5,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":-557.5,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0},{"x":-557.5,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[-700,-80]},{"x":557.5,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"color":"479BD8"},{"x":557.5,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[700,-80]},{"x":557.5,"y":80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[700,80]},{"x":557.5,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":0,"y":-80,"bCoef":0.1,"trait":"line"},{"x":0,"y":80,"bCoef":0.1,"trait":"line"},{"x":-550,"y":-80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":-550,"y":80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":550,"y":-80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":550,"y":80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":-240,"y":256,"bCoef":0.1,"trait":"line"},{"x":-120,"y":256,"bCoef":0.1,"trait":"line"},{"x":-240,"y":-256,"bCoef":0.1,"trait":"line"},{"x":-120,"y":-224,"bCoef":0.1,"trait":"line"},{"x":-120,"y":-256,"bCoef":0.1,"trait":"line"},{"x":240,"y":256,"bCoef":0.1,"trait":"line"},{"x":120,"y":256,"bCoef":0.1,"trait":"line"},{"x":240,"y":-224,"bCoef":0.1,"trait":"line"},{"x":240,"y":-256,"bCoef":0.1,"trait":"line"},{"x":120,"y":-224,"bCoef":0.1,"trait":"line"},{"x":120,"y":-256,"bCoef":0.1,"trait":"line"},{"x":-381,"y":240,"bCoef":0.1,"trait":"line"},{"x":-381,"y":256,"bCoef":0.1,"trait":"line"},{"x":-550,"y":200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":-390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-550,"y":226,"bCoef":0.1,"trait":"line","curve":-90},{"x":-536,"y":240,"bCoef":0.1,"trait":"line","curve":-90},{"x":-550,"y":-200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":-390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-550,"y":-226,"bCoef":0.1,"trait":"line","curve":90},{"x":-536,"y":-240,"bCoef":0.1,"trait":"line","curve":90},{"x":-556,"y":123,"bCoef":0.1,"trait":"line"},{"x":-575,"y":123,"bCoef":0.1,"trait":"line"},{"x":556,"y":123,"bCoef":0.1,"trait":"line"},{"x":575,"y":123,"bCoef":0.1,"trait":"line"},{"x":-556,"y":-123,"bCoef":0.1,"trait":"line"},{"x":-575,"y":-123,"bCoef":0.1,"trait":"line"},{"x":556,"y":-123,"bCoef":0.1,"trait":"line"},{"x":575,"y":-123,"bCoef":0.1,"trait":"line"},{"x":-381,"y":-240,"bCoef":0.1,"trait":"line"},{"x":-381,"y":-256,"bCoef":0.1,"trait":"line"},{"x":381,"y":240,"bCoef":0.1,"trait":"line"},{"x":381,"y":256,"bCoef":0.1,"trait":"line"},{"x":381,"y":-240,"bCoef":0.1,"trait":"line"},{"x":381,"y":-256,"bCoef":0.1,"trait":"line"},{"x":550,"y":-226,"bCoef":0.1,"trait":"line","curve":-90},{"x":536,"y":-240,"bCoef":0.1,"trait":"line","curve":-90},{"x":550,"y":226,"bCoef":0.1,"trait":"line","curve":90},{"x":536,"y":240,"bCoef":0.1,"trait":"line","curve":90},{"x":550,"y":200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":550,"y":-200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-375,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":3.5,"bCoef":0.1,"trait":"line","curve":180}],"segments":[{"v0":6,"v1":7,"curve":0,"color":"B51717","cMask":["blue","ball"],"trait":"goalNet","pos":[-700,-80],"y":-80,"_data":{"mirror":{},"arc":{"a":[-550,-80],"b":[-590,-80],"curve":0}}},{"v0":7,"v1":8,"curve":0,"color":"B51717","cMask":["blue","ball"],"trait":"goalNet","x":-590,"_data":{"mirror":{},"arc":{"a":[-590,-80],"b":[-590,80],"curve":0}}},{"v0":8,"v1":9,"curve":0,"color":"B51717","cMask":["blue","ball"],"trait":"goalNet","pos":[-700,80],"y":80,"_data":{"mirror":{},"arc":{"a":[-590,80],"b":[-550,80],"curve":0}}},{"v0":10,"v1":11,"curve":0,"color":"8ED2AB","cMask":["red","ball"],"trait":"goalNet","pos":[700,-80],"y":-80,"_data":{"mirror":{},"arc":{"a":[550,-80],"b":[590,-80],"curve":0}}},{"v0":11,"v1":12,"curve":0,"color":"8ED2AB","cMask":["red","ball"],"trait":"goalNet","x":590,"_data":{"mirror":{},"arc":{"a":[590,-80],"b":[590,80],"curve":0}}},{"v0":12,"v1":13,"curve":0,"color":"8ED2AB","cMask":["red","ball"],"trait":"goalNet","pos":[700,80],"y":80,"_data":{"mirror":{},"arc":{"a":[590,80],"b":[550,80],"curve":0}}},{"v0":2,"v1":3,"trait":"kickOffBarrier"},{"v0":3,"v1":4,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.15,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":3,"v1":4,"curve":-180,"vis":true,"color":"F8F8F8","bCoef":0.15,"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":4,"v1":5,"trait":"kickOffBarrier"},{"v0":14,"v1":15,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":16,"v1":17,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":18,"v1":19,"vis":true,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":240},{"v0":20,"v1":21,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":22,"v1":23,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":24,"v1":25,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":550,"y":-240},{"v0":26,"v1":27,"curve":0,"vis":true,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":-240},{"v0":28,"v1":29,"vis":true,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"v0":30,"v1":31,"vis":true,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"v0":38,"v1":39,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-557.5},{"v0":40,"v1":41,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-557.5},{"v0":42,"v1":43,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":557.5},{"v0":44,"v1":45,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":557.5},{"v0":46,"v1":47,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":0},{"v0":48,"v1":49,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-550},{"v0":50,"v1":51,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":550},{"v0":63,"v1":64,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":65,"v1":66,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":68,"v1":67,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":69,"v1":70,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":66,"v1":70,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":72,"v1":71,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":73,"v1":74,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":75,"v1":76,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":77,"v1":78,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-123},{"v0":79,"v1":80,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-123},{"v0":81,"v1":82,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":83,"v1":84,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":85,"v1":86,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":88,"v1":87,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":90,"v1":89,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":91,"v1":92,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":93,"v1":94,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":95,"v1":96,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":390},{"v0":98,"v1":97,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":97,"v1":98,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":100,"v1":99,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":99,"v1":100,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":102,"v1":101,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":101,"v1":102,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":104,"v1":103,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":103,"v1":104,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":106,"v1":105,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":105,"v1":106,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":108,"v1":107,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":107,"v1":108,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":110,"v1":109,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":109,"v1":110,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":112,"v1":111,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":111,"v1":112,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":114,"v1":113,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":113,"v1":114,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":116,"v1":115,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":115,"v1":116,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":118,"v1":117,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":117,"v1":118,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":120,"v1":119,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":119,"v1":120,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":122,"v1":121,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":121,"v1":122,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":124,"v1":123,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":123,"v1":124,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":126,"v1":125,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":125,"v1":126,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":128,"v1":127,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":127,"v1":128,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5}],"goals":[{"p0":[-557.5,-80],"p1":[-557.5,80],"team":"red"},{"p0":[557.5,80],"p1":[557.5,-80],"team":"blue"}],"discs":[{"radius":5,"pos":[-550,80],"color":"B51717","trait":"goalPost","y":80,"_data":{"mirror":{}}},{"radius":5,"pos":[-550,-80],"color":"B51717","trait":"goalPost","y":-80,"x":-560,"_data":{"mirror":{}}},{"radius":5,"pos":[550,80],"color":"8ED2AB","trait":"goalPost","y":80,"_data":{"mirror":{}}},{"radius":5,"pos":[550,-80],"color":"8ED2AB","trait":"goalPost","y":-80,"_data":{"mirror":{}},"_selected":true},{"radius":3,"invMass":0,"pos":[-550,240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[-550,-240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[550,-240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[550,240],"color":"FFCC00","bCoef":0.1,"trait":"line"}],"planes":[{"normal":[0,1],"dist":-240,"bCoef":1,"trait":"ballArea","vis":false,"curve":0,"_data":{"extremes":{"normal":[0,1],"dist":-240,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,-240],"b":[1221,-240]}}},{"normal":[0,-1],"dist":-240,"bCoef":1,"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-240,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,240],"b":[1221,240]}}},{"normal":[1,0],"dist":-620,"bCoef":0.1,"_data":{"extremes":{"normal":[1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[-620,-298],"b":[-620,299]}}},{"normal":[-1,0],"dist":-620,"bCoef":0.1,"_data":{"extremes":{"normal":[-1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[620,-298],"b":[620,299]}}},{"normal":[1,0],"dist":-620,"bCoef":0.1,"trait":"ballArea","vis":false,"curve":0,"_data":{"extremes":{"normal":[1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[-620,-298],"b":[-620,299]}}},{"normal":[-1,0],"dist":-620,"bCoef":0.1,"trait":"ballArea","vis":false,"curve":0,"_data":{"extremes":{"normal":[-1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[620,-298],"b":[620,299]}}},{"normal":[0,-1],"dist":-269,"bCoef":1,"cMask":["red","blue","ball"],"trait":"line","_data":{"extremes":{"normal":[0,-1],"dist":-269,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,269],"b":[1221,269]},"mirror":{}}},{"normal":[0,1],"dist":-271,"bCoef":1,"cMask":["red","blue","ball"],"trait":"line","_data":{"extremes":{"normal":[0,1],"dist":-271,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,-271],"b":[1221,-271]}}}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"line":{"vis":true,"bCoef":0.1,"cMask":[""]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.084,"kickStrength":5},"ballPhysics":{"radius":6.25,"bCoef":0.4,"invMass":1.5,"damping":0.99,"color":"FF9214"},"joints":[],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}';

var x3Map =
  '{"name":"FMT - x3 - Perebas","width":620,"height":270,"spawnDistance":350,"bg":{"type":"","width":550,"height":240,"kickOffRadius":80,"cornerRadius":0,"color":"343A41"},"vertexes":[{"x":550,"y":240,"trait":"ballArea"},{"x":550,"y":-240,"trait":"ballArea"},{"x":0,"y":270,"trait":"kickOffBarrier"},{"x":0,"y":80,"bCoef":0.15,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":180},{"x":0,"y":-80,"bCoef":0.15,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":180},{"x":0,"y":-270,"trait":"kickOffBarrier"},{"x":-550,"y":-80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,-80],"_data":{"mirror":{}}},{"x":-590,"y":-80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,-80],"_data":{"mirror":{}}},{"x":-590,"y":80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,80],"_data":{"mirror":{}}},{"x":-550,"y":80,"cMask":["blue","ball"],"trait":"goalNet","curve":0,"color":"B51717","pos":[-700,80],"_data":{"mirror":{}}},{"x":550,"y":-80,"cMask":["red","ball"],"trait":"goalNet","curve":0,"color":"8ED2AB","pos":[700,-80],"_data":{"mirror":{}}},{"x":590,"y":-80,"cMask":["red","ball"],"trait":"goalNet","curve":17.15926950149646,"color":"8ED2AB","pos":[700,-80],"_data":{"mirror":{}}},{"x":590,"y":80,"cMask":["red","ball"],"trait":"goalNet","curve":17.15926950149646,"color":"8ED2AB","pos":[700,80],"_data":{"mirror":{}}},{"x":550,"y":80,"cMask":["red","ball"],"trait":"goalNet","curve":0,"color":"8ED2AB","pos":[700,80],"_data":{"mirror":{}}},{"x":-550,"y":80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[-700,80]},{"x":-550,"y":240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":-550,"y":-80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[-700,-80]},{"x":-550,"y":-240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":-550,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false},{"x":550,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","pos":[700,80]},{"x":550,"y":240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"479BD8","vis":false},{"x":550,"y":-240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":550,"y":-80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[700,-80]},{"x":550,"y":-240,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":-240,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-550,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":550,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":0,"y":-240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"trait":"kickOffBarrier","vis":true,"color":"F8F8F8"},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"trait":"kickOffBarrier","vis":true,"color":"F8F8F8"},{"x":0,"y":80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":-180},{"x":0,"y":-80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":-180},{"x":0,"y":80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":0},{"x":0,"y":-80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":0},{"x":-557.5,"y":80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[-700,80]},{"x":-557.5,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":-557.5,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0},{"x":-557.5,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[-700,-80]},{"x":557.5,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"color":"479BD8"},{"x":557.5,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[700,-80]},{"x":557.5,"y":80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[700,80]},{"x":557.5,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":0,"y":-80,"bCoef":0.1,"trait":"line"},{"x":0,"y":80,"bCoef":0.1,"trait":"line"},{"x":-550,"y":-80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":-550,"y":80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":550,"y":-80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":550,"y":80,"bCoef":0.1,"trait":"line","color":"F8F8F8"},{"x":-240,"y":256,"bCoef":0.1,"trait":"line"},{"x":-120,"y":256,"bCoef":0.1,"trait":"line"},{"x":-240,"y":-256,"bCoef":0.1,"trait":"line"},{"x":-120,"y":-224,"bCoef":0.1,"trait":"line"},{"x":-120,"y":-256,"bCoef":0.1,"trait":"line"},{"x":240,"y":256,"bCoef":0.1,"trait":"line"},{"x":120,"y":256,"bCoef":0.1,"trait":"line"},{"x":240,"y":-224,"bCoef":0.1,"trait":"line"},{"x":240,"y":-256,"bCoef":0.1,"trait":"line"},{"x":120,"y":-224,"bCoef":0.1,"trait":"line"},{"x":120,"y":-256,"bCoef":0.1,"trait":"line"},{"x":-381,"y":240,"bCoef":0.1,"trait":"line"},{"x":-381,"y":256,"bCoef":0.1,"trait":"line"},{"x":-550,"y":200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":-390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-550,"y":226,"bCoef":0.1,"trait":"line","curve":-90},{"x":-536,"y":240,"bCoef":0.1,"trait":"line","curve":-90},{"x":-550,"y":-200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":-390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-550,"y":-226,"bCoef":0.1,"trait":"line","curve":90},{"x":-536,"y":-240,"bCoef":0.1,"trait":"line","curve":90},{"x":-556,"y":123,"bCoef":0.1,"trait":"line"},{"x":-575,"y":123,"bCoef":0.1,"trait":"line"},{"x":556,"y":123,"bCoef":0.1,"trait":"line"},{"x":575,"y":123,"bCoef":0.1,"trait":"line"},{"x":-556,"y":-123,"bCoef":0.1,"trait":"line"},{"x":-575,"y":-123,"bCoef":0.1,"trait":"line"},{"x":556,"y":-123,"bCoef":0.1,"trait":"line"},{"x":575,"y":-123,"bCoef":0.1,"trait":"line"},{"x":-381,"y":-240,"bCoef":0.1,"trait":"line"},{"x":-381,"y":-256,"bCoef":0.1,"trait":"line"},{"x":381,"y":240,"bCoef":0.1,"trait":"line"},{"x":381,"y":256,"bCoef":0.1,"trait":"line"},{"x":381,"y":-240,"bCoef":0.1,"trait":"line"},{"x":381,"y":-256,"bCoef":0.1,"trait":"line"},{"x":550,"y":-226,"bCoef":0.1,"trait":"line","curve":-90},{"x":536,"y":-240,"bCoef":0.1,"trait":"line","curve":-90},{"x":550,"y":226,"bCoef":0.1,"trait":"line","curve":90},{"x":536,"y":240,"bCoef":0.1,"trait":"line","curve":90},{"x":550,"y":200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":550,"y":-200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-375,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":3.5,"bCoef":0.1,"trait":"line","curve":180}],"segments":[{"v0":6,"v1":7,"curve":0,"color":"B51717","cMask":["blue","ball"],"trait":"goalNet","pos":[-700,-80],"y":-80,"_data":{"mirror":{},"arc":{"a":[-550,-80],"b":[-590,-80],"curve":0}}},{"v0":7,"v1":8,"curve":0,"color":"B51717","cMask":["blue","ball"],"trait":"goalNet","x":-590,"_data":{"mirror":{},"arc":{"a":[-590,-80],"b":[-590,80],"curve":0}}},{"v0":8,"v1":9,"curve":0,"color":"B51717","cMask":["blue","ball"],"trait":"goalNet","pos":[-700,80],"y":80,"_data":{"mirror":{},"arc":{"a":[-590,80],"b":[-550,80],"curve":0}}},{"v0":10,"v1":11,"curve":0,"color":"8ED2AB","cMask":["red","ball"],"trait":"goalNet","pos":[700,-80],"y":-80,"_data":{"mirror":{},"arc":{"a":[550,-80],"b":[590,-80],"curve":0}}},{"v0":11,"v1":12,"curve":0,"color":"8ED2AB","cMask":["red","ball"],"trait":"goalNet","x":590,"_data":{"mirror":{},"arc":{"a":[590,-80],"b":[590,80],"curve":0}}},{"v0":12,"v1":13,"curve":0,"color":"8ED2AB","cMask":["red","ball"],"trait":"goalNet","pos":[700,80],"y":80,"_data":{"mirror":{},"arc":{"a":[590,80],"b":[550,80],"curve":0}}},{"v0":2,"v1":3,"trait":"kickOffBarrier"},{"v0":3,"v1":4,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.15,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":3,"v1":4,"curve":-180,"vis":true,"color":"F8F8F8","bCoef":0.15,"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":4,"v1":5,"trait":"kickOffBarrier"},{"v0":14,"v1":15,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":16,"v1":17,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":18,"v1":19,"vis":true,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":240},{"v0":20,"v1":21,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":22,"v1":23,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":24,"v1":25,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":550,"y":-240},{"v0":26,"v1":27,"curve":0,"vis":true,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":-240},{"v0":28,"v1":29,"vis":true,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"v0":30,"v1":31,"vis":true,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"v0":38,"v1":39,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-557.5},{"v0":40,"v1":41,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-557.5},{"v0":42,"v1":43,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":557.5},{"v0":44,"v1":45,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":557.5},{"v0":46,"v1":47,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":0},{"v0":48,"v1":49,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-550},{"v0":50,"v1":51,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":550},{"v0":63,"v1":64,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":65,"v1":66,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":68,"v1":67,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":69,"v1":70,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":66,"v1":70,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":72,"v1":71,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":73,"v1":74,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":75,"v1":76,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":77,"v1":78,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-123},{"v0":79,"v1":80,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-123},{"v0":81,"v1":82,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":83,"v1":84,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":85,"v1":86,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":88,"v1":87,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":90,"v1":89,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":91,"v1":92,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":93,"v1":94,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":95,"v1":96,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":390},{"v0":98,"v1":97,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":97,"v1":98,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":100,"v1":99,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":99,"v1":100,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":102,"v1":101,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":101,"v1":102,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":104,"v1":103,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":103,"v1":104,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":106,"v1":105,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":105,"v1":106,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":108,"v1":107,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":107,"v1":108,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":110,"v1":109,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":109,"v1":110,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":112,"v1":111,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":111,"v1":112,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":114,"v1":113,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":113,"v1":114,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":116,"v1":115,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":115,"v1":116,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":118,"v1":117,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":117,"v1":118,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":120,"v1":119,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":119,"v1":120,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":122,"v1":121,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":121,"v1":122,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":124,"v1":123,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":123,"v1":124,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":126,"v1":125,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":125,"v1":126,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":128,"v1":127,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":127,"v1":128,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5}],"goals":[{"p0":[-557.5,-80],"p1":[-557.5,80],"team":"red"},{"p0":[557.5,80],"p1":[557.5,-80],"team":"blue"}],"discs":[{"radius":5,"pos":[-550,80],"color":"B51717","trait":"goalPost","y":80,"_data":{"mirror":{}}},{"radius":5,"pos":[-550,-80],"color":"B51717","trait":"goalPost","y":-80,"x":-560,"_data":{"mirror":{}}},{"radius":5,"pos":[550,80],"color":"8ED2AB","trait":"goalPost","y":80,"_data":{"mirror":{}}},{"radius":5,"pos":[550,-80],"color":"8ED2AB","trait":"goalPost","y":-80,"_data":{"mirror":{}},"_selected":true},{"radius":3,"invMass":0,"pos":[-550,240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[-550,-240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[550,-240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[550,240],"color":"FFCC00","bCoef":0.1,"trait":"line"}],"planes":[{"normal":[0,1],"dist":-240,"bCoef":1,"trait":"ballArea","vis":false,"curve":0,"_data":{"extremes":{"normal":[0,1],"dist":-240,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,-240],"b":[1221,-240]}}},{"normal":[0,-1],"dist":-240,"bCoef":1,"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-240,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,240],"b":[1221,240]}}},{"normal":[1,0],"dist":-620,"bCoef":0.1,"_data":{"extremes":{"normal":[1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[-620,-298],"b":[-620,299]}}},{"normal":[-1,0],"dist":-620,"bCoef":0.1,"_data":{"extremes":{"normal":[-1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[620,-298],"b":[620,299]}}},{"normal":[1,0],"dist":-620,"bCoef":0.1,"trait":"ballArea","vis":false,"curve":0,"_data":{"extremes":{"normal":[1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[-620,-298],"b":[-620,299]}}},{"normal":[-1,0],"dist":-620,"bCoef":0.1,"trait":"ballArea","vis":false,"curve":0,"_data":{"extremes":{"normal":[-1,0],"dist":-620,"canvas_rect":[-1221,-298,1221,299],"a":[620,-298],"b":[620,299]}}},{"normal":[0,-1],"dist":-269,"bCoef":1,"cMask":["red","blue","ball"],"trait":"line","_data":{"extremes":{"normal":[0,-1],"dist":-269,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,269],"b":[1221,269]},"mirror":{}}},{"normal":[0,1],"dist":-271,"bCoef":1,"cMask":["red","blue","ball"],"trait":"line","_data":{"extremes":{"normal":[0,1],"dist":-271,"canvas_rect":[-1221,-298,1221,299],"a":[-1221,-271],"b":[1221,-271]}}}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"line":{"vis":true,"bCoef":0.1,"cMask":[""]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.084,"kickStrength":5},"ballPhysics":{"radius":6.25,"bCoef":0.4,"invMass":1.5,"damping":0.99,"color":"FF9214"},"joints":[],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}';

var x4Map =
  '{"name":"𝗙𝗠𝗧 x4","width":755,"height":339,"spawnDistance":310,"bg":{"type":"","width":665,"height":290,"kickOffRadius":80,"cornerRadius":0,"color":"434F56"},"vertexes":[{"x":-665,"y":290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-665,"y":80,"bCoef":1,"cMask":["blue"],"trait":"ballArea"},{"x":-665,"y":-80,"bCoef":1,"cMask":["blue"],"trait":"ballArea"},{"x":-665,"y":-290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":665,"y":290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":665,"y":80,"bCoef":1,"cMask":["red"],"trait":"ballArea"},{"x":665,"y":-80,"bCoef":1,"cMask":["red"],"trait":"ballArea"},{"x":665,"y":-290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":0,"y":306,"trait":"kickOffBarrier"},{"x":0,"y":80,"trait":"kickOffBarrier"},{"x":0,"y":-80,"trait":"line"},{"x":0,"y":-306,"trait":"kickOffBarrier"},{"x":-693,"y":-80,"bCoef":0.1,"cMask":["blue"],"trait":"goalNet"},{"x":693,"y":-80,"bCoef":0.1,"cMask":["red"],"trait":"goalNet"},{"x":-693,"y":80,"bCoef":0.1,"cMask":["blue"],"trait":"goalNet"},{"x":693,"y":80,"bCoef":0.1,"cMask":["red"],"trait":"goalNet"},{"x":-665,"y":-215,"trait":"line"},{"x":-500,"y":-50,"trait":"line"},{"x":665,"y":-215,"trait":"line"},{"x":500,"y":-50,"trait":"line"},{"x":-665,"y":215,"trait":"line"},{"x":-500,"y":50,"trait":"line"},{"x":665,"y":215,"trait":"line"},{"x":500,"y":50,"trait":"line"},{"x":665,"y":290,"bCoef":1,"trait":"ballArea"},{"x":665,"y":-290,"bCoef":1,"trait":"ballArea"},{"x":0,"y":290,"bCoef":0,"trait":"line"},{"x":0,"y":-290,"bCoef":0,"trait":"line"},{"x":0,"y":80,"trait":"kickOffBarrier"},{"x":0,"y":-80,"trait":"kickOffBarrier"},{"x":674,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":674,"y":-290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-674,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":-674,"y":-290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":-674,"y":80,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":-674,"y":290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":674,"y":80,"bCoef":1,"cMask":["ball"],"trait":"line"},{"x":674,"y":290,"bCoef":1,"cMask":["ball"],"trait":"ballArea"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea"},{"v0":6,"v1":7,"trait":"ballArea"},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"curve":180,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":9,"v1":10,"curve":-180,"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":10,"v1":11,"trait":"kickOffBarrier"},{"v0":2,"v1":12,"curve":-35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["blue"],"trait":"goalNet"},{"v0":6,"v1":13,"curve":35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["red"],"trait":"goalNet"},{"v0":1,"v1":14,"curve":35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["blue"],"trait":"goalNet"},{"v0":5,"v1":15,"curve":-35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["red"],"trait":"goalNet"},{"v0":12,"v1":14,"curve":-35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","blue"],"trait":"goalNet","x":-585},{"v0":13,"v1":15,"curve":35,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["red"],"trait":"goalNet","x":585},{"v0":16,"v1":17,"curve":90,"color":"FFFFFF","trait":"line"},{"v0":18,"v1":19,"curve":-90,"color":"FFFFFF","trait":"line"},{"v0":20,"v1":21,"curve":-90,"color":"FFFFFF","trait":"line"},{"v0":22,"v1":23,"curve":90,"color":"FFFFFF","trait":"line"},{"v0":17,"v1":21,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":19,"v1":23,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":1,"v1":0,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-665},{"v0":5,"v1":4,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":665},{"v0":2,"v1":3,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-665},{"v0":6,"v1":7,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":665},{"v0":0,"v1":24,"vis":true,"color":"FFFFFF","bCoef":1,"trait":"ballArea","y":290},{"v0":3,"v1":25,"vis":true,"color":"FFFFFF","bCoef":1,"trait":"ballArea","y":-290},{"v0":26,"v1":27,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":10,"v1":9,"curve":-180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":29,"v1":28,"curve":180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":2,"v1":1,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":6,"v1":5,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":30,"v1":31,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":614},{"v0":32,"v1":33,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-614},{"v0":34,"v1":35,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-614},{"v0":36,"v1":37,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":614}],"goals":[{"p0":[-674,-80],"p1":[-674,80],"team":"red"},{"p0":[674,80],"p1":[674,-80],"team":"blue"}],"discs":[{"radius":5,"pos":[-665,80],"color":"FFFFFF","trait":"goalPost"},{"radius":5,"pos":[-665,-80],"color":"FFFFFF","trait":"goalPost"},{"radius":5,"pos":[665,80],"color":"FFFFFF","trait":"goalPost"},{"radius":5,"pos":[665,-80],"color":"FFFFFF","trait":"goalPost"}],"planes":[{"normal":[0,1],"dist":-290,"trait":"ballArea","_data":{"extremes":{"normal":[0,1],"dist":-290,"canvas_rect":[-1200,-380,1201,381],"a":[-1200,-290],"b":[1201,-290]}}},{"normal":[0,-1],"dist":-290,"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-290,"canvas_rect":[-1200,-380,1201,381],"a":[-1200,290],"b":[1201,290]}}},{"normal":[0,1],"dist":-339,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[0,1],"dist":-339,"canvas_rect":[-1200,-380,1201,381],"a":[-1200,-339],"b":[1201,-339]}}},{"normal":[0,-1],"dist":-339,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[0,-1],"dist":-339,"canvas_rect":[-1200,-380,1201,381],"a":[-1200,339],"b":[1201,339]}}},{"normal":[1,0],"dist":-755,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[1,0],"dist":-755,"canvas_rect":[-1200,-380,1201,381],"a":[-755,-380],"b":[-755,381]}}},{"normal":[-1,0],"dist":-755,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[-1,0],"dist":-755,"canvas_rect":[-1200,-380,1201,381],"a":[755,-380],"b":[755,381]}}}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":1},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["all"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"bCoef":0,"cMask":[""]},"arco":{"radius":2,"cMask":["n/d"],"color":"cccccc"}},"playerPhysics":{"acceleration":0.11,"kickingAcceleration":0.1,"kickStrength":7},"ballPhysics":{"radius":6.4,"color":"EAFF00"},"joints":[],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}';

var x5Map =
  '{"name":"𝗙𝘂𝘁𝘀𝗮𝗹𝘅5𝗙𝗖","width":1080,"height":532,"spawnDistance":310,"bg":{"type":"hockey","width":950,"height":460,"kickOffRadius":6,"cornerRadius":0},"vertexes":[{"x":-950,"y":460,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":-950,"y":90,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},{"x":-950,"y":-90,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},{"x":-950,"y":-460,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":950,"y":456,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":950,"y":90,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},{"x":950,"y":-90,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},{"x":950,"y":-456,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":0,"y":508,"trait":"kickOffBarrier"},{"x":0,"y":150,"trait":"kickOffBarrier"},{"x":0,"y":-150,"trait":"line"},{"x":0,"y":-508,"trait":"kickOffBarrier"},{"x":-995,"y":-90,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet","curve":0},{"x":995,"y":-90,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet","curve":0},{"x":-995,"y":90,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet","curve":0},{"x":995,"y":90,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet","curve":0},{"x":951,"y":460,"bCoef":1,"trait":"ballArea"},{"x":951,"y":-460,"bCoef":1,"trait":"ballArea"},{"x":0,"y":460,"bCoef":0,"trait":"line","curve":0},{"x":0,"y":-460,"bCoef":0,"trait":"line","curve":0},{"x":0,"y":150,"trait":"kickOffBarrier"},{"x":0,"y":-150,"trait":"kickOffBarrier"},{"x":958,"y":-90,"bCoef":1,"cMask":["ball"],"trait":"line","curve":0},{"x":958,"y":-456,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":-958,"y":-90,"bCoef":1,"cMask":["ball"],"trait":"line","curve":0},{"x":-958,"y":-456,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":-958,"y":90,"bCoef":1,"cMask":["ball"],"trait":"line","curve":0},{"x":-958,"y":456,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":958,"y":90,"bCoef":1,"cMask":["ball"],"trait":"line","curve":0},{"x":958,"y":456,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":0,"y":-9,"trait":"line","curve":-180},{"x":0,"y":9,"trait":"line","curve":-180},{"x":0,"y":-9,"trait":"line","curve":180},{"x":0,"y":9,"trait":"line","curve":180},{"x":634.21528583524,"y":-109.20953737271,"bCoef":0,"cMask":[""],"trait":"line","curve":0},{"x":634.21528583524,"y":114.16613046747,"bCoef":0,"cMask":[""],"trait":"line","curve":44.336382176589},{"x":634.21528583524,"y":114.16613046747,"bCoef":0,"cMask":[""],"trait":"line","curve":-90},{"x":950,"y":324.62551819445,"bCoef":0,"cMask":[""],"trait":"line","curve":-90},{"x":634.21528583524,"y":-109.20953737271,"bCoef":0,"cMask":[""],"trait":"line","curve":90},{"x":-423.82978278939,"y":449,"bCoef":0.1,"trait":"line"},{"x":-423.82978278939,"y":471,"bCoef":0.1,"trait":"line"},{"x":-222.35509186163,"y":449,"bCoef":0.1,"trait":"line"},{"x":-222.35509186163,"y":471,"bCoef":0.1,"trait":"line"},{"x":386.06898092163,"y":449,"bCoef":0.1,"trait":"line"},{"x":386.06898092163,"y":471,"bCoef":0.1,"trait":"line"},{"x":184.59428999387,"y":449,"bCoef":0.1,"trait":"line"},{"x":184.59428999387,"y":471,"bCoef":0.1,"trait":"line"},{"x":-657.56254462949,"y":460,"bCoef":0.1,"trait":"line"},{"x":-657.56254462949,"y":473,"bCoef":0.1,"trait":"line"},{"x":975,"y":193.91895440419,"bCoef":0.1,"trait":"line"},{"x":956,"y":193.91895440419,"bCoef":0.1,"trait":"line"},{"x":975,"y":-188.96236130943,"bCoef":0.1,"trait":"line"},{"x":956,"y":-188.96236130943,"bCoef":0.1,"trait":"line"},{"x":-667.82213435646,"y":-460,"bCoef":0.1,"trait":"line"},{"x":-667.82213435646,"y":-473,"bCoef":0.1,"trait":"line"},{"x":621.80174276174,"y":460,"bCoef":0.1,"trait":"line"},{"x":621.80174276174,"y":473,"bCoef":0.1,"trait":"line"},{"x":644.74331148229,"y":-460,"bCoef":0.1,"trait":"line"},{"x":644.74331148229,"y":-473,"bCoef":0.1,"trait":"line"},{"x":634.35340467604,"y":4.2212921610516,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":1.7712285482462,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":6.6713557738571,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":-0.67883506455928,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":0.54619674184346,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":5.4463239674544,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":-1.2913509677606,"bCoef":0.1,"trait":"line","curve":180},{"x":634.35340467604,"y":7.2838716770584,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":4.2212921610516,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":1.7712285482462,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":6.6713557738571,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":-0.67883506455928,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":0.54619674184346,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":5.4463239674544,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":-1.2913509677606,"bCoef":0.1,"trait":"line","curve":180},{"x":484.86942705432,"y":7.2838716770584,"bCoef":0.1,"trait":"line","curve":180},{"x":-975,"y":-191.85660774843,"bCoef":0.1,"trait":"line"},{"x":-956,"y":-191.96236130943,"bCoef":0.1,"trait":"line"},{"x":-975,"y":190.91895440419,"bCoef":0.1,"trait":"line"},{"x":-956,"y":190.91895440419,"bCoef":0.1,"trait":"line"},{"x":-950,"y":432.90041943973,"bCoef":0.1,"trait":"line","curve":-90},{"x":-926.21802170761,"y":460,"bCoef":0.1,"trait":"line","curve":-90},{"x":-950,"y":-433.32499678239,"bCoef":0.1,"trait":"line","curve":90},{"x":-925.43621788149,"y":-460,"bCoef":0.1,"trait":"line","curve":90},{"x":950,"y":-433.36622514797,"bCoef":0.1,"trait":"line","curve":-90},{"x":927.73220749769,"y":-460,"bCoef":0.1,"trait":"line","curve":-90},{"x":950,"y":434.55334331787,"bCoef":0.1,"trait":"line","curve":90},{"x":925.51401132381,"y":460,"bCoef":0.1,"trait":"line","curve":90},{"x":950,"y":-319.66892509968,"bCoef":0,"trait":"line","curve":90},{"x":-635.67083595539,"y":111.16613046747,"bCoef":0,"cMask":[""],"trait":"line","curve":0},{"x":-635.67083595539,"y":-112.20953737271,"bCoef":0,"cMask":[""],"trait":"line","curve":44.336382176589},{"x":-950,"y":-322.66892509968,"bCoef":0,"cMask":[""],"trait":"line","curve":-90},{"x":-635.82253673536,"y":-2.314063297901,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.83851134042,"y":0.13595112921681,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.80656213031,"y":-4.764077725019,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.85448594547,"y":2.5859655563347,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.84649864294,"y":1.3609583427757,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.81454943284,"y":-3.53907051146,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.85847959673,"y":3.1984691631142,"bCoef":0.1,"trait":"line","curve":180},{"x":-635.80256847905,"y":-5.3765813317984,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.3415600448,"y":-1.3935524756233,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.35753464985,"y":1.0564619514946,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.32558543975,"y":-3.8435669027412,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.3735092549,"y":3.5064763786125,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.36552195238,"y":2.2814691650535,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.33357274227,"y":-2.6185596891822,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.37750290617,"y":4.1189799853919,"bCoef":0.1,"trait":"line","curve":180},{"x":-486.32159178848,"y":-4.4560705095206,"bCoef":0.1,"trait":"line","curve":180},{"x":-950,"y":321.62551819445,"bCoef":0,"trait":"line","curve":90},{"x":486.4717644406,"y":-216.68073468914,"bCoef":0.1,"trait":"line","curve":200},{"x":486.26181026907,"y":-213.90354363921,"bCoef":0.1,"trait":"line","curve":200},{"x":484.90815678836,"y":227.79125744183,"bCoef":0.1,"trait":"line","curve":200},{"x":484.69820261683,"y":230.56844849177,"bCoef":0.1,"trait":"line","curve":200},{"x":-487.89251107699,"y":-222.71985942166,"bCoef":0.1,"trait":"line","curve":200},{"x":-488.10246524852,"y":-219.94266837173,"bCoef":0.1,"trait":"line","curve":200},{"x":-487.11070725087,"y":223.27169507557,"bCoef":0.1,"trait":"line","curve":200},{"x":-487.3206614224,"y":226.04888612551,"bCoef":0.1,"trait":"line","curve":200},{"x":-0.077614373673782,"y":-2.4626457981722,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.10499941090626,"y":2.3835365851378,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.050229336441873,"y":-7.3088281814824,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.13238444813857,"y":7.2297189684479,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.11869192952281,"y":4.8066277767929,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.063921855057799,"y":-4.8857369898273,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.13923070744664,"y":8.4412645642754,"bCoef":0.1,"trait":"line","curve":180},{"x":-0.043383077133171,"y":-8.5203737773099,"bCoef":0.1,"trait":"line","curve":180},{"x":0.77952848346911,"y":1.5373542018278,"bCoef":0.1,"trait":"line","curve":180},{"x":2.7521434462366,"y":3.3835365851378,"bCoef":0.1,"trait":"line","curve":180},{"x":0.80691352070102,"y":-3.3088281814824,"bCoef":0.1,"trait":"line","curve":180},{"x":1.7247584090043,"y":2.2297189684479,"bCoef":0.1,"trait":"line","curve":180},{"x":2.73845092762,"y":5.8066277767929,"bCoef":0.1,"trait":"line","curve":180},{"x":0.79322100208503,"y":-0.88573698982727,"bCoef":0.1,"trait":"line","curve":180},{"x":1.7179121496962,"y":3.4412645642754,"bCoef":0.1,"trait":"line","curve":180},{"x":0.81375978000966,"y":-4.5203737773099,"bCoef":0.1,"trait":"line","curve":180},{"x":-950,"y":-322.66892509968,"bCoef":0,"cMask":[""],"trait":"line","curve":-90},{"x":-950,"y":321.62551819445,"bCoef":0,"trait":"line","curve":90},{"x":-635.67083595539,"y":111.16613046747,"bCoef":0,"cMask":[""],"trait":"line","curve":90},{"x":-950,"y":321.62551819445,"bCoef":0,"trait":"line","curve":90},{"x":-635.67083595539,"y":-112.20953737271,"bCoef":0,"cMask":[""],"trait":"line","curve":-90},{"x":-950,"y":-322.66892509968,"bCoef":0,"cMask":[""],"trait":"line","curve":-90}],"segments":[{"v0":0,"v1":1,"curve":0,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea","x":951},{"v0":6,"v1":7,"trait":"ballArea","x":951},{"v0":8,"v1":9,"trait":"kickOffBarrier","x":0},{"v0":9,"v1":10,"curve":180,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":9,"v1":10,"curve":-180,"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":10,"v1":11,"trait":"kickOffBarrier","x":0},{"v0":2,"v1":12,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":-95},{"v0":6,"v1":13,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":-95},{"v0":1,"v1":14,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":95},{"v0":5,"v1":15,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":95},{"v0":12,"v1":14,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","x":-821},{"v0":13,"v1":15,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","x":585},{"v0":1,"v1":0,"curve":0,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-950},{"v0":5,"v1":4,"curve":0,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":950},{"v0":2,"v1":3,"curve":0,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-950},{"v0":6,"v1":7,"curve":0,"vis":true,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":950},{"v0":0,"v1":16,"vis":true,"color":"FFFFFF","bCoef":1,"trait":"ballArea","y":460},{"v0":3,"v1":17,"vis":true,"color":"FFFFFF","bCoef":1,"trait":"ballArea","y":-460},{"v0":18,"v1":19,"curve":0,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":10,"v1":9,"curve":-180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":21,"v1":20,"curve":180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line"},{"v0":2,"v1":1,"curve":0,"vis":true,"color":"ffffff","bCoef":0,"trait":"line","x":-950},{"v0":6,"v1":5,"curve":0,"vis":true,"color":"ffffff","bCoef":0,"trait":"line"},{"v0":22,"v1":23,"curve":0,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":958},{"v0":24,"v1":25,"curve":0,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-958},{"v0":26,"v1":27,"curve":0,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-958},{"v0":28,"v1":29,"curve":0,"vis":false,"color":"FFFFFF","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":958},{"v0":30,"v1":31,"curve":-180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line","x":572},{"v0":32,"v1":33,"curve":180,"vis":true,"color":"FFFFFF","bCoef":0,"trait":"line","x":0},{"v0":34,"v1":35,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":[""],"trait":"line"},{"v0":36,"v1":37,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":[""],"trait":"line"},{"v0":39,"v1":40,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240},{"v0":41,"v1":42,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-120},{"v0":43,"v1":44,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":240},{"v0":45,"v1":46,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":120},{"v0":47,"v1":48,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":49,"v1":50,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":251.96814834},{"v0":51,"v1":52,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-251.96814834},{"v0":53,"v1":54,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":55,"v1":56,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":57,"v1":58,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":60,"v1":59,"curve":180.00000000015,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":59,"v1":60,"curve":180.00000000011,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":62,"v1":61,"curve":179.99999999999,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":61,"v1":62,"curve":180.00000000001,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":64,"v1":63,"curve":180.00000000006,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":63,"v1":64,"curve":180.00000000001,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":66,"v1":65,"curve":179.99999999999,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":65,"v1":66,"curve":179.99999999999,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":68,"v1":67,"curve":179.99999999994,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":67,"v1":68,"curve":180.00000000006,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":70,"v1":69,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":69,"v1":70,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":72,"v1":71,"curve":179.99999999998,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":71,"v1":72,"curve":179.99999999998,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":74,"v1":73,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":73,"v1":74,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":75,"v1":76,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":77,"v1":78,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":251.96814834},{"v0":80,"v1":79,"curve":-91.636910923379,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":82,"v1":81,"curve":91.636910923384,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":84,"v1":83,"curve":-91.636910923386,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":86,"v1":85,"curve":91.636910923367,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":38,"v1":87,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0,"trait":"line"},{"v0":88,"v1":89,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":[""],"trait":"line"},{"v0":92,"v1":91,"curve":180.04149903472,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":91,"v1":92,"curve":180.04149903448,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":94,"v1":93,"curve":180.04149903461,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":93,"v1":94,"curve":180.04149903457,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":96,"v1":95,"curve":180.0414990346,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":95,"v1":96,"curve":180.04149903458,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":98,"v1":97,"curve":180.04149903458,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":97,"v1":98,"curve":180.0414990346,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":100,"v1":99,"curve":180.04149903447,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":99,"v1":100,"curve":180.04149903471,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":102,"v1":101,"curve":180.0414990346,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":101,"v1":102,"curve":180.04149903457,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":104,"v1":103,"curve":180.04149903454,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":103,"v1":104,"curve":180.04149903457,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":106,"v1":105,"curve":180.04149903458,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":105,"v1":106,"curve":180.04149903459,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":108,"v1":109,"curve":-196.43548932859,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":109,"v1":108,"curve":-211.97212519444,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":110,"v1":111,"curve":-196.43548932841,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":111,"v1":110,"curve":-211.97212519486,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":112,"v1":113,"curve":-196.43548932818,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":113,"v1":112,"curve":-211.97212519503,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":114,"v1":115,"curve":-196.4354893283,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":115,"v1":114,"curve":-211.97212519445,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":117,"v1":116,"curve":179.83332296199,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":116,"v1":117,"curve":179.8333229623,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":119,"v1":118,"curve":179.83332296215,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":118,"v1":119,"curve":179.8333229621,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":121,"v1":120,"curve":179.83332296204,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":120,"v1":121,"curve":179.83332296211,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":123,"v1":122,"curve":179.8333229621,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":122,"v1":123,"curve":179.83332296208,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":125,"v1":124,"curve":179.83332296199,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":124,"v1":125,"curve":179.8333229623,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":127,"v1":126,"curve":179.83332296215,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":126,"v1":127,"curve":179.8333229621,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":129,"v1":128,"curve":179.83332296204,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":128,"v1":129,"curve":179.83332296211,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":131,"v1":130,"curve":179.8333229621,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":130,"v1":131,"curve":179.83332296208,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":134,"v1":135,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0,"trait":"line"},{"v0":136,"v1":137,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":[""],"trait":"line"}],"goals":[{"p0":[-957.4,-90],"p1":[-957.4,90],"team":"red"},{"p0":[957.4,90],"p1":[957.4,-90],"team":"blue"}],"discs":[{"radius":5,"pos":[-950,90],"color":"6666CC","trait":"goalPost"},{"radius":5,"pos":[-950,-90],"color":"6666CC","trait":"goalPost"},{"radius":5,"pos":[950,90],"color":"6666CC","trait":"goalPost"},{"radius":5,"pos":[950,-90],"color":"6666CC","trait":"goalPost"},{"radius":3,"invMass":0,"pos":[-950,460],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[-950,-460],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[950,-460],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[950,460],"color":"FFCC00","bCoef":0.1,"trait":"line"}],"planes":[{"normal":[0,1],"dist":-456,"trait":"ballArea"},{"normal":[0,-1],"dist":-456,"trait":"ballArea"},{"normal":[0,1],"dist":-508,"bCoef":0.2,"cMask":["all"]},{"normal":[0,-1],"dist":-508,"bCoef":0.2,"cMask":["all"]},{"normal":[1,0],"dist":-1002,"bCoef":0.2,"cMask":["all"]},{"normal":[-1,0],"dist":-1002,"bCoef":0.2,"cMask":["all"]}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":1},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["all"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"bCoef":0,"cMask":[""]},"arco":{"radius":2,"cMask":["n/d"],"color":"cccccc"}},"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":5},"ballPhysics":{"radius":6.4,"bCoef":0.4,"invMass":1.5,"damping":0.99,"color":"FFCC00"}}';

var x7Map =
  '{"name":"𝗙𝘂𝘁𝘀𝗮𝗹𝘅𝟳𝗙𝗖","canBeStored":true,"width":1265,"height":630,"bg":{"type":"hockey"},"vertexes":[/*0*/{"x":0,"y":-631,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},/*1*/{"x":0,"y":-600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},/*2*/{"x":-1200,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,-80]},/*3*/{"x":-1235,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,-80]},/*4*/{"x":-1235,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,80]},/*5*/{"x":-1200,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,80]},/*6*/{"x":1200,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,-120]},/*7*/{"x":1235,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,-120]},/*8*/{"x":1235,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,120]},/*9*/{"x":1200,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,120]},/*10*/{"x":-1200,"y":120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff","pos":[-700,80]},/*11*/{"x":-1200,"y":600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*12*/{"x":-1200,"y":-120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff","pos":[-700,-80]},/*13*/{"x":-1200,"y":-600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*14*/{"x":-1200,"y":600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*15*/{"x":1200,"y":600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*16*/{"x":1200,"y":120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","pos":[1200,120],"color":"ffffff"},/*17*/{"x":1200,"y":600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*18*/{"x":1200,"y":-600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*19*/{"x":1200,"y":-120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff","pos":[1200,-120]},/*20*/{"x":-1200,"y":-600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},/*21*/{"x":1200,"y":-600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},/*22*/{"x":-1206.5,"y":120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[-700,80],"color":"ffffff"},/*23*/{"x":-1206.5,"y":600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"color":"ffffff"},/*24*/{"x":-1206.5,"y":-600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"color":"ffffff"},/*25*/{"x":-1206.5,"y":-120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[-700,-80],"color":"ffffff"},/*26*/{"x":1206.5,"y":-600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"color":"ffffff"},/*27*/{"x":1206.5,"y":-120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[1200,-120],"color":"ffffff"},/*28*/{"x":1206.5,"y":120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[1200,120],"color":"ffffff"},/*29*/{"x":1206.5,"y":600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"color":"ffffff"},/*30*/{"x":-1200,"y":-120,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"F80000"},/*31*/{"x":-1200,"y":120,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"F80000"},/*32*/{"x":1200,"y":-120,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"0000F8","pos":[1200,-120]},/*33*/{"x":1200,"y":120,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"0000F8","pos":[1200,120]},/*34*/{"x":-1200,"y":560,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":-93.241608812827},/*35*/{"x":-740,"y":100,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":-93.241608812827},/*36*/{"x":-1200,"y":-560,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":93.241608812827},/*37*/{"x":-740,"y":-100,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":93.241608812827},/*38*/{"x":1200,"y":560,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":93.241608812827},/*39*/{"x":740,"y":100,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":93.241608812827},/*40*/{"x":1200,"y":-560,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":-93.241608812827},/*41*/{"x":740,"y":-100,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":-93.241608812827},/*42*/{"x":740,"y":100,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":0},/*43*/{"x":740,"y":-100,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":0},/*44*/{"x":740,"y":1,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*45*/{"x":740,"y":-1,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*46*/{"x":740,"y":3,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*47*/{"x":740,"y":-4,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*48*/{"x":740,"y":4,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*49*/{"x":-740,"y":1,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*50*/{"x":-740,"y":-1,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*51*/{"x":-740,"y":3,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*52*/{"x":-740,"y":-4,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*53*/{"x":-740,"y":4,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180,"color":"ffffff"},/*54*/{"x":-1200,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,-80],"vis":false},/*55*/{"x":-1235,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,-80],"vis":false},/*56*/{"x":-1235,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,80],"vis":false},/*57*/{"x":-1200,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[-700,80],"vis":false},/*58*/{"x":1200,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,-120],"vis":false},/*59*/{"x":1235,"y":-120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,-120],"vis":false},/*60*/{"x":1235,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,120],"vis":false},/*61*/{"x":1200,"y":120,"bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","curve":0,"color":"ffffff","pos":[1200,120],"vis":false},/*62*/{"x":-1265.1,"y":15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false,"pos":[-1265.1,0]},/*63*/{"x":-1235,"y":15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false},/*64*/{"x":-1265.1,"y":-15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false,"pos":[-1265.1,0]},/*65*/{"x":-1235,"y":-15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false},/*66*/{"x":1235,"y":-15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false},/*67*/{"x":1265.1,"y":-15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false,"pos":[610.1,0]},/*68*/{"x":1235,"y":15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false},/*69*/{"x":1265.1,"y":15,"bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","vis":false,"pos":[610.1,0]},/*70*/{"x":0,"y":600,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},/*71*/{"x":0,"y":630,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},/*72*/{"x":0,"y":120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"696969","curve":180},/*73*/{"x":0,"y":-120,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"696969","curve":180},/*74*/{"x":0,"y":120,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"696969"},/*75*/{"x":0,"y":-120,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"696969"},/*76*/{"x":0,"y":-600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"ffffff"},/*77*/{"x":0,"y":120,"cMask":[],"color":"ffffff"},/*78*/{"x":0,"y":600,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},/*79*/{"x":0,"y":120,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"ffffff"},/*80*/{"x":0,"y":600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"ffffff"},/*81*/{"x":0,"y":120,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":-93.241608812827},/*82*/{"x":0,"y":-121,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180.5,"color":"555555"},/*83*/{"x":0,"y":121,"bCoef":0.1,"cMask":["wall"],"trait":"line","curve":180.5,"color":"555555"},/*84*/{"x":0,"y":-121,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"FEBA01"},/*85*/{"x":0,"y":-600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"ffffff"},/*86*/{"x":0,"y":121,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"ffffff"},/*87*/{"x":0,"y":600,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"ffffff"},/*88*/{"x":0,"y":121,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":-93.241608812827},/*89*/{"x":0,"y":-121,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"ffffff","curve":93.241608812827},/*90*/{"x":-1206.5,"y":120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[-700,80],"color":"ffffff"},/*91*/{"x":-1206.5,"y":600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"color":"ffffff"},/*92*/{"x":-1206.5,"y":-600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"color":"ffffff"},/*93*/{"x":-1206.5,"y":-120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[-700,-80],"color":"ffffff"},/*94*/{"x":1206.5,"y":120,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[1200,120],"color":"ffffff"},/*95*/{"x":1206.5,"y":600,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"color":"ffffff"},/*96*/{"x":1235,"y":-630,"bCoef":0.5,"cMask":["red","blue"]},/*97*/{"x":1235,"y":630,"bCoef":0.5,"cMask":["red","blue"]},/*98*/{"x":-1235,"y":-630,"bCoef":0.5,"cMask":["red","blue"]},/*99*/{"x":-1235,"y":630,"bCoef":0.5,"cMask":["red","blue"]},/*100*/{"x":0,"y":90,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*101*/{"x":0,"y":-90,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*102*/{"x":0,"y":90,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*103*/{"x":0,"y":-90,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*104*/{"x":0,"y":90,"cMask":[],"color":"939393"},/*105*/{"x":0,"y":90,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*106*/{"x":0,"y":90.71794871794872,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*107*/{"x":0,"y":-90.71794871794872,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*108*/{"x":0,"y":90.71794871794872,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*109*/{"x":0,"y":-90.71794871794872,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*110*/{"x":0,"y":91,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*111*/{"x":0,"y":-91,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*112*/{"x":0,"y":91,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*113*/{"x":0,"y":-91,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*114*/{"x":0,"y":-91,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":93.241608812827},/*115*/{"x":0,"y":91,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-93.241608812827},/*116*/{"x":0,"y":-91,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*117*/{"x":0,"y":91,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"939393"},/*118*/{"x":-0.6505369938427,"y":90.95465763683406,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*119*/{"x":-0.6505369938427,"y":-89.00213903605642,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*120*/{"x":-0.6505369938427,"y":90.95465763683406,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*121*/{"x":-0.6505369938427,"y":-89.00213903605642,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*122*/{"x":-0.7232568860606743,"y":86.0073021995592,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*123*/{"x":-0.7232568860606743,"y":-84.30895179442639,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*124*/{"x":-0.7232568860606743,"y":86.0073021995592,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*125*/{"x":-0.7232568860606743,"y":-84.30895179442639,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*126*/{"x":-0.809522640554488,"y":80.13838055338022,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*127*/{"x":-0.809522640554488,"y":-78.74154339994371,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":-180},/*128*/{"x":-0.809522640554488,"y":80.13838055338022,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*129*/{"x":-0.809522640554488,"y":-78.74154339994371,"bCoef":0.1,"cMask":["wall"],"trait":"line","color":"939393","curve":180},/*130*/{"x":-58.64166495512634,"y":-53.175350882093234,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*131*/{"x":-33.8307150620987,"y":-47.78166612273941,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*132*/{"x":-3.086711933781892,"y":-54.79345630989937,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*133*/{"x":10.397499964602718,"y":-32.67934879654866,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*134*/{"x":-3.086711933781892,"y":-11.104609759133329,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*135*/{"x":-33.29134658616332,"y":-19.19513689816408,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*136*/{"x":-28.95294797537871,"y":-44.529821398259394,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*137*/{"x":-5.337989050729524,"y":-49.91568922317938,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*138*/{"x":5.019449074116602,"y":-32.92949069843172,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*139*/{"x":-5.337989050729524,"y":-16.35758969867795,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*140*/{"x":-28.538650450384864,"y":-22.572052573585594,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*141*/{"x":-23.29778675921276,"y":-40.75971392081542,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*142*/{"x":-7.948063458190758,"y":-44.26052800701339,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*143*/{"x":-1.2157286770407496,"y":-33.21949896592742,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*144*/{"x":-7.948063458190758,"y":-22.447763316087446,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*145*/{"x":-23.028493367966693,"y":-26.487164184777413,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*146*/{"x":-18.486712082024912,"y":-37.70900450284285,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*147*/{"x":-9.825082505019692,"y":-39.68446388005461,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*148*/{"x":-6.026122164227919,"y":-33.454168921156075,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*149*/{"x":-9.825082505019692,"y":-27.375832375889253,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*150*/{"x":-18.334753668393244,"y":-29.655208580364306,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*151*/{"x":10.936868440538095,"y":-76.90756382325009,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*152*/{"x":-10.841211502798409,"y":46.784937115255055,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*153*/{"x":7.1346345023234,"y":20.87687098937728,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*154*/{"x":32.00348373101125,"y":28.11552139351749,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*155*/{"x":36.593082559603765,"y":53.14008767638626,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*156*/{"x":8.832380641928397,"y":67.53175237888709,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*157*/{"x":-5.046442920847778,"y":45.897377006837225,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*158*/{"x":8.76109096714436,"y":25.99697838840937,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*159*/{"x":27.86325051961479,"y":31.55710116260402,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*160*/{"x":31.388594547374204,"y":50.77886946683654,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*161*/{"x":10.065156842493117,"y":61.83333655716329,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*162*/{"x":1.6718669038512775,"y":44.868362006140316,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*163*/{"x":10.64676393104614,"y":31.93310290416218,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*164*/{"x":23.063167640151942,"y":35.54718270738872,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*165*/{"x":25.354641258195603,"y":48.041332105139844,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*166*/{"x":11.494406750022893,"y":55.226735713852236,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*167*/{"x":7.281763458339138,"y":43.87723731654312,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*168*/{"x":12.346169637970597,"y":36.578055394712614,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*169*/{"x":19.352568873823078,"y":38.61742899796187,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*170*/{"x":20.64561470114773,"y":45.66769901526428,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*171*/{"x":12.824482371536005,"y":49.72231962303773,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*172*/{"x":38.053767417921556,"y":-24.959486093658818,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*173*/{"x":39.54402733569867,"y":4.570925076202384,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*174*/{"x":60.43818418846064,"y":6.677833104085571,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*175*/{"x":74.64941646255942,"y":-14.238800038084722,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*176*/{"x":61.14895079765635,"y":-36.80196880797294,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*177*/{"x":41.79707774509096,"y":-22.1532708458745,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*178*/{"x":42.94177014570238,"y":0.5295087483667186,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*179*/{"x":58.99090511956302,"y":2.1478583929726347,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*180*/{"x":69.90677918517514,"y":-13.918540977100198,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*181*/{"x":59.53685628314812,"y":-31.249670611941873,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*182*/{"x":46.13697815565302,"y":-18.899815042974573,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*183*/{"x":46.881028216050424,"y":-4.156008306717757,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*184*/{"x":57.31296594905986,"y":-3.104081037723893,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*185*/{"x":64.40828409170774,"y":-13.547240628271222,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*186*/{"x":57.6678342053902,"y":-24.812474890918363,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*187*/{"x":49.7032148562896,"y":-16.06451438778283,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*188*/{"x":50.1230716760853,"y":-7.744794872323602,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*189*/{"x":56.0096651111406,"y":-7.15120734196282,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*190*/{"x":60.01345177734906,"y":-13.04413311091451,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*191*/{"x":56.20991219864133,"y":-19.40094387340825,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*192*/{"x":-76.98019313692936,"y":20.178761845118906,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*193*/{"x":-71.0471399016402,"y":3.458339091122023,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*194*/{"x":-49.472400864224824,"y":6.69454994673433,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*195*/{"x":-40.8425052492587,"y":30.966131363826573,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*196*/{"x":-52.7086117198371,"y":47.68655411782346,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*197*/{"x":-69.96840294976936,"y":37.97792155098657,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*198*/{"x":-72.44417589718435,"y":20.88751453882907,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*199*/{"x":-68.0703785880575,"y":8.561358485835175,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*200*/{"x":-52.165661100323426,"y":10.947066108995273,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*201*/{"x":-45.80377410522977,"y":28.839873282696118,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*202*/{"x":-54.55136872348356,"y":41.16602933569002,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*203*/{"x":-67.27514271367082,"y":34.00890646620968,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*204*/{"x":-67.93340652273672,"y":21.59232225358651,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*205*/{"x":-65.11018618607622,"y":13.635974032088784,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*206*/{"x":-54.84393041640174,"y":15.17591239753996,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*207*/{"x":-50.737428108531894,"y":26.725450138423763,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*208*/{"x":-56.38386878185289,"y":34.6817983599215,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*209*/{"x":-64.59687339759252,"y":30.06198326356798,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*210*/{"x":-64.12022580828621,"y":22.188131740219404,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*211*/{"x":-62.60778634221806,"y":17.925802335845628,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*212*/{"x":-57.10800646560673,"y":18.750769317337316,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*213*/{"x":-54.90809451496221,"y":24.93802167852509,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*214*/{"x":-57.93297344709841,"y":29.200351082898877,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*215*/{"x":-62.33279734838752,"y":26.725450138423763,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*216*/{"x":58.401294322851854,"y":-51.01787697835168,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*217*/{"x":70.80676926936565,"y":30.966131363826573,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*218*/{"x":55.704451943174924,"y":55.23771278091883,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*219*/{"x":-6.322922789394167,"y":78.9699257220757,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*220*/{"x":-43.53934762893559,"y":66.02508229962652,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*221*/{"x":-76.98019313692936,"y":-21.3526108019056,"bCoef":0.1,"cMask":["wall"],"color":"939393"},/*222*/{"x":-1203,"y":-120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff","pos":[-700,-80]},/*223*/{"x":-1203,"y":-600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*224*/{"x":-1200,"y":-603,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},/*225*/{"x":1200,"y":-603,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"ffffff"},/*226*/{"x":-1203,"y":120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff","pos":[-700,80]},/*227*/{"x":-1203,"y":600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*228*/{"x":-1200,"y":603,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*229*/{"x":1200,"y":603,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*230*/{"x":1203,"y":120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","pos":[1200,120],"color":"ffffff"},/*231*/{"x":1203,"y":600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*232*/{"x":1203,"y":-600,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff"},/*233*/{"x":1203,"y":-120,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"ffffff","pos":[1200,-120]}],"segments":[{"v0":0,"v1":1,"vis":false,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":2,"v1":3,"curve":0,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[-700,-80],"y":-120},{"v0":3,"v1":4,"curve":0,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","x":-1235},{"v0":4,"v1":5,"curve":0,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[-700,80],"y":120},{"v0":6,"v1":7,"curve":0,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[1200,-120],"y":-120},{"v0":7,"v1":8,"curve":0,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","x":1235},{"v0":8,"v1":9,"curve":0,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[1200,120],"y":120},{"v0":10,"v1":11,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":12,"v1":13,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":14,"v1":15,"vis":true,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":240},{"v0":16,"v1":17,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":1200},{"v0":18,"v1":19,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":20,"v1":21,"curve":0,"vis":true,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":-600},{"v0":22,"v1":23,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-556.5},{"v0":24,"v1":25,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-556.5},{"v0":26,"v1":27,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":556.5},{"v0":28,"v1":29,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":556.5},{"v0":30,"v1":31,"curve":0,"vis":true,"color":"F80000","bCoef":0.1,"cMask":["wall"],"trait":"line","x":-550},{"v0":32,"v1":33,"curve":0,"vis":true,"color":"0000F8","bCoef":0.1,"cMask":["wall"],"trait":"line","x":550},{"v0":34,"v1":35,"curve":-93.241608812827,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line"},{"v0":36,"v1":37,"curve":93.241608812827,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line"},{"v0":35,"v1":37,"curve":0,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":-740},{"v0":38,"v1":39,"curve":93.241608812827,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line"},{"v0":40,"v1":41,"curve":-93.241608812827,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line"},{"v0":42,"v1":43,"curve":0,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":740},{"v0":45,"v1":44,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":740},{"v0":44,"v1":45,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":740},{"v0":47,"v1":46,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":740},{"v0":46,"v1":47,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":740},{"v0":50,"v1":49,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":-740},{"v0":49,"v1":50,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":-740},{"v0":52,"v1":51,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":-740},{"v0":51,"v1":52,"curve":180,"vis":true,"color":"ffffff","bCoef":0.1,"cMask":["wall"],"trait":"line","x":-740},{"v0":54,"v1":55,"curve":0,"vis":false,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[-700,-80],"y":-120},{"v0":55,"v1":56,"curve":0,"vis":false,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","x":-1235},{"v0":56,"v1":57,"curve":0,"vis":false,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[-700,80],"y":120},{"v0":58,"v1":59,"curve":0,"vis":false,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[1200,-120],"y":-120},{"v0":59,"v1":60,"curve":0,"vis":false,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","x":1235},{"v0":60,"v1":61,"curve":0,"vis":false,"color":"ffffff","bCoef":0.2,"cMask":["red","blue","ball"],"trait":"goalPost","pos":[1200,120],"y":120},{"v0":62,"v1":63,"curve":0,"vis":false,"color":"ffffff","bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","y":15},{"v0":64,"v1":65,"curve":0,"vis":false,"color":"ffffff","bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","y":-15},{"v0":66,"v1":67,"curve":0,"vis":false,"color":"ffffff","bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","y":-15},{"v0":68,"v1":69,"curve":0,"vis":false,"color":"ffffff","bCoef":0.5,"cMask":["red","blue"],"trait":"goalPost","y":15},{"v0":70,"v1":71,"vis":false,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":72,"v1":73,"curve":180,"color":"696969","bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":0.0049891420830909},{"v0":75,"v1":74,"curve":180,"color":"696969","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.1232339957368e-17},{"v0":83,"v1":82,"curve":180.5,"vis":true,"color":"555555","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":82,"v1":83,"curve":180.5,"vis":true,"color":"555555","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":85,"v1":84,"color":"ffffff","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":86,"v1":87,"color":"ffffff","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":90,"v1":91,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-556.5},{"v0":92,"v1":93,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-556.5},{"v0":94,"v1":95,"curve":0,"vis":false,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":556.5},{"v0":96,"v1":97,"curve":0,"vis":false,"color":"ffffff","bCoef":0.5,"cMask":["red","blue"],"x":1235},{"v0":98,"v1":99,"curve":0,"vis":false,"color":"ffffff","bCoef":0.5,"cMask":["red","blue"],"x":-1235},{"v0":100,"v1":101,"curve":179.42829117403,"color":"939393","bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":0.0049891420830909},{"v0":103,"v1":102,"curve":180,"color":"939393","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.1232339957368e-17},{"v0":106,"v1":107,"curve":-180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":108,"v1":109,"curve":180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":110,"v1":111,"curve":-179.69199272082727,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":112,"v1":113,"curve":179.9101787569867,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":118,"v1":119,"curve":-180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":120,"v1":121,"curve":180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":122,"v1":123,"curve":-180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":124,"v1":125,"curve":180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":126,"v1":127,"curve":-180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":128,"v1":129,"curve":180,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"],"trait":"line","x":0},{"v0":130,"v1":131,"curve":41.815960942019316,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":131,"v1":132,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":132,"v1":133,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":133,"v1":134,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":134,"v1":135,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":135,"v1":131,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":136,"v1":137,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":137,"v1":138,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":138,"v1":139,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":139,"v1":140,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":140,"v1":136,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":141,"v1":142,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":142,"v1":143,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":143,"v1":144,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":144,"v1":145,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":145,"v1":141,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":146,"v1":147,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":147,"v1":148,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":148,"v1":149,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":149,"v1":150,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":150,"v1":146,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":132,"v1":151,"curve":26.392926384436958,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":152,"v1":153,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":153,"v1":154,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":154,"v1":155,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":155,"v1":156,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":156,"v1":152,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":157,"v1":158,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":158,"v1":159,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":159,"v1":160,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":160,"v1":161,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":161,"v1":157,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":162,"v1":163,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":163,"v1":164,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":164,"v1":165,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":165,"v1":166,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":166,"v1":162,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":167,"v1":168,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":168,"v1":169,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":169,"v1":170,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":170,"v1":171,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":171,"v1":167,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":172,"v1":173,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":173,"v1":174,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":174,"v1":175,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":175,"v1":176,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":176,"v1":172,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":177,"v1":178,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":178,"v1":179,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":179,"v1":180,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":180,"v1":181,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":181,"v1":177,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":182,"v1":183,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":183,"v1":184,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":184,"v1":185,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":185,"v1":186,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":186,"v1":182,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":187,"v1":188,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":188,"v1":189,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":189,"v1":190,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":190,"v1":191,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":191,"v1":187,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":192,"v1":193,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":193,"v1":194,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":194,"v1":195,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":195,"v1":196,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":196,"v1":197,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":197,"v1":192,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":198,"v1":199,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":199,"v1":200,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":200,"v1":201,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":201,"v1":202,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":202,"v1":203,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":203,"v1":198,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":204,"v1":205,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":205,"v1":206,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":206,"v1":207,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":207,"v1":208,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":208,"v1":209,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":209,"v1":204,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":210,"v1":211,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":211,"v1":212,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":212,"v1":213,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":213,"v1":214,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":214,"v1":215,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":215,"v1":210,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":194,"v1":135,"curve":23.349737619501724,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":134,"v1":153,"curve":0,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":133,"v1":172,"curve":24.678458804936827,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":176,"v1":216,"curve":-21.76978243279372,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":174,"v1":217,"curve":43.26339127378437,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":154,"v1":173,"curve":-25.023191638187097,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":155,"v1":218,"curve":-40.88059361000261,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":156,"v1":219,"curve":24.7138580010139,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":196,"v1":220,"curve":-48.32967343244267,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":195,"v1":152,"curve":-33.75534631846241,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":193,"v1":221,"curve":30.438929662347565,"vis":true,"color":"939393","bCoef":0.1,"cMask":["wall"]},{"v0":222,"v1":223,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-1203},{"v0":224,"v1":225,"curve":0,"vis":true,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":-603},{"v0":226,"v1":227,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-1203},{"v0":228,"v1":229,"vis":true,"color":"ffffff","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":603},{"v0":230,"v1":231,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":1203},{"v0":232,"v1":233,"vis":true,"color":"ffffff","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":1203}],"planes":[{"normal":[0,1],"dist":-630,"bCoef":0.1},{"normal":[-1,0],"dist":-1265.1,"bCoef":0.1},{"normal":[0,-1],"dist":-600,"cMask":["ball"]},{"normal":[0,-1],"dist":-630,"bCoef":0.1},{"normal":[1,0],"dist":-1265.1,"bCoef":0.1},{"normal":[0,1],"dist":-600,"cMask":["ball"]}],"goals":[{"p0":[-1207.5,-120],"p1":[-1207.5,120],"team":"red","color":"ffffff"},{"p0":[1207.5,120],"p1":[1207.5,-120],"team":"blue","color":"ffffff"}],"discs":[{"radius":0.01,"invMass":0,"pos":[-1265.1,0],"color":"000000","bCoef":470,"vis":true,"x":-1265.1},{"radius":0.1,"invMass":0,"pos":[1265.1,0],"color":"000000","bCoef":470},{"radius":6,"invMass":0,"pos":[-1200,120],"color":"ffffff","trait":"goalPost","y":85},{"radius":6,"invMass":0,"pos":[-1200,-120],"color":"ffffff","trait":"goalPost","y":-110,"x":-560},{"radius":6,"invMass":0,"pos":[1200,120],"color":"ffffff","trait":"goalPost","y":85},{"radius":6,"invMass":0,"pos":[1200,-120],"color":"ffffff","trait":"goalPost","y":-110,"vis":true}],"playerPhysics":{"bCoef":0.1,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":5.2},"ballPhysics":{"radius":6.25,"bCoef":0.4,"invMass":1.5,"color":"FEBA01"},"spawnDistance":320,"traits":{}}';

/* OPTIONS */

const hora = 3600;

var limpabans = setInterval(() => {
  room.clearBans();
  banList = [];
  room.sendChat("BANS RESETADOS.");
}, 1000 * hora * 2);

var afkLimit = 12;
var drawTimeLimit = 5;
var maxTeamSize = 3; // This works for 1 (you might want to adapt things to remove some useless stats in 1v1 like assist or cs), 2, 3 or 4
var slowMode = 0;

/* PLAYERS */

const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
var extendedP = [];
const eP = { ID: 0, AUTH: 1, CONN: 2, AFK: 3, ACT: 4, GK: 5, MUTE: 6 };
const Ss = {
  GA: 0,
  WI: 1,
  DR: 2,
  LS: 3,
  WR: 4,
  GL: 5,
  AS: 6,
  GK: 7,
  CS: 8,
  CP: 9,
  RL: 10,
  NK: 11,
  MP: 12,
};
var players;
var teamR;
var teamB;
var teamS;

/* GAME */

var lastTeamTouched;
var lastPlayersTouched; // These allow to get good goal notifications (it should be lastPlayersKicked, waiting on a next update to get better track of shots on target)
var countAFK = false; // Created to get better track of activity
var activePlay = false; // Created to get better track of the possession
var goldenGoal = false;
var SMSet = new Set(); // Set created to get slow mode which is useful in chooseMode
var banList = []; // Getting track of the bans, so we can unban ppl if we want

/* STATS */

var game;
var GKList = ["", ""];
var Rposs = 0;
var Bposs = 0;
var point = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
]; // created to get ball speed
var ballSpeed;
var lastWinner = Team.SPECTATORS;
var streak = 0;
var allBlues = []; // This is to count the players who should be counted for the stats. This includes players who left after the game has started, doesn't include those who came too late or ...
var allReds = []; // ... those who came in a very unequal game.

/* BALANCE & CHOOSE */

var inChooseMode = false; // This variable enables to distinguish the 2 phases of playing and choosing which should be dealt with very differently
var redCaptainChoice = "";
var blueCaptainChoice = "";
var chooseTime = 20;
var timeOutCap;

/* AUXILIARY */

var checkTimeVariable = false; // This is created so the chat doesn't get spammed when a game is ending via timeLimit
var statNumber = 0; // This allows the room to be given stat information every X minutes
var endGameVariable = false; // This variable with the one below helps distinguish the cases where games are stopped because they have finished to the ones where games are stopped due to player movements or resetting teams
var resettingTeams = false;
var capLeft = false;
var statInterval = 6;

loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);

/* OBJECTS */

function Goal(time, team, striker, assist) {
  this.time = time;
  this.team = team;
  this.striker = striker;
  this.assist = assist;
}

function Game(date, scores, goals) {
  this.date = date;
  this.scores = scores;
  this.goals = goals;
}

/* FUNCTIONS */

/* AUXILIARY FUNCTIONS */
function teamMessage(player, message) {
  var team = room.getPlayerList().filter((p) => p.team == player.team);

  team.forEach((p) => {
    room.sendAnnouncement(
      "[" + player.id + "] [TEAM CHAT] " + player.name + ": " + message,
      p.id,
      teamMessageColors[player.team],
      teamMessageFont,
      teamMessageSound
    );
  });
}

function getRandomInt(max) {
  // returns a random number from 0 to max-1
  return Math.floor(Math.random() * Math.floor(max));
}

function getTime(scores) {
  // returns the current time of the game
  return (
    "[" +
    Math.floor(Math.floor(scores.time / 60) / 10).toString() +
    Math.floor(Math.floor(scores.time / 60) % 10).toString() +
    ":" +
    Math.floor(
      Math.floor(scores.time - Math.floor(scores.time / 60) * 60) / 10
    ).toString() +
    Math.floor(
      Math.floor(scores.time - Math.floor(scores.time / 60) * 60) % 10
    ).toString() +
    "]"
  );
}

function pointDistance(p1, p2) {
  var d1 = p1.x - p2.x;
  var d2 = p1.y - p2.y;
  return Math.sqrt(d1 * d1 + d2 * d2);
}

/* BUTTONS */

function PublicitaDiscord() {
  room.sendAnnouncement(
    "                                        ▒█▀▀▄ ▀█▀ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▄ ",
    null,
    0x9250fd,
    "bold"
  );
  room.sendAnnouncement(
    "                                        ▒█░▒█ ▒█░ ░▀▀▀▄▄ ▒█░░░ ▒█░░▒█ ▒█▄▄▀ ▒█░▒█ ",
    null,
    0x8466fd,
    "bold"
  );
  room.sendAnnouncement(
    "                                        ▒█▄▄▀ ▄█▄ ▒█▄▄▄█ ▒█▄▄█ ▒█▄▄▄█ ▒█░▒█ ▒█▄▄▀ ",
    null,
    0x7b73fd,
    "bold"
  );
  room.sendAnnouncement(
    "                                         >> https://discord.gg/AYB39pWa2V << ",
    null,
    0x7b73fd,
    "bold"
  );
}

function PublicitaConcurso() {
  room.sendAnnouncement(
    "Conheça os nossos uniformes. Digite !uni e confira",
    null,
    0x9250fd,
    "bold"
  );
}

function setVip(auth) {
  if (!localStorage.getItem("listavip")) {
    const listavipObj = {
      premium: {
        umMes: [
          {
            auth: "xxxxx",
            contador: "CS",
          },
        ],
      },
      comum: {
        umMes: [],
      },
    };
  }
}

function PublicitaHelp(player) {
  var scores = room.getScores();
  if (scores.time > 10 && !isTimeAddedShowncinco) {
    room.sendAnnouncement(
      "「📣」 Digite !ajuda para ver os comandos",
      player,
      0xd733ff,
      "bold",
      0
    );
    isTimeAddedShowncinco = true;
  }
}

function topBtn() {
  if (teamS.length == 0) {
    return;
  } else {
    if (teamR.length == teamB.length) {
      if (teamS.length > 1) {
        room.setPlayerTeam(teamS[0].id, Team.RED);
        room.setPlayerTeam(teamS[1].id, Team.BLUE);
      }
      return;
    } else if (teamR.length < teamB.length) {
      room.setPlayerTeam(teamS[0].id, Team.RED);
    } else {
      room.setPlayerTeam(teamS[0].id, Team.BLUE);
    }
  }
}

function randomBtn() {
  if (teamS.length == 0) {
    return;
  } else {
    if (teamR.length == teamB.length) {
      if (teamS.length > 1) {
        var r = getRandomInt(teamS.length);
        room.setPlayerTeam(teamS[r].id, Team.RED);
        teamS = teamS.filter((spec) => spec.id != teamS[r].id);
        room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
      }
      return;
    } else if (teamR.length < teamB.length) {
      room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED);
    } else {
      room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
    }
  }
}

function blueToSpecBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  for (var i = 0; i < teamB.length; i++) {
    room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
  }
}

function redToSpecBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  for (var i = 0; i < teamR.length; i++) {
    room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
  }
}

function resetBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  if (teamR.length <= teamB.length) {
    for (var i = 0; i < teamR.length; i++) {
      room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
      room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
    }
    for (var i = teamR.length; i < teamB.length; i++) {
      room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
    }
  } else {
    for (var i = 0; i < teamB.length; i++) {
      room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
      room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
    }
    for (var i = teamB.length; i < teamR.length; i++) {
      room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
    }
  }
}

function blueToRedBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  for (var i = 0; i < teamB.length; i++) {
    room.setPlayerTeam(teamB[i].id, Team.RED);
  }
}

/* GAME FUNCTIONS */

function checkTime() {
  const scores = room.getScores();
  game.scores = scores;
  if (
    Math.abs(scores.time - scores.timeLimit) <= 0.01 &&
    scores.timeLimit != 0
  ) {
    if (scores.red != scores.blue) {
      if (checkTimeVariable == false) {
        checkTimeVariable = true;
        setTimeout(() => {
          checkTimeVariable = false;
        }, 3000);
        scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
        setTimeout(() => {
          room.stopGame();
        }, 2000);
      }
      return;
    }
    goldenGoal = true;
    room.sendChat("⚽ Gol de Ouro !");
  }
  if (
    Math.abs(drawTimeLimit * 60 - scores.time - 60) <= 0.01 &&
    players.length > 2
  ) {
    if (checkTimeVariable == false) {
      checkTimeVariable = true;
      setTimeout(() => {
        checkTimeVariable = false;
      }, 10);
      room.sendChat("⌛ 60 segundos para o fim da partida !");
    }
  }
  if (
    Math.abs(scores.time - drawTimeLimit * 60) <= 0.01 &&
    players.length > 2
  ) {
    if (checkTimeVariable == false) {
      checkTimeVariable = true;
      setTimeout(() => {
        checkTimeVariable = false;
      }, 10);
      endGame(Team.SPECTATORS);
      room.stopGame();
      goldenGoal = false;
    }
  }
}

function sendStreakRecord(message) {
  var request = new XMLHttpRequest();
  request.open("POST", "x");

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    avatar_url: "",
    username: "Streak",
    content: message,
  };

  request.send(JSON.stringify(params));
}

// REC DAS PARTIDAS

function getDate() {
  let data = new Date(),
    dia = data.getDate().toString().padStart(2, "0"),
    mes = (data.getMonth() + 1).toString().padStart(2, "0"),
    ano = data.getFullYear(),
    horas = data.getHours().toString().padStart(2, "0"),
    minutos = data.getMinutes().toString().padStart(2, "0");
  return `${dia}-${mes}-${ano}-${horas}h${minutos}m`;
}

function getHour() {
  let data = new Date(),
    horas = data.getHours().toString().padStart(2, "0"),
    minutos = data.getMinutes().toString().padStart(2, "0");
  return `${horas}h${minutos}m`;
}

function getScoresObjectTime(scores) {
  return (
    Math.floor(Math.floor(scores / 60) / 10).toString() +
    Math.floor(Math.floor(scores / 60) % 10).toString() +
    ":" +
    Math.floor(
      Math.floor(scores - Math.floor(scores / 60) * 60) / 10
    ).toString() +
    Math.floor(
      Math.floor(scores - Math.floor(scores / 60) * 60) % 10
    ).toString()
  );
}

function sendDiscordWebhook(scores) {
  const form = new FormData();
  // Você pode fazer upload de até 8 MB de arquivo via webhook.
  // Argumento
  // Execução [ operação, nome, tipo ]
  form.append(
    "arquivo",
    new File([room.stopRecording()], `${roomToCode}-${getDate()}.hbr2`, {
      type: "text/plain",
    })
  );

  // Enviar via webhook.
  const webhook = new XMLHttpRequest();
  webhook.open("POST", recWebHook);
  webhook.send(form);
}

function vipSeteDias(player) {
  const thisDate = new Date();
  if (!localStorage.getItem("listavip")) {
    const listaVipObj = {
      umaSemana: [
        {
          auth: "xxxx",
          setTime: 4444,
        },
      ],
      umMes: [
        {
          auth: "xxxx",
          setTime: 4444,
          colorChat: "FFFFFF",
        },
      ],
    };
    const playerObj = { auth: getAuth(player), setTime: thisDate.getTime() };
    listaVipObj.umaSemana.push(playerObj);
    localStorage.setItem("listavip", JSON.stringify(listaVipObj));
    return true;
  } else {
    const listaVipObj = JSON.parse(localStorage.getItem("listavip"));
    const playerObj = { auth: getAuth(player), setTime: thisDate.getTime() };
    if (!listaVipObj.umaSemana.find((p) => p.auth === getAuth(player))) {
      listaVipObj.umaSemana.push(playerObj);
      localStorage.setItem("listavip", JSON.stringify(listaVipObj));
      return true;
    } else return false;
  }
}

function vipUmMes(auth) {
  const thisDate = new Date();
  if (!localStorage.getItem("listavip")) {
    const listaVipObj = {
      umaSemana: [
        {
          auth: "xxxx",
          setTime: 4444,
          colorChat: "FFFFFF",
          count: "GL",
        },
      ],
      umMes: [
        {
          auth: "xxxx",
          setTime: 4444,
          colorChat: "FFFFFF",
          count: "CS",
        },
      ],
    };
    const playerObj = {
      auth: auth,
      setTime: thisDate.getTime(),
      colorChat: "0xFFFFFF",
    };
    listaVipObj.umMes.push(playerObj);
    localStorage.setItem("listavip", JSON.stringify(listaVipObj));
    return true;
  } else {
    const listaVipObj = JSON.parse(localStorage.getItem("listavip"));
    const playerObj = {
      auth: auth,
      setTime: thisDate.getTime(),
      colorChat: "FFFFFF",
      count: "GL",
    };
    if (!listaVipObj.umMes.find((p) => p.auth === auth)) {
      listaVipObj.umMes.push(playerObj);
      localStorage.setItem("listavip", JSON.stringify(listaVipObj));
      return true;
    } else return false;
  }
}

let streakrecord = 1;
let teamstreak = [];

function endGame(winner) {
  // handles the end of a game : no stopGame function inside
  players.length >= 2 * maxTeamSize - 1 ? activateChooseMode() : null;
  const scores = room.getScores();
  game.scores = scores;
  Rposs = Rposs / (Rposs + Bposs);
  Bposs = 1 - Rposs;
  lastWinner = winner;
  endGameVariable = true;
  teamVictory();

  if (winner == Team.RED) {
    streak++;
    room.sendAnnouncement(
      "🔴 Vitória do red ! " +
        scores.red +
        "-" +
        scores.blue +
        " ! Vitórias em sequência : " +
        streak +
        " 🏆",
      null,
      0xdb0404,
      "bold"
    );
    if (teamR.length === maxTeamSize) {
      var seq;
      localStorage.getItem("streak")
        ? (seq = JSON.parse(localStorage.getItem("streak")))
        : (seq = { roomName: roomName, streakteam: [], record: 0 });

      if (streak > seq.record) {
        streakrecord = streak;
        teamstreak = [];

        var streakContent = {
          room: roomName,
          streakteam: [],
          record: 0,
        };

        for (var i = 0; i < teamR.length; i++) {
          var playersec = room.getPlayer(teamR[i].id).name;
          teamstreak.push(playersec);
          streakContent.streakteam.push(playersec);
        }

        streakContent.record = streak;

        localStorage.setItem("streak", JSON.stringify(streakContent));
        var tmstrk = teamstreak.join("|");
        room.sendAnnouncement(
          "NOVO RECORDE DE SEQUÊNCIA REGISTRADO!!",
          null,
          0x08e305,
          "bold",
          2
        );
      }
    }
  } else if (winner == Team.BLUE) {
    streak = 1;
    room.sendAnnouncement(
      "🔵 Vitória do blue ! " +
        scores.blue +
        "-" +
        scores.red +
        " ! Vitórias em sequência : " +
        streak +
        " 🏆",
      null,
      0x34e5eb,
      "bold"
    );
  } else {
    streak = 0;
    room.sendChat("💤 EMPATE ! 💤");
  }
  room.sendAnnouncement(
    "⭐ Posse de bola : 🔴 " +
      (Rposs * 100).toPrecision(3).toString() +
      "% : " +
      (Bposs * 100).toPrecision(3).toString() +
      "% 🔵",
    null,
    0xe7ff0f,
    "bold"
  );
  scores.red == 0 && scores.blue == 0 && GKList[0].name && GKList[1].name
    ? room.sendChat(
        "🏆 " +
          GKList[0].name +
          " e " +
          GKList[1].name +
          "!!!  FECHARAM OS GOLS!! PARARAM TUDO!!! "
      )
    : null;
  scores.red == 0 && scores.blue != 0 && GKList[1].name
    ? room.sendChat(
        "🏆 " +
          GKList[1].name +
          "!!!  TRANCOU O GOL!! UM MURO DEBAIXO DA TRAVE!!! "
      )
    : null;
  scores.blue == 0 && scores.red != 0 && GKList[0].name
    ? room.sendChat(
        "🏆 " +
          GKList[0].name +
          "!!!  TRANCOU O GOL!! UM MURO DEBAIXO DA TRAVE!!! "
      )
    : null;

  updateStats();

  if (room.getPlayerList().length === 2) {
    setTimeout(() => {
      quickRestart();
    }, 1500);
  }
}

function quickRestart() {
  room.stopGame();
  setTimeout(() => {
    room.startGame();
  }, 2000);
}

var intervalo;
function animatedColors(msg) {
  if (msg === "para") {
    clearInterval(intervalo);
    intervalo = 0;
    console.log("ok");
  } else {
    intervalo = setInterval(() => {
      setTimeout(() => {
        room.setTeamColors(1, 0, 0xffeb36, [0xffffff, 0x000000, 0x000000]);
      }, 1000),
        setTimeout(() => {
          room.setTeamColors(1, 0, 0xffeb36, [0x000000, 0x000000, 0xffffff]);
        }, 2000);
      setTimeout(() => {
        room.setTeamColors(1, 0, 0xffeb36, [0x000000, 0xffffff, 0x000000]);
      }, 3000);
    }, 4000);
  }
}

function resumeGame() {
  setTimeout(() => {
    room.startGame();
  }, 2000);
  setTimeout(() => {
    room.pauseGame(false);
  }, 1000);
}

function activateChooseMode() {
  inChooseMode = true;
  slowMode = 2;
  room.sendChat("Modo lento ativado (2 segundos)!");
}

function deactivateChooseMode() {
  inChooseMode = false;
  clearTimeout(timeOutCap);
  if (slowMode != 0) {
    slowMode = 0;
    room.sendChat("Fim do modo lento.");
  }
  redCaptainChoice = "";
  blueCaptainChoice = "";
}

function loadMap(map, scoreLim, timeLim) {
  if (map != "") {
    room.setCustomStadium(map);
  } else {
    console.log("erro ao carregar mapa");
    room.setDefaultStadium("Classic");
  }
  room.setScoreLimit(scoreLim);
  room.setTimeLimit(timeLim);
}

/* PLAYER FUNCTIONS */

function updateTeams() {
  // update the players' list and all the teams' list
  players = room
    .getPlayerList()
    .filter((player) => player.id != 0 && !getAFK(player));
  teamR = players.filter((p) => p.team === Team.RED);
  teamB = players.filter((p) => p.team === Team.BLUE);
  teamS = players.filter((p) => p.team === Team.SPECTATORS);
}

function handleInactivity() {
  // handles inactivity : players will be kicked after afkLimit
  if (countAFK && teamR.length + teamB.length > 1) {
    for (var i = 0; i < teamR.length; i++) {
      setActivity(teamR[i], getActivity(teamR[i]) + 1);
    }
    for (var i = 0; i < teamB.length; i++) {
      setActivity(teamB[i], getActivity(teamB[i]) + 1);
    }
  }
  for (var i = 0; i < extendedP.length; i++) {
    if (extendedP[i][eP.ACT] == 60 * ((2 / 3) * afkLimit)) {
      room.sendChat(
        "[PV] ⛔ @" +
          room.getPlayer(extendedP[i][eP.ID]).name +
          ", Se não se mover ou mandar mensagem  nos proximos  " +
          Math.floor(afkLimit / 3) +
          " segundos, sera kickado!",
        extendedP[i][eP.ID]
      );
    }
    if (extendedP[i][eP.ACT] >= 60 * afkLimit) {
      extendedP[i][eP.ACT] = 0;
      if (room.getScores().time <= afkLimit - 0.5) {
        setTimeout(() => {
          !inChooseMode ? quickRestart() : room.stopGame();
        }, 10);
      }
      room.kickPlayer(extendedP[i][eP.ID], "AFK", false);
    }
  }
}

function getAuth(player) {
  return extendedP.filter((a) => a[0] == player.id) != null
    ? extendedP.filter((a) => a[0] == player.id)[0][eP.AUTH]
    : null;
}

function getAFK(player) {
  return extendedP.filter((a) => a[0] == player.id) != null
    ? extendedP.filter((a) => a[0] == player.id)[0][eP.AFK]
    : null;
}

function setAFK(player, value) {
  extendedP
    .filter((a) => a[0] == player.id)
    .forEach((player) => (player[eP.AFK] = value));
}

function getActivity(player) {
  return extendedP.filter((a) => a[0] == player.id) != null
    ? extendedP.filter((a) => a[0] == player.id)[0][eP.ACT]
    : null;
}

function setActivity(player, value) {
  extendedP
    .filter((a) => a[0] == player.id)
    .forEach((player) => (player[eP.ACT] = value));
}

function getGK(player) {
  return extendedP.filter((a) => a[0] == player.id) != null
    ? extendedP.filter((a) => a[0] == player.id)[0][eP.GK]
    : null;
}

function setGK(player, value) {
  extendedP
    .filter((a) => a[0] == player.id)
    .forEach((player) => (player[eP.GK] = value));
}

function getMute(player) {
  return extendedP.filter((a) => a[0] == player.id) != null
    ? extendedP.filter((a) => a[0] == player.id)[0][eP.MUTE]
    : null;
}

function setMute(player, value) {
  extendedP
    .filter((a) => a[0] == player.id)
    .forEach((player) => (player[eP.MUTE] = value));
}

/* BALANCE & CHOOSE FUNCTIONS */

function updateRoleOnPlayerIn() {
  updateTeams();
  if (inChooseMode) {
    if (players.length == 6) {
      loadMap(x3Map, scoreLimitx3, timeLimitx3);
    }
    getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
  }
  balanceTeams();
}

function updateRoleOnPlayerOut() {
  updateTeams();

  if (inChooseMode) {
    if (players.length == 5) {
      loadMap(classicMap, scoreLimitClassic, timeLimitClassic);
    }
    if (teamR.length == 0 || teamB.length == 0) {
      teamR.length == 0
        ? room.setPlayerTeam(teamS[0].id, Team.RED)
        : room.setPlayerTeam(teamS[0].id, Team.BLUE);
      return;
    }
    if (Math.abs(teamR.length - teamB.length) == teamS.length) {
      room.sendChat("🤖 Sem opções restantes, deixa que eu escolho... 🤖");
      deactivateChooseMode();
      resumeGame();
      var b = teamS.length;
      if (teamR.length > teamB.length) {
        for (var i = 0; i < b; i++) {
          setTimeout(() => {
            room.setPlayerTeam(teamS[0].id, Team.BLUE);
          }, 5 * i);
        }
      } else {
        for (var i = 0; i < b; i++) {
          setTimeout(() => {
            room.setPlayerTeam(teamS[0].id, Team.RED);
          }, 5 * i);
        }
      }
      return;
    }
    if (streak == 0 && room.getScores() == null) {
      if (Math.abs(teamR.length - teamB.length) == 2) {
        // if someone left a team has 2 more players than the other one, put the last ESCOLHEUn guy back in his place so it's fair
        room.sendAnnouncement(
          "🤖 Equilibrando times... 🤖",
          null,
          0xe7ff0f,
          "bold"
        );
        teamR.length > teamB.length
          ? room.setPlayerTeam(teamR[teamR.length - 1].id, Team.SPECTATORS)
          : room.setPlayerTeam(teamB[teamB.length - 1].id, Team.SPECTATORS);
      }
    }
    if (teamR.length == teamB.length && teamS.length < 2) {
      deactivateChooseMode();
      resumeGame();
      return;
    }
    capLeft
      ? choosePlayer()
      : getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
  }
  balanceTeams();
}

function balanceTeams() {
  if (!inChooseMode) {
    if (players.length == 1 && teamR.length == 0) {
      // 1 player
      quickRestart();
      loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);
      room.setPlayerTeam(players[0].id, Team.RED);
    } else if (
      Math.abs(teamR.length - teamB.length) == teamS.length &&
      teamS.length > 0
    ) {
      // spec players supply required players
      const n = Math.abs(teamR.length - teamB.length);
      if (teamR.length > teamB.length) {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamS[i].id, Team.BLUE);
        }
      } else {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamS[i].id, Team.RED);
        }
      }
    } else if (Math.abs(teamR.length - teamB.length) > teamS.length) {
      //no sufficient players
      const n = Math.abs(teamR.length - teamB.length);
      if (players.length == 1) {
        quickRestart();
        loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);
        room.setPlayerTeam(players[0].id, Team.RED);
        return;
      } else if (players.length == 6) {
        quickRestart();
        loadMap(x3Map, scoreLimitx3, timeLimitx3);
      }
      if (players.length == maxTeamSize * 2 - 1) {
        allReds = [];
        allBlues = [];
      }
      if (teamR.length > teamB.length) {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
        }
      } else {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
        }
      }
    } else if (
      Math.abs(teamR.length - teamB.length) < teamS.length &&
      teamR.length != teamB.length
    ) {
      //choose mode
      room.pauseGame(true);
      activateChooseMode();
      choosePlayer();
    } else if (
      teamS.length >= 2 &&
      teamR.length == teamB.length &&
      teamR.length < maxTeamSize
    ) {
      //2 in red 2 in blue and 2 or more spec
      if (teamR.length == 2) {
        quickRestart();
        if (!teamS.length == 2) {
          loadMap(x3Map, scoreLimitx3, timeLimitx3);
        }
      }
      topBtn();
    }
  }
}

function choosePlayer() {
  clearTimeout(timeOutCap);
  if (teamR.length <= teamB.length && teamR.length != 0) {
    room.sendAnnouncement(
      "[PV] Para escolher um player, insira seu número da lista ou use 'top', 'random' ou 'bottom'.",
      teamR[0].id,
      0xe7ff0f,
      "bold"
    );
    timeOutCap = setTimeout(
      function (player) {
        room.sendChat(
          "[PV] Vai rápido @" +
            player.name +
            ", apenas " +
            Number.parseInt(chooseTime / 2) +
            " segundos restantes para escolher !",
          player.id
        );
        timeOutCap = setTimeout(
          function (player) {
            room.kickPlayer(player.id, "Você não escolheu a tempo !", false);
          },
          chooseTime * 500,
          teamR[0]
        );
      },
      chooseTime * 1000,
      teamR[0]
    );
  } else if (teamB.length < teamR.length && teamB.length != 0) {
    room.sendAnnouncement(
      "[PV] Para escolher um jogador, insira seu número da lista ou use 'top', 'random' ou 'bottom'.",
      teamB[0].id,
      0xe7ff0f,
      "bold"
    );
    timeOutCap = setTimeout(
      function (player) {
        room.sendChat(
          "[PV] Vai rápido @" +
            player.name +
            ", apenas " +
            Number.parseInt(chooseTime / 2) +
            " segundos restantes para escolher !",
          player.id
        );
        timeOutCap = setTimeout(
          function (player) {
            room.kickPlayer(player.id, "Você não escolheu a tempo !", false);
          },
          chooseTime * 500,
          teamB[0]
        );
      },
      chooseTime * 1000,
      teamB[0]
    );
  }
  if (teamR.length != 0 && teamB.length != 0)
    getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
}

function gambiarrabug(num) {
  if (num == 1) {
    setTimeout(() => {
      getSpecList(teamB[0]);
    }, 100);
    return;
  }
  if (num == 2) {
    setTimeout(() => {
      getSpecList(teamR[0]);
    }, 100);
    return;
  }
}

function getSpecList(player) {
  if (teamB.length == 0) {
    room.setPlayerTeam(teamS[0].id, Team.BLUE);
    gambiarrabug(1);
    return;
  }
  if (teamR.length == 0) {
    room.setPlayerTeam(teamS[0].id, Team.RED);
    gambiarrabug(2);
    return;
  }
  var cstm = "[PV] Jogadores : ";
  for (var i = 0; i < teamS.length; i++) {
    if (140 - cstm.length < (teamS[i].name + "[" + (i + 1) + "], ").length) {
      room.sendChat(cstm, player.id);
      cstm = "... ";
    }
    cstm += teamS[i].name + "[" + (i + 1) + "], ";
  }

  cstm = cstm.substring(0, cstm.length - 2);
  cstm += ".";
  room.sendChat(cstm, player.id);
}

/* STATS FUNCTIONS */

function getLastTouchOfTheBall() {
  const ballPosition = room.getBallPosition();
  updateTeams();
  for (var i = 0; i < players.length; i++) {
    if (players[i].position != null) {
      var distanceToBall = pointDistance(players[i].position, ballPosition);
      if (distanceToBall < triggerDistance) {
        !activePlay ? (activePlay = true) : null;
        if (
          lastTeamTouched == players[i].team &&
          lastPlayersTouched[0] != null &&
          lastPlayersTouched[0].id != players[i].id
        ) {
          lastPlayersTouched[1] = lastPlayersTouched[0];
          lastPlayersTouched[0] = players[i];
        }
        lastTeamTouched = players[i].team;
      }
    }
  }
}

function getStats() {
  // gives possession, ball speed and GK of each team
  if (activePlay) {
    updateTeams();
    lastTeamTouched == Team.RED ? Rposs++ : Bposs++;
    var ballPosition = room.getBallPosition();
    point[1] = point[0];
    point[0] = ballPosition;
    ballSpeed = (pointDistance(point[0], point[1]) * 60 * 60 * 60) / 15000;
    var k = [-1, Infinity];
    for (var i = 0; i < teamR.length; i++) {
      if (teamR[i].position.x < k[1]) {
        k[0] = teamR[i];
        k[1] = teamR[i].position.x;
      }
    }
    k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
    k = [-1, -Infinity];
    for (var i = 0; i < teamB.length; i++) {
      if (teamB[i].position.x > k[1]) {
        k[0] = teamB[i];
        k[1] = teamB[i].position.x;
      }
    }
    k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
    findGK();
  }
}

function updateStats() {
  if (
    players.length >= 2 * maxTeamSize &&
    (game.scores.time >= (5 / 6) * game.scores.timeLimit ||
      game.scores.red == game.scores.scoreLimit ||
      game.scores.blue == game.scores.scoreLimit) &&
    allReds.length >= maxTeamSize &&
    allBlues.length >= maxTeamSize
  ) {
    var stats;
    for (var i = 0; i < allReds.length; i++) {
      localStorage.getItem(getAuth(allReds[i]))
        ? (stats = JSON.parse(localStorage.getItem(getAuth(allReds[i]))))
        : (stats = [
            0,
            0,
            0,
            0,
            "0.00",
            0,
            0,
            0,
            0,
            "0.00",
            "player",
            allReds[i].name,
          ]);
      stats[Ss.GA]++;
      lastWinner == Team.RED
        ? stats[Ss.WI]++
        : lastWinner == Team.BLUE
        ? stats[Ss.LS]++
        : stats[Ss.DR]++;
      stats[Ss.WR] = ((100 * stats[Ss.WI]) / stats[Ss.GA]).toPrecision(3);
      localStorage.setItem(getAuth(allReds[i]), JSON.stringify(stats));
    }
    for (var i = 0; i < allBlues.length; i++) {
      localStorage.getItem(getAuth(allBlues[i]))
        ? (stats = JSON.parse(localStorage.getItem(getAuth(allBlues[i]))))
        : (stats = [
            0,
            0,
            0,
            0,
            "0.00",
            0,
            0,
            0,
            0,
            "0.00",
            "player",
            allBlues[i].name,
          ]);
      stats[Ss.GA]++;
      lastWinner == Team.BLUE
        ? stats[Ss.WI]++
        : lastWinner == Team.RED
        ? stats[Ss.LS]++
        : stats[Ss.DR]++;
      stats[Ss.WR] = ((100 * stats[Ss.WI]) / stats[Ss.GA]).toPrecision(3);
      localStorage.setItem(getAuth(allBlues[i]), JSON.stringify(stats));
    }
    for (var i = 0; i < game.goals.length; i++) {
      if (game.goals[i].striker != null) {
        if (
          allBlues
            .concat(allReds)
            .findIndex((player) => player.id == game.goals[i].striker.id) != -1
        ) {
          stats = JSON.parse(
            localStorage.getItem(getAuth(game.goals[i].striker))
          );
          stats[Ss.GL]++;
          localStorage.setItem(
            getAuth(game.goals[i].striker),
            JSON.stringify(stats)
          );
        }
      }
      if (game.goals[i].assist != null) {
        if (
          allBlues
            .concat(allReds)
            .findIndex((player) => player.name == game.goals[i].assist.name) !=
          -1
        ) {
          stats = JSON.parse(
            localStorage.getItem(getAuth(game.goals[i].assist))
          );
          stats[Ss.AS]++;
          localStorage.setItem(
            getAuth(game.goals[i].assist),
            JSON.stringify(stats)
          );
        }
      }
    }
    if (allReds.findIndex((player) => player.id == GKList[0].id) != -1) {
      stats = JSON.parse(localStorage.getItem(getAuth(GKList[0])));
      stats[Ss.GK]++;
      game.scores.blue == 0 ? stats[Ss.CS]++ : null;
      stats[Ss.CP] = ((100 * stats[Ss.CS]) / stats[Ss.GK]).toPrecision(3);
      localStorage.setItem(getAuth(GKList[0]), JSON.stringify(stats));
    }
    if (allBlues.findIndex((player) => player.id == GKList[1].id) != -1) {
      stats = JSON.parse(localStorage.getItem(getAuth(GKList[1])));
      stats[Ss.GK]++;
      game.scores.red == 0 ? stats[Ss.CS]++ : null;
      stats[Ss.CP] = ((100 * stats[Ss.CS]) / stats[Ss.GK]).toPrecision(3);
      localStorage.setItem(getAuth(GKList[1]), JSON.stringify(stats));
    }
  }
}

function findGK() {
  var tab = [
    [-1, ""],
    [-1, ""],
  ];
  for (var i = 0; i < extendedP.length; i++) {
    if (
      room.getPlayer(extendedP[i][eP.ID]) != null &&
      room.getPlayer(extendedP[i][eP.ID]).team == Team.RED
    ) {
      if (tab[0][0] < extendedP[i][eP.GK]) {
        tab[0][0] = extendedP[i][eP.GK];
        tab[0][1] = room.getPlayer(extendedP[i][eP.ID]);
      }
    } else if (
      room.getPlayer(extendedP[i][eP.ID]) != null &&
      room.getPlayer(extendedP[i][eP.ID]).team == Team.BLUE
    ) {
      if (tab[1][0] < extendedP[i][eP.GK]) {
        tab[1][0] = extendedP[i][eP.GK];
        tab[1][1] = room.getPlayer(extendedP[i][eP.ID]);
      }
    }
  }
  GKList = [tab[0][1], tab[1][1]];
}

setInterval(() => {
  var tableau = [];
  if (statNumber % 5 == 0) {
    Object.keys(localStorage).forEach(function (key) {
      if (
        ![
          "player_name",
          "view_mode",
          "geo",
          "avatar",
          "player_auth_key",
        ].includes(key)
      ) {
        tableau.push([
          JSON.parse(localStorage.getItem(key))[Ss.NK],
          JSON.parse(localStorage.getItem(key))[Ss.GA],
        ]);
      }
    });
    if (tableau.length < 5) {
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendChat(
      "Partidas Jogadas> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1]
    );
  }
  if (statNumber % 5 == 1) {
    Object.keys(localStorage).forEach(function (key) {
      if (
        ![
          "player_name",
          "view_mode",
          "geo",
          "avatar",
          "player_auth_key",
        ].includes(key)
      ) {
        tableau.push([
          JSON.parse(localStorage.getItem(key))[Ss.NK],
          JSON.parse(localStorage.getItem(key))[Ss.WI],
        ]);
      }
    });
    if (tableau.length < 5) {
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendChat(
      "Vitórias> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1]
    );
  }
  if (statNumber % 5 == 2) {
    Object.keys(localStorage).forEach(function (key) {
      if (
        ![
          "player_name",
          "view_mode",
          "geo",
          "avatar",
          "player_auth_key",
        ].includes(key)
      ) {
        tableau.push([
          JSON.parse(localStorage.getItem(key))[Ss.NK],
          JSON.parse(localStorage.getItem(key))[Ss.GL],
        ]);
      }
    });
    if (tableau.length < 5) {
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendChat(
      "Gols> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1]
    );
  }
  if (statNumber % 5 == 3) {
    Object.keys(localStorage).forEach(function (key) {
      if (
        ![
          "player_name",
          "view_mode",
          "geo",
          "avatar",
          "player_auth_key",
        ].includes(key)
      ) {
        tableau.push([
          JSON.parse(localStorage.getItem(key))[Ss.NK],
          JSON.parse(localStorage.getItem(key))[Ss.AS],
        ]);
      }
    });
    if (tableau.length < 5) {
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendChat(
      "Assistências> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1]
    );
  }
  if (statNumber % 5 == 4) {
    Object.keys(localStorage).forEach(function (key) {
      if (
        ![
          "player_name",
          "view_mode",
          "geo",
          "avatar",
          "player_auth_key",
        ].includes(key)
      ) {
        tableau.push([
          JSON.parse(localStorage.getItem(key))[Ss.NK],
          JSON.parse(localStorage.getItem(key))[Ss.CS],
        ]);
      }
    });
    if (tableau.length < 5) {
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendChat(
      "CS> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1]
    );
  }
  statNumber++;
}, statInterval * 60 * 1000);

/* EVENTS */

/* PLAYER MOVEMENT */

function sendAnnouncementToDiscord(message) {
  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/1083885544041349232/tnIABhPpC_r0Q6LI_Ekywl8XsZyxobnF2FnoVZ5C6h8q-8guLir9Io8tEHN70QYSGeNz"
  );

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    avatar_url: "",
    username: "Log",
    content: message,
  };

  request.send(JSON.stringify(params));
}

const bancoDeReservas = {
  red: { x: -398.74604733933876, y: -256 },
  blue: { x: 399.04863566358483, y: -256 },
  redQuit: {},
  blueQuit: {},
};

var nameblacklist = [];
var arrombados = [];
var whitelist = [];
var fakelist = [];
var marcados = [];
var arrombadinho = [];
var ipmarcados = [
  "191.163.15.93",
  "187.126.211.34",
  "45.190.36.169",
  "187.16.187.125",
  "179.189.138.37",
  "179.185.141.127",
  "179.189.138.58",
  "181.220.119.21",
  "179.189.138.58",
  "143.137.119.69",
  "138.255.109.37",
  "201.29.202.148",
  "45.162.57.207",
  "201.88.113.125",
];
var premiado = [];
var premiadoverify = [];
var nicksCadastrados = [];

var nicksproibidos = ["@everyone", "@here", "® noia ®    original"];
var fdp = [];
var FF = [];

var log;

var listadejogadores = room.getPlayerList();

var registro = new Map();
const css = "border:2px solid;padding:8px;background:";

// FUNÇÕES DA DB

// aqui acontecerá um request para o localhost:3000 para pegar a lista de banidos
const getBanidos = async (player) => {
  console.log("pegando banidos...");
  const response = await fetch("http://localhost:8000/banidos");
  const data = await response.json();
  // verifica se o ip ou auth do jogador está na lista de banidos

  console.log(data);
  if (
    data.find((b) => b.auth === player.auth) ||
    data.find((b) => b.ip === decryptHex(player.conn))
  ) {
    room.kickPlayer(
      player.id,
      "Você está banido permanente.",
      true
    );
  }
};

// aqui acontecerá um request para o localhost:3000 para adicionar o jogador na lista de banidos
const banPlayer = async (player, banidor) => {
  let playerIP = extendedP.find((ep) => ep[eP.ID] === player.id);
  playerIP = decryptHex(playerIP[eP.CONN]);
  const response = await fetch("http://localhost:8000/banidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth: getAuth(player),
      ip: playerIP,
      banidor,
    }),
  });
  const data = await response.json();
  console.log(data);
};

// funções do evento natalino

const papaiNoel = () => {
  const jogadores = room.getPlayerList().filter((p) => p.id );
  const playersInventories = localStorage.getItem("playersInventories") || "[]";

  const presentes = [
    { title: "Uniforme Fim de Ano 2022", limited: true },
    { title: "Título de Papai Noel", limited: true },
    { title: "Título de Elfo", limited: true },
    { title: "Ficha para provocação", limited: false },
    { title: "Ficha para uniforme", limited: false },
    { title: "Ficha para comemoração", limited: false },
  ];

  // aqui um jogador aleatório ganha um presente aleatório
  const jogador = jogadores[Math.floor(Math.random() * jogadores.length)];
  const presente = presentes[Math.floor(Math.random() * presentes.length)];

  // aqui o presente é adicionado ao inventário do jogador
  const inventario = JSON.parse(playersInventories);
  const jogadorInventario = inventario.find((i) => i.id === jogador.id);

  if (jogadorInventario) {
    // checa se o presente é limitado
    if (presente.limited) {
      // se o presente for limitado, checa se o jogador já tem o presente
      if (jogadorInventario.items.find((i) => i.title === presente.title)) {
        // se o jogador já tiver o presente, ele não ganha nada
        return;
      }
    }
    // se o presente não for limitado ou se o jogador não tiver o presente, ele ganha o presente
    jogadorInventario.items.push(presente);
  } else {
    // se o jogador não tiver inventário, ele ganha o presente
    inventario.push({ auth: getAuth(jogador), items: [presente] });
  }

  // aqui o inventário do jogador é salvo
  localStorage.setItem("playersInventories", JSON.stringify(inventario));

  // aqui o jogador é avisado que ganhou o presente
  room.sendAnnouncement(
    `Você achou um presente: ${presente.title}`,
    jogador.id,
    0x33f24c,
    "bold",
    2
  );

  // aqui o presente é avisado no chat
  room.sendAnnouncement(
    `O jogador ${jogador.name} achou um presente: ${presente.title}`,
    null,
    0x33f24c,
    "bold",
    2
  );
};

// Funções dos comandos.
function setRegister(player, senha) {
  if (registro.get(player.name) || nicksCadastrados.includes(player.name))
    room.sendAnnouncement(
      "Você já está registrado.",
      player.id,
      0x7fc947,
      "normal",
      2
    );
  else {
    registro.set(player.name, senha);
    localStorage.setItem("registros", JSON.stringify([...registro]));
    room.sendAnnouncement("Registrado!", player.id, 0x33f24c, "normal", 2);
    room.sendAnnouncement(`Senha: ${senha}`, player.id, 0x33f24c, "normal", 2);
  }
}

function getLogin(player, senha) {
  if (registro.get(player.name)) {
    if (registro.get(player.name) == senha) {
      room.sendAnnouncement(
        "O player " + player.name + " logou !",
        player.id,
        0x34eb49,
        "normal",
        1
      );
      logados.push(player.id);
    } else
      room.sendAnnouncement(
        "Senha incorreta.",
        player.id,
        0xe60909,
        "normal",
        2
      );
  } else
    room.sendAnnouncement(
      "Você não tem registro. Digite !register senha para se registrar.",
      player.id,
      0xfcec56,
      "normal",
      2
    );
}

let paletadecores = {
  Vermelho: 0xfa5646,
  Laranja: 0xffc12f,
  Verde: 0x7dfa89,
  Azul: 0x05c5ff,
  Amarelo: 0xffff17,
  Cinza: 0xcccccc,
  Branco: 0xffffff,
};

const calladmin = ["!calladmin", "!chamaradm"];

const listaDePlayers = {};

const nameToAuth = {};

const nameToID = {};

const listadeIP = [];

const exclusaoIP = ["177.21.142.25", "181.225.182.99", "187.86.69.160"];

room.onPlayerJoin = function (player) {
  if (registro.get(player.name)) {
    room.sendAnnouncement("!login senha", player.id);
  } else {
    room.sendAnnouncement(
      "Se registre com o comando: !register senha",
      player.id
    );
  }
  nameToAuth[player.name] = player.auth;
  listaDePlayers[player.id] = player.auth;
  nameToID[player.name] = player.id;
  if (listadeIP.includes(player.conn) && !exclusaoIP.includes(decryptHex(player.conn))) {
    room.kickPlayer(player.id, "Este IP já está na sala.", false);
    listadeIP.push(player.conn);
  } else listadeIP.push(player.conn);

  console.log("---------------------------------------------------");
  console.log("[📢]Nick: " + player.name);
  console.log("[📢]IP: " + player.conn);
  console.log("[📢]Auth: " + player.auth);
  extendedP.push([player.id, player.auth, player.conn, false, 0, 0, false]);
  console.log(extendedP);
  updateRoleOnPlayerIn();
  if (player.name.trim().length < 2) {
    room.kickPlayer(player.id, "Nickname muito curto.", false);
  }

  if (player.name.split(" ").length > 1) {
    if (
      player.name.split(" ")[0].toLowerCase() === "macaco" ||
      player.name.split(" ")[1].toLowerCase() === "macaco"
    ) {
      room.kickPlayer(player.id, "Nick inapropriado", false);
    }
  }

  if (fdp.includes(player.auth) == true) {
    room.kickPlayer(player.id, "Banido.", false);
  }

  sendAnnouncementToDiscord(`${
    player.name
  } entrou em uma sala. Confira as informações: \`\`\`json
  {
  "IPv4":"${decryptHex(player.conn)}",
  "Auth":"${player.auth}",
  "Sala":"${roomName}"
  }
  \`\`\``);

  // MELHORES DA TEMPORADA

  if (nicksproibidos.includes(player.name.toLowerCase()) == true) {
    room.kickPlayer(
      player.id,
      "Esse nickname é inapropriado. Relogue usando outro nick.",
      false
    );
  }

  if (nameblacklist.includes(player.auth) == true) {
    room.kickPlayer(
      player.id,
      "Você está banido. Para revisão, utilize o Discord.",
      true
    ); //If the player's name is in the blacklist. This row happens and player is banned.
  } else if (ipmarcados.includes(`${decryptHex(player.conn)}`) == true) {
    room.kickPlayer(
      player.id,
      "Você está banido. Para revisão, utilize o Discord.",
      true
    );
  } else if (
    nickAdmins.includes(player.name) == true &&
    authAdmins.includes(player.auth) == false
  ) {
    room.kickPlayer(
      player.id,
      "Você não é autorizado para entrar com esse nickname.",
      false
    );
  } else if (
    nickFriends.includes(player.name) == true &&
    authFriends.includes(player.auth) == false
  ) {
    room.kickPlayer(
      player.id,
      "Você não é autorizado para entrar com esse nickname.",
      false
    );
}

  getBanidos(player);

  if (localStorage.getItem("moderadores")) {
    const moderadores = JSON.parse(localStorage.getItem("moderadores"));
    const modObj = moderadores.find((m) => m.auth === player.auth);
    if (modObj) {
      console.log("moderador achado");
      if (player.name === modObj.nick) {
        console.log("nome achado");
        if (!nickMods.includes(player.name)) {
          nickMods.push(player.name);
        }
        if (!anonMods.includes(player.name)) {
          anonMods.push(player.name);
        }
      } else {
        if (!anonMods.includes(player.name)) {
          anonMods.push(player.name);
        }
        room.sendAnnouncement(
          "Você entrou no modo MODERADOR ANÔNIMO.",
          player.id,
          paletadecores.Laranja,
          "bold",
          2
        );
      }
    } else {
      if (moderadores.find((m) => m.nick === player.name)) {
        room.kickPlayer(
          player.id,
          "Você não é autorizado para entrar com esse nickname.",
          false
        );
      }
    }
  } else if (marcados.includes(player.name) == true) {
    room.kickPlayer(player.id, "Você está banido.", true);
  } else if (arrombados.includes(player.auth) == true) {
    room.kickPlayer(player.id, "VOCE TA BANIDO PRA SEMPRE, PAU NO CU", true); //If the player's name is in the blacklist. This row happens and player is banned.
  }

  room.sendAnnouncement(
    "---------------------------------------------------",
    player.id,
    0x5ee7ff
  );
  room.sendAnnouncement(
    "👋 𝗕𝗲𝗺-𝘃𝗶𝗻𝗱𝗼, " + player.name + " 𝗮 𝗙𝗠𝗧 𝗔𝗿𝗲𝗻𝗮!",
    null,
    0x5ee7ff
  );
  room.sendAnnouncement(
    "𝑭𝒊𝒒𝒖𝒆 𝒑𝒐𝒓 𝒅𝒆𝒏𝒕𝒓𝒐 𝒅𝒂𝒔 𝒏𝒐𝒗𝒊𝒅𝒂𝒅𝒆𝒔 👉 https://discord.gg/AYB39pWa2V",
    player.id,
    0x5ee7ff
  );
  room.sendAnnouncement(
    "---------------------------------------------------",
    player.id,
    0x5ee7ff
  );

  room.sendAnnouncement(
    "Para se registrar, digite: !register senha",
    player.id,
    0x34eb74,
    "bold",
    2
  );
  room.sendAnnouncement(
    "Para logar, digite: !login senha",
    player.id,
    0x34eb74,
    "bold",
    2
  );
   room.sendAnnouncement(
    "",
    player.id,
    0x34eb74,
    "bold",
    2
  );

  room.sendAnnouncement(
    "Estamos na Temporada 9. Os TOPs 1, CS, Gols, Assists e Wins ganham 1 mês de Deluxe.",
    player.id,
    0xFFFFFF,
    "bold",
    2
  );
  room.sendAnnouncement(
    "A temporada 9 se encerra no dia 31 de Julho.",
    player.id,
    0xFFFFFF,
    "bold",
    2
  );
  room.sendAnnouncement(
    "Para mais informações, acesse o nosso !discord.",
    player.id,
    0xFFFFFF,
    "bold",
    2
  );
  

  if (nickFriends.includes(player.name) == true) {
    room.sendAnnouncement(
      "Você é um MODERADOR AMIGO! Caso haja necessidade use !mod24 -Use com responsabilidade, " +
        player.name +
        " !!!!!",
      player.id,
      0x7e76ff,
      "bold"
    );
  }
  
  if(nicktopgk.includes(player.name)==true){
		room.sendAnnouncement("O melhor GK da temporada acabou de entrar, " + player.name + " !!!!!", null, 0x7E76FF, 'bold');
	}
	
	if(nicktopgoals.includes(player.name)==true){
		room.sendAnnouncement("O artilheiro da temporada acabou de entrar, " + player.name + " !!!!!", null, 0x7E76FF, 'bold');
	}
	
	if(nicktoppass.includes(player.name)==true){
		room.sendAnnouncement("O garçom da temporada acabou de entrar, " + player.name + " !!!!!", null, 0x7E76FF, 'bold');
	}

  if (localStorage.getItem(player.auth) != null) {
    var playerRole = JSON.parse(localStorage.getItem(player.auth))[Ss.RL];
    if (playerRole == "admin" || playerRole == "master") {
      room.setPlayerAdmin(player.id, true);
      room.sendAnnouncement(
        "Admin 「" + player.name + "」 Entrou para por ordem na sala!",
        null,
        0xff7900,
        "bold"
      );
    }
  }
  if (localStorage.getItem(getAuth(player)) == null) {
    stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", player.name];
    localStorage.setItem(getAuth(player), JSON.stringify(stats));
  }

  if (localStorage.getItem("listavip")) {
    const listaVipObj = JSON.parse(localStorage.getItem("listavip"));
    if (!listaVipObj.umMes) {
      listaVipObj.umMes = [];
      localStorage.setItem("listavip", JSON.stringify(listaVipObj));
    }
    const seteDias = listaVipObj.umaSemana;
    const umMes = listaVipObj.umMes;
    const thisTime = new Date();
    if (seteDias.find((p) => p.auth === player.auth)) {
      const playerIndex = seteDias.findIndex((p) => p.auth === player.auth);
      const diff = Math.abs(seteDias[playerIndex].setTime - thisTime.getTime());
      const inDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (inDays - 1 > 7) {
        seteDias.splice(playerIndex);
        listaVipObj.umaSemana = seteDias;
        localStorage.setItem("listavip", JSON.stringify(listaVipObj));
        room.sendAnnouncement(
          "Seu VIP de 7 dias expirou.",
          player.id,
          paletadecores.Laranja,
          "bold"
        );
      } else {
        vipverify.push(player.id);
        vipzinho.push(player.id);
      }
    }
    if (umMes.find((p) => p.auth === player.auth)) {
      const playerIndex = umMes.findIndex((p) => p.auth === player.auth);
      const diff = Math.abs(umMes[playerIndex].setTime - thisTime.getTime());
      const inDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (inDays - 1 > 30) {
        umMes.splice(playerIndex);
        listaVipObj.umMes = umMes;
        localStorage.setItem("listavip", JSON.stringify(listaVipObj));
        room.sendAnnouncement(
          "Seu DELUXE de 30 dias expirou.",
          player.id,
          paletadecores.Laranja,
          "bold"
        );
      } else {
        vipverify.push(player.id);
        vipsupremao.push(player.id);
        supremoLoja.push(player.id);
      }
    }
  }
};

room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
  if (changedPlayer.id == 0) {
    room.setPlayerTeam(0, Team.SPECTATORS);
    return;
  }
  if (getAFK(changedPlayer) && changedPlayer.team != Team.SPECTATORS) {
    room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
    room.sendChat(changedPlayer.name + " está AFK !");
    return;
  }
  updateTeams();
  if (room.getScores() != null) {
    var scores = room.getScores();
    if (
      changedPlayer.team != Team.SPECTATORS &&
      scores.time <= (3 / 4) * scores.timeLimit &&
      Math.abs(scores.blue - scores.red) < 2
    ) {
      changedPlayer.team == Team.RED
        ? allReds.push(changedPlayer)
        : allBlues.push(changedPlayer);
    }
  }
  if (changedPlayer.team == Team.SPECTATORS) {
    setActivity(changedPlayer, 0);
  }

  if (AFKPause && changedPlayer.team !== Team.SPECTATORS) {
    quickRestart();
    for (var i in AFKRed) {
      clearTimeout(AFKRed[i]);
    }
    for (var i in AFKBlue) {
      clearTimeout(AFKBlue[i]);
    }
  }

  if (inChooseMode && resettingTeams == false && byPlayer.id == 0) {
    if (Math.abs(teamR.length - teamB.length) == teamS.length) {
      deactivateChooseMode();
      resumeGame();
      var b = teamS.length;
      if (teamR.length > teamB.length) {
        for (var i = 0; i < b; i++) {
          setTimeout(() => {
            room.setPlayerTeam(teamS[0].id, Team.BLUE);
          }, 200 * i);
        }
      } else {
        for (var i = 0; i < b; i++) {
          setTimeout(() => {
            room.setPlayerTeam(teamS[0].id, Team.RED);
          }, 200 * i);
        }
      }
      return;
    } else if (
      (teamR.length == maxTeamSize && teamB.length == maxTeamSize) ||
      (teamR.length == teamB.length && teamS.length < 2)
    ) {
      deactivateChooseMode();
      resumeGame();
    } else if (teamR.length <= teamB.length && redCaptainChoice != "") {
      // choice remembered
      redCaptainChoice == "top"
        ? room.setPlayerTeam(teamS[0].id, Team.RED)
        : redCaptainChoice == "random"
        ? room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED)
        : room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
      return;
    } else if (teamB.length < teamR.length && blueCaptainChoice != "") {
      blueCaptainChoice == "top"
        ? room.setPlayerTeam(teamS[0].id, Team.BLUE)
        : blueCaptainChoice == "random"
        ? room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE)
        : room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
      return;
    } else {
      choosePlayer();
    }
  }

  if (isGameRunning && changedPlayer.team !== Team.SPECTATORS) {
    if (bancoDeReservas.redQuit && bancoDeReservas.blueQuit) {
      changedPlayer.team === Team.RED
        ? room.setPlayerDiscProperties(
            changedPlayer.id,
            bancoDeReservas.redQuit
          )
        : room.setPlayerDiscProperties(
            changedPlayer.id,
            bancoDeReservas.blueQuit
          );
    } else {
      changedPlayer.team === Team.RED
        ? room.setPlayerDiscProperties(changedPlayer.id, bancoDeReservas.red)
        : room.setPlayerDiscProperties(changedPlayer.id, bancoDeReservas.blue);
    }
  }
};

room.onPlayerLeave = function (player) {
	if(isGameRunning && player.team) {
		player.team === 1 ? bancoDeReservas.redQuit = player.position : bancoDeReservas.blueQuit = player.position
	}
	
    if (teamR.findIndex((red) => red.id == player.id) == 0 && inChooseMode && teamR.length <= teamB.length) {
        choosePlayer();
        capLeft = true; setTimeout(() => { capLeft = false; }, 10);
    }
    if (teamB.findIndex((blue) => blue.id == player.id) == 0 && inChooseMode && teamB.length < teamR.length) {
        choosePlayer();
        capLeft = true; setTimeout(() => { capLeft = false; }, 10);
    }
	
	console.log(player)
	
	const playerConn = extendedP.find(p => p[1] === getAuth(player))[2]
	
	
	
	console.log(getAuth(player))
	listadeIP.splice(listadeIP.indexOf(playerConn), 1)
	delete nameToAuth[player.name]
	delete listaDePlayers[player.id]
	delete nameToID[player.name]
    setActivity(player, 0);
    updateRoleOnPlayerOut();
}

function sendBanToDiscord(message) {
  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/1084519981934456855/847P8Y0ReSfzZ9eOIaO0wEKi_GRXvshG2y3CLmxaJOmNVpYObG-EhwM4CzIvSrMHX7Lh"
  );

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    avatar_url: "",
    username: "Bans",
    content: message,
  };

  request.send(JSON.stringify(params));
}

room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
  ban == true ? banList.push([kickedPlayer.name, kickedPlayer.id]) : null;
  ban
    ? sendBanToDiscord(
        `O player ${kickedPlayer.name} foi banido por ${byPlayer.name} da sala ${roomName}. MOTIVO: ${reason}`
      )
    : null;
  console.log(
    `O player ${kickedPlayer.name} foi banido por ${byPlayer.name} da sala ${roomName}. MOTIVO: ${reason}`
  );
};

/*Sistema de Level*/

var nickpremium = ["zv-0s8"];
var playerxp = 0;
var level = 1;

/*ADMINS E MODS*/

var nickAdmins = ["𝓕", "Meins", "tw", "David", "@bz7zs"];
var authAdmins = [
  "ANnxAgV1XfqXF96WjigVW7UtkKZHoBIAvku386REFz8",
  "2qkfa8JsOG7JV8ZeIWSd4nA1CnNgxeUjlO3iIxKXS2g",
  "VyzLIcUbVPrphrg8qXAF_fTJk6P7VfNwi7mPJ5fS-Z0",
  "-UpBysvR9wfHPmUiFyXdSxtRwVhlsRXow8VSg19IfYY",
  "NQGv6-DnnEdSqBvEOpKbrx2jtXiHGNBzPLIItDx-J1k",
  "EJWKsXpV8IxweYt8qW4TcdIZLp5WtSkewXjqIFvRNRo",
  "m0W7fx4qW0DAXs19W3B-JfjZfEYcu-PE-b0OxkndJVM",
  "IY3tg49YMShwhDjOJiU7bIQIyjT6-9NbPi6Di-VZ-Qk",
];
var nickMods = [
  "jacare",
];
var anonMods = [];
var authMods = [
  "gYEvoP0nq2uFTof-WS-ennDxLb_Tf8BBSdsSHqNf1kIs8",

];

var nickFriends = ['jacares']
var authFriends = ['gYEvoP0nq2uFTof-WS-ennDxLb_Tf8BBSdsSHqNf1kIs8'];

/*MELHORES DA TEMPORADA*/

var nicktopgk = ['nao sou eu'];

var nicktopgoals = ['jaum'];

var nicktoppass = ['Mahrez'];

/*CAMPEÕES DO CAMP */

var campeoes = ['ganso', 'lemos', 'Maia', 'Romário', 'qdle'];

/* PLAYER ACTIVITY */

var vips = [];
var helpers = [];
var campeoes1 = [];
var mods = [];
var staff = [];
var adms = [];
var cadastrados = [];

let mensagensdodia = [
  "O entusiasmo é a maior força da alma. Conserva-o e nunca te faltará poder para conseguires o que desejas.",
  "A persistência é o caminho do êxito.",
  "Lute. Acredite. Conquiste. Perca. Deseje. Espere. Alcance. Invada. Caia. Seja tudo o quiser ser, mas, acima de tudo, seja você sempre.",
  "O insucesso é apenas uma oportunidade para recomeçar com mais inteligência.",
  "Você precisa fazer aquilo que pensa que não é capaz de fazer.",
  "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.",
  "Nossa maior fraqueza está em desistir. O caminho mais certo de vencer é tentar mais uma vez.",
  "A verdadeira motivação não é aquilo que te anima, mas aquilo que te transforma...",
  "Não deixe as coisas que você não pode fazer impedi-lo de fazer as coisas que pode",
  "A melhor maneira de aprender seja o que é for, é fazendo.",
  "Não importa aonde você está, e sim aonde quer chegar.",
];

var usomensagem = [];

var senhaCadastrados = [];
var logados = [];
var permitidol = [];
var tovipsetting = ["xMKp@0sjxP2z!"];
var booster = [];

var campliga1 = [];
var campliga2 = [];
var campliga3 = [];
var campliga4 = [];

var vipverify = [];
var vipsupremao = [
  "Ph0CVpboAfU4RwpTb5pub4cTpez7XgHrEU8jpTgBQc0",
  "IesH9W7_WE-gKa6AA1aof-19z6b9IUsgkP2e4aR9n8w",
  "QM8GzK1QQ4-Jw9dcnRcAhe97IcgDSPs27wecCh8n9nc",
  "SmtsgOT-JKkslkPdoidBWv8k4BK2pIKXMXBlfSrH6ik",
  "G-DkhYJ8IAvvcD1Ag9qY1z8_RrUlCk9P84sS17U_fTc",
  "heFq9i_050qQjcsD9haNTIDTLk-S0vFs1g3OHObFfPY",
  "nphb1sjaAJzM1Zk_gKUFmKxI4SSmeBnDJPEd2U4dI6M",
  "aTww_ze6aYX0B7Z0X-n1I49akCPacdu8cgIhCdnbbv4",
  "rRxZZD48cwQ2aXa28VQxxuRg5hLGKgUAhNyhUhciiQ0",
];
var supremoLoja = [];
var ovALL = [];
var goalkeeper = [];
var goaler = [];
var assistent = [];

var mvpp = [];

/* RANK */

var level = [];
var xpgoal = 50;
var xpassist = 25;
var xpcs = 40;
var xpwin = 30;

let jogadoresz = [];

var messageHistory = [0, 0, 0, 0, 0, 0]; //Primary array of players ids who sent messages (placeholder)
var messageCounter = 0; //Count how many times player sent messages if conditions are true

var futsalzin = "s";
var testezinho = [];

function sendAnnouncementToTheDiscord(message) {
  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/1084520622719250594/DWAlypWdCwTNkKdUPvtsw48SdaZdrXj90p2bP05DT9XxdcuQnxtHOd_1heuj-TekhpQ4"
  );


  request.setRequestHeader("Content-type", "application/json");

  var params = {
    avatar_url: "",
    username: "CALLADMIN",
    content: message,
    allowed_mentions: {
      parse: [],
    },
  };

  request.send(JSON.stringify(params));
}

function sendbantToTheDiscord(message) {
  var request = new XMLHttpRequest();
  request.open("POST", "x");

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    avatar_url: "",
    username: "BAN",
    content: message,
    allowed_mentions: {
      parse: [],
    },
  };

  request.send(JSON.stringify(params));
}

var WebHookURL;

var WebHookURL;

if (roomName === "🔥 FMT 🔥| RAPIDEX | X3") {
  WebHookURL =
    "https://discord.com/api/webhooks/1083885419122409594/o9u8DDeF9dQPtUwRuLTCcO5FFDc8DHKjvmM12-l3g_qbffl4LCD_qIM9Iay0EP07A9YW";
}

if (roomName === "🔥 FMT 🔥| PEREBAS | X3") {
  WebHookURL =
    "https://discord.com/api/webhooks/1019436435620773928/frId1VZ6Gab_UHSJj5qTyJCdc6TDHoYtWbhqOXDxOMrl1DW2VH7Y10xJ-wg2RoWZI9Xl";
}

if (roomName === "🔥 FMT 🔥| FABULOSOS | X3") {
  WebHookURL =
    "https://discord.com/api/webhooks/1083885278000852992/3m6R1c_3MdXCqzaLS_WOPQm6VLM-s4xvxFy_xyw4Sf4H08nL-8zV5fFMlg8I0LvWO_IA";
}

if (roomName === "🔥 FMT 🔥| FAMINTOS | X4") {
  WebHookURL =
    "https://discord.com/api/webhooks/1083885234308775986/yVMKGarZXaWQFFSusylSPXJk1TaOeHvIagBhauOYPP6OWYyMjaSeD_1crOrwICMqPo6V";
}

var allowAFK = true;
var AFKUsers = [];

room.onPlayerChat = function (player, message) {
  /* CHAT DA SALA */

  if (message !== adminPassword) {
    if (message.substr(0, 0) == "" && message.toLowerCase() !== adminPassword) {
      mensagemprodc = message.substr(0);
      var request = new XMLHttpRequest();
      request.open("POST", WebHookURL);
      request.setRequestHeader("Content-type", "application/json");
      var params = {
        username: "🔥", //nome do webhook
        content: ` ${roomName} - ${player.name} : ` + message,
      };
      request.send(JSON.stringify(params));
    }
  }

  /* Strong Filter */
  let mensagemfilter = message.split("");
  let bannedCha = "睍面鹎鎶龛胵笛懏北綃㋹鰔枡".split("");
  const found = bannedCha.some((r) => mensagemfilter.indexOf(r) >= 0);

  if (found) {
    room.kickPlayer(player.id, "SPAM.", true);
    return false;
  }

  if (
    message.length > 40 &&
    !nickAdmins.includes(player.name) &&
    !anonMods.includes(player.name)
  ) {
    return false;
  }

  /* LOGIN & REGISTER */

  if (message.toLowerCase().substr(0, 10) == "!register ") {
    setRegister(player, message.substr(10));
    return false;
  }

  // !login password
  if (
    message.toLowerCase().substr(0, 7) == "!login " &&
    nicksCadastrados.includes(player.name) == false
  ) {
    getLogin(player, message.substr(7));
    return false;
  }

  message = message.split(/ +/);

  player.team != Team.SPECTATORS ? setActivity(player, 0) : null;
  if (Object.keys(localStorage).includes("_grecaptcha")) {
    localStorage.removeItem("_grecaptcha");
  }

  /*SPAM FILTER*/

  messageHistory.push(player.id); //Add player's id to array when message is sent

  messageCounter++;

  //Warn player for spamming if 4 messages were typed in a row
  if (messageCounter === 4) {
    if (
      messageHistory[messageHistory.length - 1] === player.id &&
      messageHistory[messageHistory.length - 2] === player.id &&
      messageHistory[messageHistory.length - 3] === player.id &&
      messageHistory[messageHistory.length - 4] === player.id
    ) {
      room.sendChat(
        `**ALERTA! ${player.name} foi alertado por spam! Espere um pouco para digitar novamente.**`
      );
    }
  }
  //Ban player if 6 messages were typed in a row
  if (messageCounter === 8) {
    if (
      messageHistory[messageHistory.length - 1] === player.id &&
      messageHistory[messageHistory.length - 2] === player.id &&
      messageHistory[messageHistory.length - 3] === player.id &&
      messageHistory[messageHistory.length - 4] === player.id &&
      messageHistory[messageHistory.length - 5] === player.id &&
      messageHistory[messageHistory.length - 6] === player.id &&
      !player.admin
    ) {
      room.kickPlayer(
        player.id,
        "Por favor, não spamme. Você será desbanido automaticamente.",
        true
      );
      messageCounter = 1;
      return false;
    }
  }
  //Reset counter if condition is true
  if (
    messageHistory[messageHistory.length - 1] !==
    messageHistory[messageHistory.length - 2]
  ) {
    messageCounter = 1;
  }
  //Stop counter at 1 if player name is one of admins
  if (nickAdmins.includes(player.name) == true) {
    messageCounter = 1;
  }

  //Display data of a player which sent a message in the console
  console.log(
    `**MESSAGE COUNTER (  ${messageCounter} )**  Player ID: ${
      player.id
    }; Nickname: ${player.name}; Message: ${message.slice(0, 65)}`
  );

  /* CHAT */
  originalMessage = message;

  const linkRegex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (linkRegex.test(message)) return false;

  if (message[0] === teamMessageCommand) {
    teamMessage(player, message.join(" ").slice(teamMessageCommand.length));
    return false;
  }
  let pausetime = 1;

  if (
    ["!getplayer"].includes(message[0].toLowerCase()) &&
    nickAdmins.includes(player.name)
  ) {
    console.log(room.getPlayerDiscProperties(player.id));
  }

  if (message[0].toLowerCase() === "!pdsadasdix") {
    const qrcode =
      "https://api.qrserver.com/v1/create-qr-code/?size=3000x3000&data=";

    const pix = new Pix(
      "0bfb0d3f-9130-4661-914c-7d530eb13a18",
      "DELUXE",
      "FmtArena",
      "SaoPaulo",
      "6304FEC6",
      5.0
    );

    const payload = pix.getPayload();
    room.sendAnnouncement(
      "Aguarde alguns segundos para receber o código QR.",
      player.id,
      paletadecores.Azul,
      "bold",
      2
    );
    const data = {
      input: qrcode + payload,
    };

    console.log("LINK: " + qrcode + payload);

    fetch("https://gotiny.cc/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        room.sendAnnouncement(
          "Abra o link abaixo em outra aba para scanear o código.",
          player.id,
          paletadecores.Azul
        );
        room.sendAnnouncement(
          `https://gotiny.cc/${json[0].code}`,
          player.id,
          0xffffff
        );
      })
      .catch((err) => {
        room.sendAnnouncement(
          "Ocorreu um erro. Tente novamente mais tarde.",
          player.id,
          paletadecores.Vermelho,
          "bold"
        );
      });
  }

  function resetarStats() {
    const allKeys = Object.getOwnPropertyNames(localStorage)
      .sort()
      .map((key) => key);
    const authKeys = allKeys.filter((key) => key.length > 30);
    for (var i = 0; i < authKeys.length; i++) {
      delete localStorage.removeItem(authKeys[i]);
      console.log(`AUTH ${authKeys[i]} DELETADA.`);
    }
    room.sendAnnouncement("Stats resetados com sucesso.", player.id);
  }

  if (message[0].toLowerCase() === "!resetstats" && player.admin) {
    resetarStats();
  }

  var players = room.getPlayerList();

  var alvopv;
  var mensageminteira;
  if(["!pv"].includes(message[0]) && message[1]){
		alvopv = message[1];
		alvopvv = alvopv * 1
		alvopvnome = room.getPlayer(alvopvv)? room.getPlayer(alvopvv).name : null;
		mensageminteira = message[0] + message[1]
		
		room.sendAnnouncement("[PV] " + player.name + ": " + message.join(" ").slice(mensageminteira.length + 1), alvopvv, 0xe80909, 'bold', 2);
		room.sendAnnouncement("[PV][" + alvopvnome + "] " + player.name + ": " + message.join(" ").slice(mensageminteira.length + 1), player.id, 0xbd0b0b, 'small', 2);
		
		return false;
	}

  if (message[0].toLowerCase() === "!superban" && message[1] && player.admin) {
    const alvo = room.getPlayer(Number(message[1]));

    if (!alvo) {
      room.sendAnnouncement("O jogador não existe.", player.id);
      return false;
    }

    if (alvo.admin) {
      room.sendAnnouncement("Você não pode banir um admin.", player.id);
      return false;
    }

    banPlayer(alvo, player.name);
    room.kickPlayer(alvo.id, "Você foi banido.", true);
  }

  var alvoban;
  if (["!ban"].includes(message[0].toLowerCase())) {
    if (
      nickAdmins.includes(player.name) ||
      anonMods.includes(player.name) ||
      nickFriends.includes(player.name)
    ) {
      alvoban = room.getPlayer(message[1]);
      var authalvoban = listaDePlayers[alvoban.id];
      console.log(alvoban.name);
      console.log(authalvoban);
      nameblacklist.push(authalvoban);
      mensageminteira = message[0] + message[1];
      room.sendAnnouncement(
        `Você baniu ${alvoban.name}, e adicionou sua auth ${authalvoban} à blacklist.`,
        player.id
      );
      room.kickPlayer(
        alvoban.id,
        "Você foi banido! Consulte nosso Discord.",
        true
      );
      return false;
    }
  }

  if (["!desban"].includes(message[0].toLowerCase())) {
    if (nickAdmins.includes(player.name) || anonMods.includes(player.name)) {
      if (nameblacklist.includes(message[1])) {
        var authplayer = message[1];
        var indice = nameblacklist.indexOf(authplayer);
        nameblacklist.splice(indice, 1);
        room.sendAnnouncement(
          `Você tirou ${authplayer} da blacklist!`,
          player.id,
          0xffffff,
          "bold"
        );
      }
    }
  }

  if (["!banauth"].includes(message[0].toLowerCase())) {
    if (nickAdmins.includes(player.name) || anonMods.includes(player.name)) {
      var authalvo = message[1];
      nameblacklist.push(authalvo);
      room.sendAnnouncement(
        `Você adicionou ${authalvo} à blacklist!`,
        player.id,
        0xfc0349,
        "bold"
      );
    }
  }

  if (["!banip"].includes(message[0].toLowerCase())) {
    if (nickAdmins.includes(player.name) || anonMods.includes(player.name)) {
      var authip = message[1];
      ipmarcados.push(authip);
      room.sendAnnouncement(
        `Você adicionou ${authip} à lista de ip marcados!`,
        player.id,
        0xfc0349,
        "bold"
      );
    }
  }

  if (["!desbanip"].includes(message[0].toLowerCase())) {
    if (nickAdmins.includes(player.name) || anonMods.includes(player.name)) {
      if (ipmarcados.includes(message[1])) {
        var ipplayer = message[1];
        var indice = ipmarcados.indexOf(ipplayer);
        ipmarcados.splice(indice, 1);
        room.sendAnnouncement(
          `Você tirou ${ipplayer} da lista de ip marcados!`,
          player.id,
          0xffffff,
          "bold"
        );
      }
    }
  }

  if (["!ajuda"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement(
      "[📄] Comandos : !me, !t, !pv, !uni, !mostrarstats, !sequencia, !msgdodia, !games, !wins, !goals, !assists, !cs, !afks, !mutes, !bans.",
      player.id,
      0x34e5eb,
      "bold"
    );
    player.admin
      ? room.sendAnnouncement(
          "[📄] Admin : !mute <duration = 3> #<id>, !unmute all/#<id>, !clearbans <number = all>, !slow <duration>, !endslow, !ban <id>",
          player.id,
          0x34e5eb,
          "bold"
        )
      : null;
    if (helpers.includes(player.id) == true) {
      room.sendAnnouncement(
        "[PV] Comandos de helper: !mute5512 <minutos> #<id>, !unmute5512 all/#<id>"
      );
    }
    if (
      vipverify.includes(player.id) == true ||
      booster.includes(player.id) == true
    ) {
      room.sendAnnouncement(
        "[PV] Comandos exclusivos VIP: !p",
        player.id,
        0x5696fc,
        "bold"
      );
    }
  }

  //PROVOCAÇÕES CAMPEÕES//
  
  if (
    ["!ganso"].includes(message[0].toLowerCase()) &&
    campeoes.includes(player.name)
  ) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "sentindo faro de gol... ganso tá ná área!",
      null,
      0xf400a1,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }
  
  if (
    ["!maia"].includes(message[0].toLowerCase()) &&
    campeoes.includes(player.name)
  ) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "Se fossem dignos de provocação eu farpava",
      null,
      0x0bff5e,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }
  
   if (
    ["!lemos"].includes(message[0].toLowerCase()) &&
    campeoes.includes(player.name)
  ) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "ruf ruf, pitbull lemos chegou!",
      null,
      0x00bfff,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }
  
  if (
    ["!qdle"].includes(message[0].toLowerCase()) &&
    campeoes.includes(player.name)
  ) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "somel alorivel",
      null,
      0xffffff,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }

  //PROVOCAÇÕES//
  else if (["!provo1"].includes(message[0].toLowerCase()) && message[1]) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    var alvoflor = message[1] * 1;
    var alvonome = room.getPlayer(alvoflor)
      ? room.getPlayer(alvoflor).name
      : null;
    if (alvonome) {
      room.sendAnnouncement(
        `${player.name} provocou : PROCURA-SE ${alvonome} EM QUADRA !!`,
        null,
        0x008fff,
        "bold"
      );
      provoUsers.push(player.id);
      setTimeout(() => {
        provoUsers.splice(provoUsers.indexOf(player.id), 1);
      }, 30000);
      return false;
    }
  } else if (["!provo2"].includes(message[0].toLowerCase()) && message[1]) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    var alvoflor = message[1] * 1;
    var alvonome = room.getPlayer(alvoflor)
      ? room.getPlayer(alvoflor).name
      : null;
    if (alvonome) {
      room.sendAnnouncement(
        `${player.name} provocou ${alvonome} : Sai do meu bolso que tu tá pesado !!`,
        null,
        0xff0000,
        "bold"
      );
      provoUsers.push(player.id);
      setTimeout(() => {
        provoUsers.splice(provoUsers.indexOf(player.id), 1);
      }, 30000);
      return false;
    }
  }

  if (
    "!bomdia" === message[0].toLowerCase() &&
    nickAdmins.includes(player.name)
  ) {
    const listPlayers = room.getPlayerList().map((p, i) => {
      i !== 0 ? p.name : null;
    });

    listPlayers.forEach((p) => {
      if (p.length > 1 && p !== player.name) {
        room.sendAnnouncement(`${p}: Bom dia, senhor ${player.name}!`);
      }
    });
  }

  // COPA

  if (["!oe1"].includes(message[0].toLowerCase())) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name +
        " provocou! " +
        "Que isso, amigão. Perdeu até o rumo de casa!",
      null,
      0xc500ff,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }

  if (["!oe2"].includes(message[0].toLowerCase())) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "NÃO vem de garfo que hoje é dia de sopa",
      null,
      0xf0ff00,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }

  if (["!lç1"].includes(message[0].toLowerCase())) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "RECEBA! Pega essa, goleirão!",
      null,
      0xc500ff,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }

  if (["!lç2"].includes(message[0].toLowerCase())) {
    if (provoUsers.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 30 segundos para provocar novamente",
        player.id
      );
      return false;
    }
    room.sendAnnouncement(
      player.name + " provocou! " + "Esse vai pro PUSKAS!",
      null,
      0xf0ff00,
      "bold"
    );
    provoUsers.push(player.id);
    setTimeout(() => {
      provoUsers.splice(provoUsers.indexOf(player.id), 1);
    }, 30000);
  }

  if (["!novidades"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement(
      "UNIFORMES DA LIGA DOS CAMPEÕES ADICIONADOS",
      player.id,
      0x50d050,
      "bold"
    );
    room.sendAnnouncement(
      "digite !uni e confira!",
      player.id,
      0x50d050,
      "bold"
    );
  }
  
  if (["!mvphelp"].includes(message[0].toLowerCase())) {
        room.sendAnnouncement("Uniforme exclusivo: !mvp", player.id, 0x50D050, 'bold')
		room.sendAnnouncement("Provocações exclusivas: !mvpgk; !mvpass; !mvpgoals", player.id, 0x50D050, 'bold')
		room.sendAnnouncement("Qualquer sugestão ou problema nos chame no !discord", player.id, 0x50D050, 'bold')
		
	}
	
	if (["!thu"].includes(message[0].toLowerCase())) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "Vc parece um golfinho, sobe faz uma graça e afunda!!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}
	
	if (["!wky"].includes(message[0].toLowerCase())) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "TA BEBADO? TOMOU MUITO O WHISKY??!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}
	
	if (["!lcky"].includes(message[0].toLowerCase())) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "Você é o menino talento!, ta lento no meio, na defesa e no ataque!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}
	
	
  
  if (["!luffy"].includes(message[0].toLowerCase())) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "Faz o L! dluffy tá na área!!!!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}

  
  if (["!provocacoes"].includes(message[0].toLowerCase())) {
        room.sendAnnouncement("Provocações adicionadas:  !provo1 id;   !provo2 id;   !oe1;   !oe2;   !lç1;   !lç2", player.id, 0xe6e824, 'bold')
		room.sendAnnouncement("Provo dos players:  !thu (thuga); !wky (whysky); !lcky (Luck.exe); !luffy", player.id, 0xe6e824, 'bold')
		room.sendAnnouncement("Provocações MVP (exclusivas):  !mvpgk;   !mvpass;   !mvpgoals; ", player.id, 0xe6e824, 'bold')
		
	}
	
	if (["!vempracall"].includes(message[0].toLowerCase())) {
        room.sendAnnouncement("A call TÁ ON! Lá pode tudo, só não xingar a mãe do admin", player.id, 0xe6e824, 'bold')
		room.sendAnnouncement(" https://discord.com/channels/930576745105612850/930576745894146157 ", player.id, 0xe6e824, 'bold')
		
	}
	
	//provo mvp///
	
	if (["!mvpgk"].includes(message[0].toLowerCase()) && nicktopgk.includes(player.name)) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "Respeita que aqui é a muralha da sala!!!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}
	
	if (["!mvpass"].includes(message[0].toLowerCase()) && nicktoppass.includes(player.name)) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "Calma que o maestro da sala tá on!!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}
	
	if (["!mvpgoals"].includes(message[0].toLowerCase()) && nicktopgoals.includes(player.name)) {
		if(provoUsers.includes(player.id)){
room.sendChat("Você deve esperar 30 segundos para provocar novamente", player.id)
return false
}	
        room.sendAnnouncement(player.name + " provocou! " + "Relaxa, o artilheiro da sala tá aqui!", null, 0xF0FF00, 'bold')
		provoUsers.push(player.id);
		setTimeout(() => {
			provoUsers.splice(provoUsers.indexOf(player.id), 1)
		}, 30000)
	}
	
	

  if (calladmin.includes(message[0].toLowerCase())) {
    if (calladminTime.includes(player.id)) {
      room.sendChat(
        "Você deve esperar 60 segundos para usar esse comando novamente",
        player.id
      );
      return false;
    }
    sendAnnouncementToTheDiscord(
      `O player ${
        player.name
      }  usou o comando !calladmin na sala ${roomName}  | Mensagem: ${message.join(
        " "
      )} `
    );
    room.sendAnnouncement(
      "[PV] Você usou calladmin !",
      player.id,
      0xffffff,
      "bold",
      2
    );
    calladminTime.push(player.id);
    setTimeout(() => {
      calladminTime.splice(calladminTime.indexOf(player.id), 1);
    }, 60000);
  }

  if (["!lista"].includes(message[0].toLowerCase())) {
    console.log(room.getPlayerList());
  }
  var ultimovencedor;
  if (lastWinner === 1) {
    ultimovencedor = "vermelho";
  } else {
    ultimovencedor = "azul";
  }

  if (
    message[0].toLowerCase() === "!count" &&
    message[1] &&
    supremoLoja.includes(player.id)
  ) {
    const listaVipObj = JSON.parse(localStorage.getItem("listavip"));
    let newCount = "GL";
    let emojiCount = "⚽";
    switch (message[1].toUpperCase()) {
      case "GL":
        newCount = "GL";
        emojiCount = "⚽";
        break;
      case "AS":
        newCount = "AS";
        emojiCount = "👟";
        break;
      case "CS":
        newCount = "CS";
        emojiCount = "🧤";
        break;

      default:
        break;
    }
    listaVipObj.umMes.find((p) => p.auth === getAuth(player)).count = newCount;
    localStorage.setItem("listavip", JSON.stringify(listaVipObj));

    room.sendAnnouncement(
      "Você trocou o contador do seu DELUXE",
      player.id,
      paletadecores.Azul,
      "bold"
    );
  }

  if (["!c"].includes(message[0].toLowerCase())) {
    if (supremoLoja.includes(player.id)) {
      const listaVip = JSON.parse(localStorage.getItem("listavip"));
      const playerObj = listaVip.umMes.find((p) => p.auth === getAuth(player));
      let corzinha = "0xFFF";
      if (message[1].toString()[0] === "#") {
        corzinha = "0x" + message[1].toString().substring(1);
      } else corzinha = "0x" + message[1];
      playerObj.colorChat = corzinha;
      listaVip.umMes[
        listaVip.umMes.findIndex((p) => p.auth === getAuth(player))
      ] = playerObj;
      localStorage.setItem("listavip", JSON.stringify(listaVip));
      room.sendAnnouncement("VOCÊ TROCOU A COR DE CHAT.", player.id);
    } else {
      return false;
    }
  }

  if (message[0].toLowerCase() === "!discord") {
    room.sendAnnouncement(
      "Entre já no nosso discord 👉 https://discord.gg/AYB39pWa2V",
      player.id,
      paletadecores.Azul,
      "bold",
      2
    );
  }

  if (["!inforank"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement(
      "O critério para avançar de rank é baseado na porcentagem do seu winrate! confira:",
      player.id,
      0x174dff,
      "bold"
    );
    room.sendAnnouncement(
      "MINÍMO 50 PARTIDAS PARA TER UM RANK.",
      player.id,
      0x174dff,
      "bold"
    );
    room.sendAnnouncement("Pereba - rank inicial", player.id, 0x174dff, "bold");
    room.sendAnnouncement(
      "🥉Ferro(10%, II-20%; III-30%)",
      player.id,
      0x174dff,
      "bold"
    );
    room.sendAnnouncement(
      "🥈Prata(40%; II- 44%; III-50%)",
      player.id,
      0x174dff,
      "bold"
    );
    room.sendAnnouncement(
      "🥇Ouro(55%; II-60%; III-65%)",
      player.id,
      0x174dff,
      "bold"
    );
    room.sendAnnouncement("🗿Chad(70%)", player.id, 0x174dff, "bold");
    room.sendAnnouncement("🏆Campeão(75%)", player.id, 0x174dff, "bold");
    room.sendAnnouncement("💎Diamante(80%)", player.id, 0x174dff, "bold");
    room.sendAnnouncement("🔆Épico(83%)", player.id, 0x174dff, "bold");
    room.sendAnnouncement("👑Rei (86%)", player.id, 0x174dff, "bold");
    room.sendAnnouncement("🔥 FAMINTO", player.id, 0x174dff, "bold");
  }
  //comando uniformes

  if (["!uni"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement(
      "UNIFORMES CHAMPIONS LEAGUE: !nap, !liv, !aja, !ran, !atlm, !lev, !bru, !porto, !intm, !piz, !bar, !tot, !ein, !spt, !oly, !che, !mil, !rbs, !dnz, !rmd, !rbl, !sha, !cel, !cty, !bor, !sev, !cop, !ben, !psg, !mch ",
      player.id,
      0x07b58f,
      "bold",
      1
    );
    room.sendAnnouncement("UNIFORMES NBA/NFL: !ari, !bal, !buf, !chi, !pat, !lak, !bos, !bull, !cav, !gol", player.id, 0x0772b5, "bold", 2);
    room.sendAnnouncement("UNIFORMES BR: !fla, !bot, !pal, !flu, !apr, !cru, !for, !sao, !amg, !san, !gre, !int, !bah, !vas, !rbb, !cor, !cui, !goi, !crtb, !ame", player.id, 0xFFFFFF, "bold", 2);
  }


  if (["!afk"].includes(message[0].toLowerCase()) && allowAFK) {
    if(AFKUsers.includes(player.id) && !getAFK(player)) {
      room.sendAnnouncement("Aguarde um pouco antes de usar AFK novamente.", player.id, paletadecores.Vermelho, 'bold')
      return false
    } 
    if (players.length != 1 && player.team != Team.SPECTATORS) {
      if (player.team == Team.RED && streak > 0 && room.getScores() == null) {
        room.setPlayerTeam(player.id, Team.SPECTATORS);
      } else {
        room.sendChat(
          "Não se pode ficar AFK quando está em uma equipe!",
          player.id
        );
        return false;
      }
    } else if (players.length == 1 && !getAFK(player)) {
      room.setPlayerTeam(player.id, Team.SPECTATORS);
    }
    var idAfk = player.id
    var tempoAfk = 10000
    AFKUsers.push(idAfk)
    setTimeout(() => {
      AFKUsers.splice(AFKUsers.findIndex(a => a === idAfk), 1)
    }, tempoAfk)
    setAFK(player, !getAFK(player));
    room.sendAnnouncement(
      player.name + (getAFK(player) ? " está AFK !" : " não está mais AFK !"),
      null,
      getAFK(player) ? 0xff7b08 : 0x8fff8f
    );
    getAFK(player) ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
    localStorage.getItem(getAuth(player))
      ? (stats = JSON.parse(localStorage.getItem(getAuth(player))))
      : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player"]);
    if (
      staff.includes(player.id) == false &&
      vipverify.includes(player.id) == false &&
      authAdmins.includes(player.auth) == false
    ) {
      setTimeout(() => {
        if (
          getAFK(player) &&
          stats[Ss.RL] != "vip" &&
          vipsupremao.includes(player.id) == false &&
          nickAdmins.includes(player.name) == false &&
          anonMods.includes(player.name) == false
        ) {
          room.kickPlayer(player.id, "Tempo de AFK excedido", false);
        }
      }, 10 * 60 * 1000);
    }
    return false;
  } else if (["!afks", "!afklist"].includes(message[0].toLowerCase())) {
    var cstm = "[PV] Lista de AFK : ";
    for (var i = 0; i < extendedP.length; i++) {
      if (
        room.getPlayer(extendedP[i][eP.ID]) != null &&
        getAFK(room.getPlayer(extendedP[i][eP.ID]))
      ) {
        if (
          140 - cstm.length <
          (room.getPlayer(extendedP[i][eP.ID]).name + ", ").length
        ) {
          room.sendChat(cstm, player.id);
          cstm = "... ";
        }
        cstm += room.getPlayer(extendedP[i][eP.ID]).name + ", ";
      }
    }
    if (cstm == "[PV] Lista de AFK : ") {
      room.sendChat("[PV] Não há ninguém na lista de AFK !", player.id);
      return false;
    }
    cstm = cstm.substring(0, cstm.length - 2);
    cstm += ".";
    room.sendChat(cstm, player.id);
  } else if ([adminPassword].includes(message[0].toLowerCase())) {
    adms.push(player.id);
    staff.push(player.id);
    room.setPlayerAdmin(player.id, true);
    room.sendAnnouncement(
      "O player " + player.name + " logou como ADMIN!",
      null,
      0xff1f22,
      "bold",
      2
    );
    return false;
  }

  if (["!svip841"].includes(message[0].toLowerCase())) {
    vipzinho.push(player.id);
    vipverify.push(player.id);
    room.sendAnnouncement(
      "O player " + player.name + " logou como VIP!",
      null,
      0x0f9154,
      "bold",
      2
    );
    return false;
  }

  if (["!psk2094"].includes(message[0].toLowerCase())) {
    premiadoverify.push(player.id);
    room.sendAnnouncement(
      "O player " + player.name + " logou como VENCEDOR DO PUSKAS !",
      null,
      0xe03fd8,
      "bold",
      2
    );
    return false;
  }

  //SENHAS ADICIONAIS

  if (message[0].toLowerCase() === "!ovall") {
    ovALL.push(player.id);
  }

  if (["!mod"].includes(message[0].toLowerCase())) {
    const moderadores = JSON.parse(localStorage.getItem("moderadores"));
    if (moderadores.find((m) => m.auth === getAuth(player))) {
      mods.push(player.id);
      staff.push(player.id);
      room.setPlayerAdmin(player.id, true);
      room.sendAnnouncement(
        "O player " + player.name + " logou como MODERADOR!",
        null,
        0x005ca3,
        "bold",
        2
      );
      return false;
    } else
      room.sendAnnouncement(
        "Você não tem permissão para usar esse comando",
        player.id,
        paletadecores.Vermelho
      );
  }

  //senha mod//

  if (
    ["!moderador"].includes(message[0].toLowerCase()) &&
    nickMods.includes(player.name)
  ) {
    mods.push(player.id);
    staff.push(player.id);
    nickMods.push(player.name);
    anonMods.push(player.name);
    room.setPlayerAdmin(player.id, true);
    room.sendAnnouncement(
      "O player " + player.name + " logou como MODERADOR!",
      null,
      0x005ca3,
      "bold",
      2
    );
    return false;
  }

  if (
    ["!mod24"].includes(message[0].toLowerCase()) &&
    nickFriends.includes(player.name)
  ) {
    mods.push(player.id);
    staff.push(player.id);
    nickMods.push(player.name);
    anonMods.push(player.name);
    room.setPlayerAdmin(player.id, true);
    room.sendAnnouncement(
      "O player " + player.name + " logou como MODERADOR!",
      player.id,
      0x005ca3,
      "bold",
      2
    );
    return false;
  }

  if (["!h4981"].includes(message[0].toLowerCase())) {
    helpers.push(player.id);
    staff.push(player.id);
    room.sendAnnouncement(
      "O player " + player.name + " logou como HELPER!",
      null,
      0x44db09,
      "bold",
      2
    );
    return false;
  }

  if (["!slcampeao"].includes(message[0].toLowerCase())) {
    campeoes1.push(player.id);
    campeoes1.push(player.id);
    room.sendAnnouncement(
      "O CAMPEÃO DA 1ª FMT CUP, " + player.name + " ,logou!",
      null,
      0xae841a,
      "bold",
      2
    );
    return false;
  }

  if (["!msgdodia"].includes(message[0].toLowerCase())) {
    if (usomensagem.includes(player.name) == false) {
      usomensagem.push(player.name);
      var mensagemselecionada =
        mensagensdodia[Math.floor(Math.random() * mensagensdodia.length)];
      room.sendAnnouncement(
        `"${mensagemselecionada}"`,
        player.id,
        0x96d9be,
        "normal",
        2
      );

      console.log(vipverify);
      console.log(usomensagem);
    } else if (usomensagem.includes(player.name) == true) {
      room.sendAnnouncement(
        "Você já leu a mensagem do dia hoje! Tente novamente amanhã. ",
        player.id,
        0x44db09,
        "bold",
        2
      );
    }
  }

  if (
    ["!clearmsgdodia"].includes(message[0].toLowerCase()) &&
    staff.includes(player.id) == true
  ) {
    usomensagem.length = 0;
    room.sendAnnouncement(
      "Você resetou a mensagem do dia! ",
      player.id,
      0x44db09,
      "bold",
      2
    );
    return false;
  }

  if (
    ["!addstreak"].includes(message[0].toLowerCase()) &&
    staff.includes(player.id) == true
  ) {
    streakrecord = message[1];
    teamstreak = [];
    var seq;
    localStorage.getItem("streak")
      ? (seq = JSON.parse(localStorage.getItem("streak")))
      : (seq = { roomName: roomName, teamstreak: [], record: 0 });

    seq = { roomName: roomName, streakteam: [], record: 0 };

    seq.record = streakrecord;

    localStorage.setItem("streak", JSON.stringify(seq));

    room.sendAnnouncement(
      `Você adicionou um novo recorde: ${message[1]}`,
      player.id
    );
  }

  if (
    ["!addstreakteam"].includes(message[0].toLowerCase()) &&
    staff.includes(player.id) == true
  ) {
    console.log(message);
    message = message.join(" ");
    let streakplayer = message.slice(15, message.length);

    var seq;
    localStorage.getItem("streak")
      ? (seq = JSON.parse(localStorage.getItem("streak")))
      : (seq = { roomName: roomName, streakteam: [], record: 0 });
    console.log(seq);

    seq["streakteam"].push(streakplayer);

    localStorage.setItem("streak", JSON.stringify(seq));

    room.sendAnnouncement(
      `Você adicionou um novo jogador ao time do recorde: ${streakplayer}`,
      player.id
    );
  }

  if (
    ["!clearstreak"].includes(message[0].toLowerCase()) &&
    staff.includes(player.id) == true
  ) {
    streakrecord = 10;
    teamstreak = [];
    room.sendAnnouncement(
      `Você limpou as configurações de recorde.`,
      player.id
    );
  }
  let tmstrrk = teamstreak.join(", ");
  if (["!sequencia"].includes(message[0].toLowerCase())) {
    var seq;
    localStorage.getItem("streak")
      ? (seq = JSON.parse(localStorage.getItem("streak")))
      : (seq = 0);
    var timesequencia = seq.streakteam;
    var strRecord = seq.record;

    if (seq) {
      room.sendAnnouncement(
        `O atual recorde de vitórias seguidas é de ${strRecord} vitórias, pelo time: ${timesequencia}`,
        null,
        0x34eb49,
        "bold",
        2
      );
    } else {
      room.sendAnnouncement(
        "Ainda não há uma sequência.",
        player.id,
        0x34eb49,
        "bold",
        2
      );
    }
  } else if (
    message.some((r) =>
      /(macaco[s]?|mamaco|monkey|seu\s+preto|mono|negro|seu\s+negro|macac[oa]|gorila|chimpanze|ximpa|negroide)/i.test(r)
    ) ||
    /(se\s+mata|seu\s+preto[s]?|seu\s+negro[s]?)/i.test(message.join(" "))
  ) {
    room.kickPlayer(player.id, "Você foi banido. (2h)", true);
    nameblacklist.push(player.auth);
    room.sendChat(
      player.name + " FOI BANIDO!",
      null,
      0xde0000,
      "normal",
      2
    );
  

    sendBanToDiscord(
      `${player.name} foi banido! MSG:  ${message} `
    );
    return false;
  } else if (message.some((r) => ["@everyone", "@here"].indexOf(r) >= 0)) {
    room.kickPlayer(player.id, "FILHO DE UMA PUTA", true);
    nameblacklist.push(player.auth);
    room.sendChat(
      player.name + " FOI BANIDO POR SER FDP ! ",
      null,
      0xde0000,
      "normal",
      2
    );
    sendBanToDiscord(
      `${player.name} foi banido por SER FDP! MSG:  ${message} `
    );
    return false;
  } else if (message.some((r) => ["palavraproibida"].includes(r.toLowerCase()))) {
    room.kickPlayer(player.id, "Palavra proibida!", false);
    room.sendChat(
      player.name + " foi removido. (Palavra proibida)",
      null,
      0xde0000,
      "normal",
      2
    );
    return false;
  } else if (senhaCadastrados.includes(message[0]) == true) {
    if (permitidol.includes(player.id) == true) {
      room.sendAnnouncement(
        "O player " + player.name + " logou !",
        null,
        0x33f24c,
        "normal",
        1
      );
      logados.push(player.id);
      return false;
    } else {
      room.sendAnnouncement("⚠️ ERRO ⚠️", player.id, 0xa3071b, "bold", 2);
    }
  }
  
  //Uniformes MVP//
  
   else if (["!mvp"].includes(message[0].toLowerCase()) && nicktopgk.includes(player.name)){
		if (player.team == 1 && player.id == teamR[0].id) {
			room.setTeamColors(1, 55, 0x000000, [0xFEEA7A, 0xF3DB77, 0xFEEA7A]);
				room.sendAnnouncement(player.name + " ESCOLHEU O UNIFORME DE MVP DA TEMPORADA !", null, 0x31f55f, 'bold',);
		}
		else if (player.team == 2 && player.id == teamB[0].id){
			room.setTeamColors(2, 55, 0x000000, [0xFEEA7A, 0xF3DB77, 0xFEEA7A]);
				room.sendAnnouncement(player.name + " ESCOLHEU O UNIFORME DE MVP DA TEMPORADA !", null, 0x31f55f, 'bold');
		}
		return false;
	}
	
	else if (["!mvp"].includes(message[0].toLowerCase()) && nicktopgoals.includes(player.name)){
		if (player.team == 1 && player.id == teamR[0].id) {
			room.setTeamColors(1, 55, 0x000000, [0xFEEA7A, 0xF3DB77, 0xFEEA7A]);
				room.sendAnnouncement(player.name + " ESCOLHEU O UNIFORME DE MVP DA TEMPORADA !", null, 0x31f55f, 'bold',);
		}
		else if (player.team == 2 && player.id == teamB[0].id){
			room.setTeamColors(2, 55, 0x000000, [0xFEEA7A, 0xF3DB77, 0xFEEA7A]);
				room.sendAnnouncement(player.name + " ESCOLHEU O UNIFORME DE MVP DA TEMPORADA !", null, 0x31f55f, 'bold');
		}
		return false;
	}
	
	  else if (["!mvp"].includes(message[0].toLowerCase()) && nicktoppass.includes(player.name)){
		if (player.team == 1 && player.id == teamR[0].id) {
			room.setTeamColors(1, 55, 0x000000, [0xFEEA7A, 0xF3DB77, 0xFEEA7A]);
				room.sendAnnouncement(player.name + " ESCOLHEU O UNIFORME DE MVP DA TEMPORADA !", null, 0x31f55f, 'bold',);
		}
		else if (player.team == 2 && player.id == teamB[0].id){
			room.setTeamColors(2, 55, 0x000000, [0xFEEA7A, 0xF3DB77, 0xFEEA7A]);
				room.sendAnnouncement(player.name + " ESCOLHEU O UNIFORME DE MVP DA TEMPORADA !", null, 0x31f55f, 'bold');
		}
		return false;
	}

  // COMANDOS DE UNIFORMES //

  // check if the player has typed a command that is in uniformes object
  if (uniformes[message[0].toLowerCase()]) {
    // check if the player is in a team
    if (player.team !== 3) {
      // check if the player is the team captain
      if (player.id === teamR[0]?.id || player.id === teamB[0]?.id) {
        // check if the uniform isn't already set in the other team
        if (uniUsing[player.team === 1 ? 2 : 1] !== message[0].toLowerCase()) {
          // set the team colors
          room.setTeamColors(
            player.team,
            uniformes[message[0]].angle,
            uniformes[message[0]].fontColor,
            uniformes[message[0]].backgroundColor
          );
          // send an announcement to the room
          room.sendAnnouncement(
            player.name + " ESCOLHEU O UNIFORME " + uniformes[message[0]].name,
            null,
            0x82ff97,
            "bold"
          );

          uniUsing[player.team] = message[0].toLowerCase();
        } else
          room.sendAnnouncement(
            "Esse uniforme já está sendo usado",
            player.id,
            paletadecores.Vermelho,
            "bold",
            2
          );
      } else {
        room.sendAnnouncement(
          "Você não é o capitão do seu time",
          player.id,
          0xa3071b,
          "bold",
          2
        );
      }
    }
  }

  

  //*COMANDOS EXCLUSIVOS*//
  else if (["!p"].includes(message[0].toLowerCase())) {
    if (vipsupremao.includes(player.id) == true) {
      if (player.team == 1 || player.team == 2) {
        if (!pausePlayers.includes(player.id)) {
          pausePlayers.push(player.id);
          room.pauseGame(true);
          room.sendAnnouncement(
            `O jogador ${player.name} pediu pause por 15 segundos`,
            null,
            0xdb1212,
            "bold",
            2
          );
          setTimeout(() => {
            room.pauseGame(false);
          }, 15000);
        } else {
          room.sendAnnouncement(
            "Você já usou pause nesta partida.",
            player.id,
            0xdb1212,
            "bold",
            2
          );
        }
      } else {
        room.sendAnnouncement(
          "Você não pode pausar o jogo sem estar em uma das equipes",
          player.id,
          0xdb1212,
          "bold",
          2
        );
      }
    } else {
      room.sendAnnouncement(
        "Este comando é exclusivo de DELUXE.",
        player.id,
        0xdb1212,
        "bold",
        2
      );
    }
  } else if (["!rr5512"].includes(message[0].toLowerCase()) && player.admin) {
    if (authAdmins.includes(player.auth) || staff.includes(player.id)) {
      room.stopGame();
      room.startGame();
      room.sendAnnouncement(
        "PARTIDA RESETADA PELO ADMIN",
        null,
        0xe7ff0f,
        "bold",
        2
      );
      return false;
    }
  } else if (
    ["!fechar5512"].includes(message[0].toLowerCase()) &&
    player.admin
  ) {
    if (authAdmins.includes(player.auth) || staff.includes(player.id)) {
      room.setPassword("4932");
      room.sendAnnouncement("A sala foi trancada !", null, 0xe7ff0f, "bold", 2);
      return false;
    }
  } else if (
    message[0].toLowerCase() === "!setmod" &&
    message[1] &&
    message[2] &&
    nickAdmins.includes(player.name)
  ) {
    const modObj = { auth: message[1], nick: message[2] };
    if (localStorage.getItem("moderadores")) {
      const moderadores = JSON.parse(localStorage.getItem("moderadores"));
      moderadores.push(modObj);
      localStorage.setItem("moderadores", JSON.stringify(moderadores));
    } else {
      const moderadores = [];
      moderadores.push(modObj);
      localStorage.setItem("moderadores", JSON.stringify(moderadores));
    }
    room.sendAnnouncement(
      `Você setou ${message[1]} como moderador`,
      player.id,
      paletadecores.Azul,
      "bold",
      2
    );
  } else if (
    message[0].toLowerCase() === "!removemod" &&
    message[1] &&
    nickAdmins.includes(player.name)
  ) {
    const moderadores = JSON.parse(localStorage.getItem("moderadores"));
    if (moderadores.find((m) => m.auth === message[1])) {
      room.sendAnnouncement(
        `Você removeu ${
          moderadores.find((m) => m.auth === message[1]).nick
        } da moderação`,
        player.id,
        paletadecores.Laranja,
        "bold",
        2
      );
      moderadores.splice(moderadores.findIndex((m) => m.auth === message[1]));
      localStorage.setItem("moderadores", JSON.stringify(moderadores));
    } else
      room.sendAnnouncement(
        "Moderador não encontrado",
        player.id,
        paletadecores.Vermelho,
        "bold"
      );
  } 
  
  else if(message[0].toLowerCase() === '!setvip' && message[1] && (nickAdmins.includes(player.name))) {
		const idTarget = Number(message[1])
		if(idTarget) {
			if(room.getPlayer(idTarget)) {
				if(vipUmMes(getAuth(room.getPlayer(idTarget)))) {
					room.sendAnnouncement(`[🗳] Você definiu ${room.getPlayer(idTarget).name} como DELUXE.`, player.id, 0x42bff5)
					room.sendAnnouncement(`O player ${room.getPlayer(idTarget).name} se tornou DELUXE`, null, paletadecores.Verde, 'bold')
					room.sendAnnouncement('[PV] Parabéns, você se tornou DELUXE por 30 dias. Relogue para ativar.', idTarget, paletadecores.Laranja, 'bold')
					return false
				}else room.sendAnnouncement('Este player já é um DELUXE', player.id, paletadecores.Vermelho, 'bold')
			}
		} else {
			if(vipUmMes(message[1])) {
				room.sendAnnouncement('Você definiu a auth ${message[1]} como DELUXE', player.id, paletadecores.Laranja, 'bold')
				return false
			}else room.sendAnnouncement('Este player já é um DELUXE', player.id, paletadecores.Vermelho, 'bold')
		}
		
	}

  else if (
  message[0].toLowerCase() === "!clearvip" && message[1] && (nickAdmins.includes(player.name) || anonMods.includes(player.name))) {
    var listaVipObj = JSON.parse(localStorage.getItem('listavip'));
    var umMesVip = listaVipObj.umMes;
    var authAlvo = message[1]
    var vipIndex = umMesVip.findIndex((p) => p.auth === authAlvo)
    if(vipIndex >= 0) {
      listaVipObj.umMes.splice(vipIndex, 1)
    } else
    {room.sendAnnouncement(
      "Player não encontrado.",
      player.id,
      paletadecores.Vermelho,
      "bold"
    );}
    localStorage.setItem('listavip', JSON.stringify(listaVipObj))
    for(var i in listaDePlayers) {
      if(listaDePlayers[i] === authAlvo) {
        delete listaDePlayers[i]
      }
    }
        room.sendAnnouncement(
          `Você retirou o DELUXE de ${message[1]}`,
          player.id,
          paletadecores.Laranja,
          "bold"
        );
      }  
  
  
  else if (["!getST"].includes(message[0].toLowerCase())) {
    var stats;
    localStorage.getItem(nameToAuth[thebest.nome])
      ? (stats = JSON.parse(localStorage.getItem(nameToAuth[thebest.nome])))
      : (stats = [
          0,
          0,
          0,
          0,
          "0.00",
          0,
          0,
          0,
          0,
          "0.00",
          "player",
          player.name,
          0,
        ]);

    var statsTeste = localStorage.getItem(nameToAuth[player.name]);

    console.log(statsTeste);
  } else if (
    ["!abrir5512"].includes(message[0].toLowerCase()) &&
    player.admin
  ) {
    if (authAdmins.includes(player.auth) || staff.includes(player.id)) {
      room.setPassword();
      room.sendAnnouncement(
        "A sala foi aberta novamente !",
        null,
        0xe7ff0f,
        "bold",
        2
      );
      return false;
    }
  } else if (["!me"].includes(message[0].toLowerCase())) {
    var stats;
    localStorage.getItem(getAuth(player))
      ? (stats = JSON.parse(localStorage.getItem(getAuth(player))))
      : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", 0]);
    var mvpNum = stats[Ss.MP];
    if (stats.length === 12) {
      var objStats = stats;
      stats = [
        objStats[Ss.GA],
        objStats[Ss.WI],
        objStats[Ss.DR],
        objStats[Ss.LS],
        objStats[Ss.WR],
        objStats[Ss.GL],
        objStats[Ss.AS],
        objStats[Ss.GK],
        objStats[Ss.CS],
        objStats[Ss.CP],
        0,
      ];
    }

    room.sendAnnouncement(
      "[📄] Stats de " +
        player.name +
        ": 🎮 Partidas Jogadas: " +
        stats[Ss.GA] +
        ", ✅ Vitórias: " +
        stats[Ss.WI] +
        ", ❌ Derrotas: " +
        stats[Ss.LS] +
        ", ⚖️ Empates: " +
        stats[Ss.DR] +
        ", WR: " +
        stats[Ss.WR] +
        "%, ⚽️ Gols: " +
        stats[Ss.GL] +
        ", 👟 Assistências: " +
        stats[Ss.AS] +
        ", 🤚 GK: " +
        stats[Ss.GK] +
        ", 🤚 CS: " +
        stats[Ss.CS] +
        ", 🤚 CS%: " +
        stats[Ss.CP] +
        "%",
      player.id,
      0x73ec59,
      "bold"
    );
    room.sendAnnouncement(
      "「👓」 Esta mensagem apenas você pode ver, se queres mostrar seus stats use o comando '!mostrarstats'!",
      player.id,
      0xff7900,
      "bold"
    );
  } else if (["!mostrarstats"].includes(message[0].toLowerCase())) {
    var stats;
    localStorage.getItem(getAuth(player))
      ? (stats = JSON.parse(localStorage.getItem(getAuth(player))))
      : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", 0]);
    var mvpNum = stats[Ss.MP];
    if (stats.length === 12) {
      var objStats = stats;
      stats = [
        objStats[Ss.GA],
        objStats[Ss.WI],
        objStats[Ss.DR],
        objStats[Ss.LS],
        objStats[Ss.WR],
        objStats[Ss.GL],
        objStats[Ss.AS],
        objStats[Ss.GK],
        objStats[Ss.CS],
        objStats[Ss.CP],
        0,
      ];
      mvpNum = stats[10];
    }
    room.sendAnnouncement(
      "[📄] O jogador " + player.name + " mostrou seus stats! [!mostrarstats]",
      null,
      0xff7900,
      "bold"
    );
    room.sendAnnouncement(
      "[📄] Stats de " +
        player.name +
        ": 🎮 Partidas Jogadas: " +
        stats[Ss.GA] +
        ", ✅ Vitórias: " +
        stats[Ss.WI] +
        ", ❌ Derrotas: " +
        stats[Ss.LS] +
        ", ⚖️ Empates: " +
        stats[Ss.DR] +
        ", WR: " +
        stats[Ss.WR] +
        "%, ⚽️ Gols: " +
        stats[Ss.GL] +
        ", 👟 Assistências: " +
        stats[Ss.AS] +
        ", 🤚 GK: " +
        stats[Ss.GK] +
        ", 🤚 CS: " +
        stats[Ss.CS] +
        ", 🤚 CS%: " +
        stats[Ss.CP] +
        "%",
      null,
      0x73ec59,
      "bold"
    );
  } else if (["!games"].includes(message[0].toLowerCase())) {
    var tableau = [];
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (
          ![
            "player_name",
            "view_mode",
            "geo",
            "avatar",
            "player_auth_key",
          ].includes(key) &&
          key.length == 43
        ) {
          tableau.push([
            JSON.parse(localStorage.getItem(key))[Ss.NK],
            JSON.parse(localStorage.getItem(key))[Ss.GA],
          ]);
        }
      });
    } catch {}
    if (tableau.length < 5) {
      room.sendAnnouncement(
        "[PV] Ainda não jogou partidas suficientes.",
        player.id,
        0xff0000
      );
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendAnnouncement(
      "[📄] 🎮 Partidas Jogadas> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1],
      player.id,
      0x73ec59
    );

    return false;
  } else if (["!wins"].includes(message[0].toLowerCase())) {
    var tableau = [];
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (
          ![
            "player_name",
            "view_mode",
            "geo",
            "avatar",
            "player_auth_key",
          ].includes(key) &&
          key.length == 43
        ) {
          tableau.push([
            JSON.parse(localStorage.getItem(key))[Ss.NK],
            JSON.parse(localStorage.getItem(key))[Ss.WI],
          ]);
        }
      });
    } catch {}
    if (tableau.length < 5) {
      room.sendAnnouncement(
        "[PV] Ainda não jogou partidas suficientes.",
        player.id,
        0x73ec59
      );
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendAnnouncement(
      "[📄] ✅ Vitórias´> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1],
      player.id,
      0x73ec59
    );

    return false;
  } else if (["!goats"].includes(message[0].toLowerCase())) {
    var tableau = [];
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (
          ![
            "player_name",
            "view_mode",
            "geo",
            "avatar",
            "player_auth_key",
          ].includes(key) &&
          JSON.parse(localStorage.getItem(key))[Ss.WI] > 400
        ) {
          tableau.push([
            JSON.parse(localStorage.getItem(key))[Ss.NK],
            JSON.parse(localStorage.getItem(key))[Ss.WI],
          ]);
        }
      });
    } catch {}
    if (tableau.length < 5) {
      room.sendAnnouncement(
        "[PV] Ainda não jogou partidas suficientes.",
        player.id,
        0x73ec59
      );
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendAnnouncement(
      "[📄] ✅ GOATS> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1],
      player.id,
      0x73ec59
    );

    return false;
  } else if (["!goals"].includes(message[0].toLowerCase())) {
    var tableau = [];
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (
          ![
            "player_name",
            "view_mode",
            "geo",
            "avatar",
            "player_auth_key",
          ].includes(key) &&
          key.length == 43
        ) {
          tableau.push([
            JSON.parse(localStorage.getItem(key))[Ss.NK],
            JSON.parse(localStorage.getItem(key))[Ss.GL],
          ]);
        }
      });
    } catch {}
    if (tableau.length < 5) {
      room.sendAnnouncement(
        "[📄] Ainda não jogou partidas suficientes..",
        player.id,
        0x73ec59
      );
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendAnnouncement(
      "[📄] ⚽️ Gols> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1],
      player.id,
      0x73ec59
    );

    return false;
  } else if (["!assists"].includes(message[0].toLowerCase())) {
    var tableau = [];
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (
          ![
            "player_name",
            "view_mode",
            "geo",
            "avatar",
            "player_auth_key",
          ].includes(key) &&
          key.length == 43
        ) {
          tableau.push([
            JSON.parse(localStorage.getItem(key))[Ss.NK],
            JSON.parse(localStorage.getItem(key))[Ss.AS],
          ]);
        }
      });
    } catch {}
    if (tableau.length < 5) {
      room.sendAnnouncement(
        "[PV] Ainda não jogou partidas suficientes.",
        player.id
      );
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendAnnouncement(
      "[📄] 👟 Assistências> #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1],
      player.id,
      0x73ec59
    );

    return false;
  } else if (["!cs"].includes(message[0].toLowerCase())) {
    var tableau = [];
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (
          ![
            "player_name",
            "view_mode",
            "geo",
            "avatar",
            "player_auth_key",
          ].includes(key) &&
          key.length == 43
        ) {
          tableau.push([
            JSON.parse(localStorage.getItem(key))[Ss.NK],
            JSON.parse(localStorage.getItem(key))[Ss.CS],
          ]);
        }
      });
    } catch {}
    if (tableau.length < 5) {
      room.sendAnnouncement(
        "[PV] Ainda não jogou partidas suficientes.",
        player.id,
        0x73ec59
      );
      return false;
    }
    tableau.sort(function (a, b) {
      return b[1] - a[1];
    });
    room.sendAnnouncement(
      "[📄] 🤚 CS > #1 " +
        tableau[0][0] +
        ": " +
        tableau[0][1] +
        " #2 " +
        tableau[1][0] +
        ": " +
        tableau[1][1] +
        " #3 " +
        tableau[2][0] +
        ": " +
        tableau[2][1] +
        " #4 " +
        tableau[3][0] +
        ": " +
        tableau[3][1] +
        " #5 " +
        tableau[4][0] +
        ": " +
        tableau[4][1],
      player.id,
      0x73ec59
    );

    return false;
  } else if (["!claim"].includes(message[0].toLowerCase())) {
    if (message[1] == adminPassword) {
      room.setPlayerAdmin(player.id, true);
      var stats;
      localStorage.getItem(getAuth(player))
        ? (stats = JSON.parse(localStorage.getItem(getAuth(player))))
        : (stats = [
            0,
            0,
            0,
            0,
            "0.00",
            0,
            0,
            0,
            0,
            "0.00",
            "player",
            player.name,
          ]);
      if (stats[Ss.RL] != "master") {
        stats[Ss.RL] = "master";
        room.sendAnnouncement(
          "[📄] " + player.name + " logou como admin do FMT!",
          null,
          0xf8ff00,
          "bold"
        );
        localStorage.setItem(getAuth(player), JSON.stringify(stats));
      }
    }
  } else if (["!setadmin", "!admin"].includes(message[0].toLowerCase())) {
    if (
      localStorage.getItem(getAuth(player)) &&
      JSON.parse(localStorage.getItem(getAuth(player)))[Ss.RL] == "master"
    ) {
      if (message.length >= 2 && message[1][0] == "#") {
        message[1] = message[1].substring(1, message[1].length);
        if (
          !Number.isNaN(Number.parseInt(message[1])) &&
          room.getPlayer(Number.parseInt(message[1])) != null
        ) {
          var stats;
          localStorage.getItem(
            getAuth(room.getPlayer(Number.parseInt(message[1])))
          )
            ? (stats = JSON.parse(
                localStorage.getItem(
                  getAuth(room.getPlayer(Number.parseInt(message[1])))
                )
              ))
            : (stats = [
                0,
                0,
                0,
                0,
                "0.00",
                0,
                0,
                0,
                0,
                "0.00",
                "player",
                room.getPlayer(Number.parseInt(message[1])).name,
              ]);
          if (stats[Ss.RL] == "player") {
            stats[Ss.RL] = "admin";
            localStorage.setItem(
              getAuth(room.getPlayer(Number.parseInt(message[1]))),
              JSON.stringify(stats)
            );
            room.setPlayerAdmin(
              room.getPlayer(Number.parseInt(message[1])).id,
              true
            );
            room.sendChat(
              room.getPlayer(Number.parseInt(message[1])).name +
                " agora é o administrador!"
            );
          }
        }
      }
    }
  } else if (
    ["!setplayer", "!removeadmin"].includes(message[0].toLowerCase())
  ) {
    if (
      localStorage.getItem(getAuth(player)) &&
      JSON.parse(localStorage.getItem(getAuth(player)))[Ss.RL] == "master"
    ) {
      if (message.length >= 2 && message[1][0] == "#") {
        message[1] = message[1].substring(1, message[1].length);
        if (
          !Number.isNaN(Number.parseInt(message[1])) &&
          room.getPlayer(Number.parseInt(message[1])) != null
        ) {
          var stats;
          localStorage.getItem(
            getAuth(room.getPlayer(Number.parseInt(message[1])))
          )
            ? (stats = JSON.parse(
                localStorage.getItem(
                  getAuth(room.getPlayer(Number.parseInt(message[1])))
                )
              ))
            : (stats = [
                0,
                0,
                0,
                0,
                "0.00",
                0,
                0,
                0,
                0,
                "0.00",
                "player",
                room.getPlayer(Number.parseInt(message[1])).name,
              ]);
          if (stats[Ss.RL] == "admin") {
            room.sendChat(
              room.getPlayer(Number.parseInt(message[1])).name +
                " Não é mais o administrador !"
            );
            stats[Ss.RL] = "player";
            localStorage.setItem(
              getAuth(room.getPlayer(Number.parseInt(message[1]))),
              JSON.stringify(stats)
            );
            room.setPlayerAdmin(
              room.getPlayer(Number.parseInt(message[1])).id,
              false
            );
          }
        }
      }
    }
  } else if (["!mutes", "!mutelist"].includes(message[0].toLowerCase())) {
    var cstm = "[PV] Lista de Mutados : ";
    for (var i = 0; i < extendedP.length; i++) {
      if (
        room.getPlayer(extendedP[i][eP.ID]) != null &&
        getMute(room.getPlayer(extendedP[i][eP.ID]))
      ) {
        if (
          140 - cstm.length <
          (
            room.getPlayer(extendedP[i][eP.ID]).name +
            "[" +
            extendedP[i][eP.ID] +
            "], "
          ).length
        ) {
          room.sendChat(cstm, player.id);
          cstm = "... ";
        }
        cstm +=
          room.getPlayer(extendedP[i][eP.ID]).name +
          "[" +
          extendedP[i][eP.ID] +
          "], ";
      }
    }
    if (cstm == "[PV] Lista de Mutados : ") {
      room.sendChat("[PV] Não há ninguém na lista de mutados !", player.id);
      return false;
    }
    cstm = cstm.substring(0, cstm.length - 2);
    cstm += ".";
    room.sendChat(cstm, player.id);
  } else if (["!mute"].includes(message[0].toLowerCase())) {
    if (nickAdmins.includes(player.name) || staff.includes(player.id)) {
      updateTeams();
      var timeOut;
      if (!Number.isNaN(Number.parseInt(message[1])) && message.length > 1) {
        if (Number.parseInt(message[1]) > 0) {
          timeOut = Number.parseInt(message[1]) * 60 * 1000;
        } else {
          timeOut = 3 * 60 * 1000;
        }
        if (message[2].length > 0) {
          message[2] = message[2].substring(1, message[2].length);
          if (
            !Number.isNaN(Number.parseInt(message[2])) &&
            room.getPlayer(Number.parseInt(message[2])) != null
          ) {
            if (
              room.getPlayer(Number.parseInt(message[2])).admin ||
              getMute(room.getPlayer(Number.parseInt(message[2])))
            ) {
              return false;
            }
            setTimeout(
              function (player) {
                setMute(player, false);
              },
              timeOut,
              room.getPlayer(Number.parseInt(message[2]))
            );
            setMute(room.getPlayer(Number.parseInt(message[2])), true);
            room.sendChat(
              room.getPlayer(Number.parseInt(message[2])).name +
                " foi mutado por " +
                timeOut / 60000 +
                " minutos !"
            );
          }
        }
      } else if (Number.isNaN(Number.parseInt(message[1]))) {
        if (message[1].length > 1 && message[1][0] == "#") {
          message[1] = message[1].substring(1, message[1].length);
          if (
            !Number.isNaN(Number.parseInt(message[1])) &&
            room.getPlayer(Number.parseInt(message[1])) != null
          ) {
            if (
              room.getPlayer(Number.parseInt(message[1])).admin ||
              getMute(room.getPlayer(Number.parseInt(message[1])))
            ) {
              return false;
            }
            setTimeout(
              function (player) {
                setMute(player, false);
              },
              3 * 60 * 1000,
              room.getPlayer(Number.parseInt(message[1]))
            );
            setMute(room.getPlayer(Number.parseInt(message[1])), true);
            room.sendChat(
              room.getPlayer(Number.parseInt(message[1])).name +
                " foi mutado por 3 minutos!"
            );
          }
        }
      }
    }
  } else if (["!unmute"].includes(message[0].toLowerCase())) {
    if (staff.includes(player.id) == true && message.length >= 2) {
      if (message[1] == "all") {
        extendedP.forEach((ePlayer) => {
          ePlayer[eP.MUTE] = false;
        });
        room.sendChat("A lista de mutados foi limpa!");
      } else if (
        !Number.isNaN(Number.parseInt(message[1])) &&
        room.getPlayer(Number.parseInt(message[1])) != null &&
        getMute(room.getPlayer(Number.parseInt(message[1])))
      ) {
        setMute(room.getPlayer(Number.parseInt(message[1])), false);
        room.sendChat(
          room.getPlayer(Number.parseInt(message[1])).name + " foi desmutado !"
        );
      } else if (Number.isNaN(Number.parseInt(message[1]))) {
        if (message[1].length > 1 && message[1][0] == "#") {
          message[1] = message[1].substring(1, message[1].length);
          if (
            !Number.isNaN(Number.parseInt(message[1])) &&
            room.getPlayer(Number.parseInt(message[1])) != null &&
            getMute(room.getPlayer(Number.parseInt(message[1])))
          ) {
            setMute(room.getPlayer(Number.parseInt(message[1])), false);
            room.sendChat(
              room.getPlayer(Number.parseInt(message[1])).name +
                " foi desmutado!"
            );
          }
        }
      }
    }
  } else if (["!slow"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      if (message.length == 1) {
        slowMode = 2;
        room.sendChat("Modo lento ativado (2 segundos)!");
      } else if (message.length == 2) {
        if (!Number.isNaN(Number.parseInt(message[1]))) {
          if (Number.parseInt(message[1]) > 0) {
            slowMode = Number.parseInt(message[1]);
            room.sendChat(slowMode + " segundos, modo lento ativado !");
            return false;
          }
        }
        slowMode = 2;
        room.sendChat("Modo lento ativado (2 segundos)!");
      }
    }
  } else if (["!endslow"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      slowMode != 0 ? room.sendChat("Fim do modo lento.") : null;
      slowMode = 0;
    }
  } else if (["!banlist", "!bans"].includes(message[0].toLowerCase())) {
    if (banList.length == 0) {
      room.sendChat("[PV] Não há ninguém na lista de banidos!", player.id);
      return false;
    }
    var cstm = "[PV] Lista de banidos : ";
    for (var i = 0; i < banList.length; i++) {
      if (
        140 - cstm.length <
        (banList[i][0] + "[" + banList[i][1] + "], ").length
      ) {
        room.sendChat(cstm, player.id);
        cstm = "... ";
      }
      cstm += banList[i][0] + "[" + banList[i][1] + "], ";
    }
    cstm = cstm.substring(0, cstm.length - 2);
    cstm += ".";
    room.sendChat(cstm, player.id);
  } else if (["!clearbans"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      if (message.length == 1) {
        room.clearBans();
        room.sendChat("Bans limpos!");
        banList = [];
      }
      if (message.length == 2) {
        if (!Number.isNaN(Number.parseInt(message[1]))) {
          if (Number.parseInt(message[1]) > 0) {
            ID = Number.parseInt(message[1]);
            room.clearBan(ID);
            if (banList.length != banList.filter((array) => array[1] != ID)) {
              room.sendChat(
                banList.filter((array) => array[1] == ID)[0][0] +
                  " foi desbanido do FMT!"
              );
            }
            setTimeout(() => {
              banList = banList.filter((array) => array[1] != ID);
            }, 20);
          }
        }
      }
    }
  } else if (["!bb"].includes(message[0].toLowerCase())) {
    if (player.team === 0) {
      room.kickPlayer(player.id, "Bye 💋", false);
    } else
      room.sendAnnouncement(
        "Você não pode usar esse comando enquanto joga.",
        player.id,
        paletadecores.Vermelho,
        "bold"
      );
  } else if (message[0].toLowerCase().startsWith("!fut")) {
    if (player.admin) {
      switch (message[0]) {
        case "!fut3":
          maxTeamSize = 3;
          quickRestart();
          loadMap(x3Map, scoreLimitx3, timeLimitx3);
          break;
        case "!fut4":
          maxTeamSize = 4;
          quickRestart();
          loadMap(x4Map, scoreLimitx4, timeLimitx4);
          break;
        case "!fut5":
          maxTeamSize = 5;
          quickRestart();
          loadMap(x5Map, scoreLimitx5, timeLimitx5);
          break;
        case "!fut7":
          maxTeamSize = 7;
          quickRestart();
          loadMap(x7Map, scoreLimitx7, timeLimitx7);
          break;

        default:
          break;
      }
    }
  } else if (["!novip"].includes(message[0].toLowerCase())) {
    message = message.split(" ");
    if (
      localStorage.getItem(getAuth(player)) &&
      JSON.parse(localStorage.getItem(getAuth(player)))[Ss.RL] == "master"
    ) {
      if (message.length >= 2 && message[1][0] == "#") {
        message[1] = message[1].substring(1, message[1].length);
        if (
          !Number.isNaN(Number.parseInt(message[1])) &&
          room.getPlayer(Number.parseInt(message[1])) != null
        ) {
          var stats;
          localStorage.getItem(
            getAuth(room.getPlayer(Number.parseInt(message[1])))
          )
            ? (stats = JSON.parse(
                localStorage.getItem(
                  getAuth(room.getPlayer(Number.parseInt(message[1])))
                )
              ))
            : (stats = [
                0,
                0,
                0,
                0,
                "0.00",
                0,
                0,
                0,
                0,
                "0.00",
                "player",
                room.getPlayer(Number.parseInt(message[1])).name,
              ]);
          if (stats[Ss.RL] == "vip") {
            room.sendAnnouncement(
              "[👤]" +
                room.getPlayer(Number.parseInt(message[1])).name +
                " Não é mais um jogador VIP !"
            );
            stats[Ss.RL] = "player";
            localStorage.setItem(
              getAuth(room.getPlayer(Number.parseInt(message[1]))),
              JSON.stringify(stats)
            );
          }
        }
      }
    }
  }

  if (message[0][0] == "!") {
    //if a command is received, after process, exit
    return false;
  }

  if (teamR.length != 0 && teamB.length != 0 && inChooseMode) {
    //choosing management
    if (player.id == teamR[0].id || player.id == teamB[0].id) {
      // we care if it's one of the captains choosing
      if (teamR.length <= teamB.length && player.id == teamR[0].id) {
        // we care if it's red turn && red cap talking
        if (["top", "auto"].includes(message[0].toLowerCase())) {
          room.setPlayerTeam(teamS[0].id, Team.RED);
          redCaptainChoice = "top";
          clearTimeout(timeOutCap);
          room.sendChat(player.name + " escolheu Top !");
          return false;
        } else if (["random", "rand"].includes(message[0].toLowerCase())) {
          var r = getRandomInt(teamS.length);
          room.setPlayerTeam(teamS[r].id, Team.RED);
          redCaptainChoice = "random";
          clearTimeout(timeOutCap);
          room.sendChat(player.name + " escolheu Random !");
          return false;
        } else if (["bottom", "bot"].includes(message[0].toLowerCase())) {
          room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
          redCaptainChoice = "bottom";
          clearTimeout(timeOutCap);
          room.sendChat(player.name + " escolheu Bottom !");
          return false;
        } else if (!Number.isNaN(Number.parseInt(message[0]))) {
          if (
            Number.parseInt(message[0]) > teamS.length ||
            Number.parseInt(message[0]) < 1
          ) {
            room.sendChat("[PV] O número que escolheu é inválido !", player.id);
            return false;
          } else {
            room.setPlayerTeam(
              teamS[Number.parseInt(message[0]) - 1].id,
              Team.RED
            );
            room.sendChat(
              player.name +
                " escolheu " +
                teamS[Number.parseInt(message[0]) - 1].name +
                " !"
            );
            return false;
          }
        }
      }
      if (teamR.length > teamB.length && player.id == teamB[0].id) {
        // we care if it's red turn && red cap talking
        if (["top", "auto"].includes(message[0].toLowerCase())) {
          room.setPlayerTeam(teamS[0].id, Team.BLUE);
          blueCaptainChoice = "top";
          clearTimeout(timeOutCap);
          room.sendChat(player.name + " escolheu Top !");
          return false;
        } else if (["random", "rand"].includes(message[0].toLowerCase())) {
          room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
          blueCaptainChoice = "random";
          clearTimeout(timeOutCap);
          room.sendChat(player.name + " escolheu Random !");
          return false;
        } else if (["bottom", "bot"].includes(message[0].toLowerCase())) {
          room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
          blueCaptainChoice = "bottom";
          clearTimeout(timeOutCap);
          room.sendChat(player.name + " escolheu Bottom !");
          return false;
        } else if (!Number.isNaN(Number.parseInt(message[0]))) {
          if (
            Number.parseInt(message[0]) > teamS.length ||
            Number.parseInt(message[0]) < 1
          ) {
            room.sendChat("[PV] O número que escolheu é inválido !", player.id);
            return false;
          } else {
            room.setPlayerTeam(
              teamS[Number.parseInt(message[0]) - 1].id,
              Team.BLUE
            );
            room.sendChat(
              player.name +
                " escolheu " +
                teamS[Number.parseInt(message[0]) - 1].name +
                " !"
            );
            return false;
          }
        }
      }
    }
  }

  if (getMute(player)) {
    room.sendChat("Você está mutado.", player.id);
    return false;
  }
  if (slowMode > 0) {
    if (!player.admin) {
      if (!SMSet.has(player.id)) {
        SMSet.add(player.id);
        setTimeout(
          (number) => {
            SMSet.delete(number);
          },
          slowMode * 1000,
          player.id
        );
      } else {
        return false;
      }
    }
  }

  if (adms.includes(player.id) == true) {
    if (player.admin) {
      superadminMessage = message.join(" ");
      var superadminChatColor = 0xb021ed;
      if (superadminMessage.charAt(0) != "!") {
        room.sendAnnouncement(
          "[ADM] " + player.name + ": " + superadminMessage,
          null,
          superadminChatColor,
          "bold",
          1
        );
        return false;
      }
    }
  }

  if (helpers.includes(player.id) == true) {
    helpMessage = message.join(" ");
    var helpChatColor = 0x6df736;
    if (helpMessage.charAt(0) != "!") {
      room.sendAnnouncement(
        "[HELPER] " + player.name + ": " + helpMessage,
        null,
        helpChatColor,
        "bold",
        1
      );
      return false;
    }
  }

  if (mods.includes(player.id) == true) {
    if (player.admin) {
      modMessage = message.join(" ");
      var ModChatColor = 0x00a6ff;
      if (modMessage.charAt(0) != "!") {
        room.sendAnnouncement(
          "[MOD] " + player.name + ": " + modMessage,
          null,
          ModChatColor,
          "bold",
          1
        );
        return false;
      }
    }
  }

  if (ovALL.includes(player.id) == true) {
    modMessage = message.join(" ");
    var ModChatColor = 0x00a6ff;

    var stats;
    localStorage.getItem(getAuth(player))
      ? (stats = JSON.parse(localStorage.getItem(getAuth(player))))
      : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"]);

    const GA = stats[Ss.GA];
    const GK = stats[Ss.GK];
    const AS = stats[Ss.AS];
    const CS = stats[Ss.CS];
    const GL = stats[Ss.GL];

    const GLp = (GL * 100) / GA;
    const ASp = (AS * 100) / GA;
    const CSp = (CS * 100) / GK;

    console.log(GA);
    console.log(GK);
    console.log(AS);

    const gkPerGame = (GK * 100) / GA;
    var isGK = false;
    var fMedia = 0;

    if (GA > 50) {
      if (gkPerGame >= 50) {
        isGK = true;
        console.log("É um GK");
      }
    }

    if (isGK) {
      fMedia = (GLp * 2 + ASp * 3 + CSp * 3.5) / 3;
      console.log("GK: " + Math.trunc(fMedia));
    } else {
      fMedia = (GLp * 2.5 + ASp * 2.3 + CSp * 2) / 3;
      console.log(Math.trunc(fMedia));
    }

    if (modMessage.charAt(0) != "!") {
      room.sendAnnouncement(
        `[PH ${Math.trunc(fMedia)}] ` + player.name + ": " + modMessage,
        null,
        0xffffff,
        "bold",
        1
      );
      return false;
    }
  }

  if (booster.includes(player.id) == true) {
    var boostMessage = message.join(" ");
    var boostChatColor = 0xff6eff;
    if (boostMessage.charAt(0) != "!") {
      room.sendAnnouncement(
        "[BOOSTER] " + player.name + ": " + boostMessage,
        null,
        boostChatColor,
        "bold",
        1
      );
      return false;
    }
  }

  if (logados.includes(player.id) == true) {
    messagemnormal = message.join(" ");
    console.log("auth: " + getAuth(player));
    if (localStorage.getItem(getAuth(player))) {
      stats = JSON.parse(localStorage.getItem(getAuth(player)));
      var announcement = "";
      var chatColor = "";
      if (stats[Ss.WR] > 90 && stats[Ss.GA] > 50) {
        announcement += "🔥 「𝗙𝗔𝗠𝗜𝗡𝗧𝗢」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 86 && stats[Ss.GA] > 50) {
        announcement += "👑 「𝗥𝗲𝗶」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 83 && stats[Ss.GA] > 50) {
        announcement += "🔆 「𝗘𝗽𝗶𝗰𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 80 && stats[Ss.GA] > 50) {
        announcement += "💎 「𝗗𝗶𝗮𝗺𝗮𝗻𝘁𝗲」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 75 && stats[Ss.GA] > 50) {
        announcement += "🏆 「𝗖𝗮𝗺𝗽𝗲𝗮𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 70 && stats[Ss.GA] > 50) {
        announcement += "🗿 「𝗖𝗵𝗮𝗱」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 65 && stats[Ss.GA] > 50) {
        announcement += "🥇🥇🥇 「𝗢𝘂𝗿𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 60 && stats[Ss.GA] > 50) {
        announcement += "🥇🥇  「𝗢𝘂𝗿𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 55 && stats[Ss.GA] > 50) {
        announcement += "🥇   「𝗢𝘂𝗿𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 50 && stats[Ss.GA] > 50) {
        announcement += "🥈🥈🥈 「𝗣𝗿𝗮𝘁𝗮」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 44 && stats[Ss.GA] > 50) {
        announcement += "🥈🥈  「𝗣𝗿𝗮𝘁𝗮」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 40 && stats[Ss.GA] > 50) {
        announcement += "🥈   「𝗣𝗿𝗮𝘁𝗮」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 30 && stats[Ss.GA] > 50) {
        announcement += "🥉🥉🥉 「𝗙𝗲𝗿𝗿𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 20 && stats[Ss.GA] > 50) {
        announcement += "🥉🥉  「𝗙𝗲𝗿𝗿𝗼」";
        chatColor = "0xd4d2d2";
      } else if (stats[Ss.WR] > 10 && stats[Ss.GA] > 50) {
        announcement += "🥉   「𝗙𝗲𝗿𝗿𝗼」";
        chatColor = "0xd4d2d2";
      } else {
        announcement += "🥴 「𝗣𝗲𝗿𝗲𝗯𝗮」";
        chatColor = "0xd4d2d2";
      }
      console.log(announcement);
      console.log(chatColor);
      var playerRole = JSON.parse(localStorage.getItem(getAuth(player)))[Ss.RL];
      if (playerRole == "vip") {
        announcement += "「👑VIP」";
        chatColor = "0x00B4FF";
      }
      if (playerRole == "admin" || playerRole == "master") {
        announcement += "「😈」";
        chatColor = "0xF8FF00";
      }
      console.log(announcement);
      console.log(chatColor);
      console.log(messagemnormal);
      announcement += player.name + ": " + messagemnormal;
      room.sendAnnouncement(announcement, null, chatColor);
      return false;
    }
  }

  if (supremoLoja.includes(player.id) == true) {
    supMessage = message.join(" ");
    const listaVip = JSON.parse(localStorage.getItem("listavip"));
    const playerObj = listaVip.umMes.find((p) => p.auth === getAuth(player));
    console.log(playerObj);
    const umMesColor = playerObj.colorChat;
    var stats;
    localStorage.getItem(getAuth(player))
      ? (stats = JSON.parse(localStorage.getItem(getAuth(player))))
      : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"]);
    var umMesCount = 0;
    umMesCount = stats[Ss[playerObj.count]];

    let emojiCount = "⚽";
    switch (playerObj.count) {
      case "GL":
        emojiCount = "⚽";
        break;
      case "AS":
        emojiCount = "👟";
        break;
      case "CS":
        emojiCount = "🧤";
        break;
      default:
        break;
    }

    if (umMesCount === undefined) {
      umMesCount = stats[Ss.GL];
    }

    console.log(umMesColor);
    if (supMessage.charAt(0) != "!") {
      room.sendAnnouncement(
        `[` +
          umMesCount +
          ` ${emojiCount}` +
          `DELUXE] ` +
          player.name +
          ": " +
          supMessage,
        null,
        umMesColor,
        "bold",
        1
      );
      return false;
    }
  }

  if (nickAdmins.includes(player.name) == true) {
    sadmMessage = message.join(" ");
    var sadmChatColor = 0xd4d2d2;
    if (sadmMessage.charAt(0) != "!") {
      room.sendAnnouncement(
        "「🔥」 " + player.name + ": " + sadmMessage,
        null,
        sadmChatColor,
        "bold",
        1
      );
      return false;
    }
  }

  if (nickMods.includes(player.name) == true) {
    sadmMessage = message.join(" ");
    var sadmChatColor = 0xd4d2d2;
    if (sadmMessage.charAt(0) != "!") {
      room.sendAnnouncement(
        "「️👮🏼‍♂️」 " + player.name + ": " + sadmMessage,
        null,
        sadmChatColor,
        "bold",
        1
      );
      return false;
    }
  }

  if (logados.includes(player.id) == false) {
    naoLogadoMessage = message.join(" ");
    var nlogChatColor = 0xb0aea7;
    if (naoLogadoMessage.length < 35) {
      if (naoLogadoMessage.charAt(0) != "!") {
        room.sendAnnouncement(
          "🚫 " + player.name + ": " + naoLogadoMessage,
          null,
          nlogChatColor,
          "normal"
        );
        return false;
      }
    } else {
      return false;
    }
  }
};

room.onPlayerActivity = function (player) {
  setActivity(player, 0);

  if (AFKPause && player.id in AFKRed) {
    clearTimeout(AFKRed[player.id]);
    room.sendAnnouncement(
      "Você confirmou presença.",
      player.id,
      paletadecores.Verde,
      "bold",
      2
    );
    AFKCount++;
    delete AFKRed[player.id];
    if (AFKCount === teamB.length + teamR.length) {
      unpauseActivity();
    }
  }

  if (AFKPause && player.id in AFKBlue) {
    console.log("OK");
    clearTimeout(AFKBlue[player.id]);
    room.sendAnnouncement(
      "Você confirmou presença.",
      player.id,
      paletadecores.Verde,
      "bold",
      2
    );
    AFKCount++;
    delete AFKBlue[player.id];
    if (AFKCount === teamB.length + teamR.length) {
      unpauseActivity();
    }
  }
};

let defesas = {
  red: 0,
  blue: 0,
};

room.onPlayerBallKick = function (player) {
  if (lastPlayersTouched[0] == null || player.id != lastPlayersTouched[0].id) {
    !activePlay ? (activePlay = true) : null;
    lastTeamTouched = player.team;
    lastPlayersTouched[1] = lastPlayersTouched[0];
    lastPlayersTouched[0] = player;

    console.log(lastPlayersTouched);

    if (lastPlayersTouched[1] && lastPlayersTouched[0]) {
      if (lastPlayersTouched[1].team !== lastPlayersTouched[0].team) {
        if (
          lastPlayersTouched[0].name === GKList[0].name ||
          lastPlayersTouched[0].name === GKList[1].name
        ) {
          console.log("defesa");
        }
      }
    }
  }
};

const pontoporgol = 2.5;
const pontoporassist = 2;
const pontoporcs = 2.5;

const coinporgol = 50;
const coinporassist = 35;
const coinporcs = 40;
const coinpormvp = 60;

/* GAME MANAGEMENT */

let pausePlayers = [];

let AFKRed = {};
let AFKBlue = {};
let AFKPause = false;
let AFKCount = 0;

function pauseActivity() {
  console.log(teamR);
  console.log(teamB);
  room.pauseGame(true);
  AFKPause = true;

  for (var i = 0; i < teamR.length; i++) {
    room.sendAnnouncement(
      "[5s] Aperte algum botão para confirmar presença",
      teamR[i].id,
      paletadecores.Branco,
      "bold",
      2
    );
    console.log(teamR[i]);
    const playerID = teamR[i].id;
    AFKRed[teamR[i].id] = setTimeout(() => {
      AFKPause
        ? room.kickPlayer(playerID, "Presença não confirmada. Bye", false)
        : null;
    }, 5000);
  }
  for (var i = 0; i < teamB.length; i++) {
    room.sendAnnouncement(
      "[5s] Aperte algum botão para confirmar presença",
      teamB[i].id,
      paletadecores.Branco,
      "bold",
      2
    );
    console.log(teamB[i]);
    const playerID = teamB[i].id;
    AFKBlue[teamB[i].id] = setTimeout(() => {
      AFKPause
        ? room.kickPlayer(playerID, "Presença não confirmada. Bye", false)
        : null;
    }, 5000);
  }
}

function unpauseActivity() {
  room.sendAnnouncement(
    "Todos confirmaram presença. Vamos para o jogo!",
    null,
    paletadecores.Verde,
    "bold",
    2
  );
  AFKPause = false;
  AFKRed = {};
  AFKBlue = {};
  AFKCount = 0;
  room.pauseGame(false);
}

var isGameRunning = false;

room.onGameStart = function (byPlayer) {
  pausePlayers = [];
  game = new Game(Date.now(), room.getScores(), []);
  countAFK = true;
  activePlay = false;
  goldenGoal = false;
  endGameVariable = false;
  lastPlayersTouched = [null, null];
  Rposs = 0;
  Bposs = 0;
  GKList = [];
  allReds = [];
  allBlues = [];

  var pontos = [0, 0, 0];
  room.startRecording();

  room.sendAnnouncement(
    "FMT EM RITMO EUROPEU! UNIFORMES DA CHAMPIONS LEAGUE ADICIONADOS, DIGITE !UNI",
    null,
    0xff576d,
    "bold"
  );

  //room.sendAnnouncement("PARA VER OS UNIFORMES, DIGITE: !uni, !uni2, !uni3, e !uni4", null, 0xff576d, 'bold')

  room.sendAnnouncement(
    "[💬] Use !t para conversar com a sua equipe!",
    null,
    0x94fffb,
    "normal",
    2
  );
  if (teamR.length == maxTeamSize && teamB.length == maxTeamSize) {
    for (var i = 0; i < maxTeamSize; i++) {
      allReds.push(teamR[i]);
      allBlues.push(teamB[i]);
    }
  }
  for (var i = 0; i < extendedP.length; i++) {
    extendedP[i][eP.GK] = 0;
    extendedP[i][eP.ACT] = 0;
    room.getPlayer(extendedP[i][eP.ID]) == null ? extendedP.splice(i, 1) : null;
  }
  deactivateChooseMode();

  AFKPause = false;
  AFKRed = {};
  AFKBlue = {};
  AFKCount = 0;

  isGameRunning = true;
};

room.onGameStop = function (byPlayer) {
  isGameRunning = false;
  bancoDeReservas.redQuit = {};
  bancoDeReservas.blueQuit = {};

  if (byPlayer.id == 0 && endGameVariable) {
    updateTeams();
    if (inChooseMode) {
      allowAFK = false;
      setTimeout(() => {
        allowAFK = true;
      }, 2000);

      if (players.length == 2 * maxTeamSize) {
        inChooseMode = false;
        resetBtn();
        for (var i = 0; i < maxTeamSize; i++) {
          setTimeout(() => {
            randomBtn();
          }, 400 * i);
        }
        setTimeout(() => {
          room.startGame();
        }, 2000);
      } else {
        if (lastWinner == Team.RED) {
          blueToSpecBtn();
        } else if (lastWinner == Team.BLUE) {
          redToSpecBtn();
          blueToRedBtn();
        } else {
          resetBtn();
        }
        setTimeout(() => {
          topBtn();
        }, 500);
      }
    } else {
      if (players.length == 2) {
        if (lastWinner == Team.BLUE) {
          room.setPlayerTeam(teamB[0].id, Team.RED);
          room.setPlayerTeam(teamR[0].id, Team.BLUE);
        }
        setTimeout(() => {
          room.startGame();
        }, 2000);
      } else if (players.length == 3 || players.length >= 2 * maxTeamSize + 1) {
        if (lastWinner == Team.RED) {
          blueToSpecBtn();
        } else {
          redToSpecBtn();
          blueToRedBtn();
        }
        setTimeout(() => {
          topBtn();
        }, 200);
        setTimeout(() => {
          room.startGame();
        }, 2000);
      } else if (players.length == 4) {
        resetBtn();
        setTimeout(() => {
          randomBtn();
          setTimeout(() => {
            randomBtn();
          }, 500);
        }, 500);
        setTimeout(() => {
          room.startGame();
        }, 2000);
      } else if (players.length == 5 || players.length >= 2 * maxTeamSize + 1) {
        if (lastWinner == Team.RED) {
          blueToSpecBtn();
        } else {
          redToSpecBtn();
          blueToRedBtn();
        }
        setTimeout(() => {
          topBtn();
        }, 200);
        activateChooseMode();
      } else if (players.length == 6) {
        resetBtn();
        setTimeout(() => {
          randomBtn();
          setTimeout(() => {
            randomBtn();
            setTimeout(() => {
              randomBtn();
            }, 500);
          }, 500);
        }, 500);
        setTimeout(() => {
          room.startGame();
        }, 2000);
      }
    }
  }
};

const teamVictory = (scores) => {
  sendDiscordWebhook(scores);
};

room.onGamePause = function (byPlayer) {};

room.onGameUnpause = function (byPlayer) {
  if (
    (teamR.length == 4 && teamB.length == 4 && inChooseMode) ||
    (teamR.length == teamB.length && teamS.length < 2 && inChooseMode)
  ) {
    deactivateChooseMode();
  }
};

room.onTeamGoal = function (team) {
  activePlay = false;
  countAFK = false;
  const scores = room.getScores();
  game.scores = scores;
  const secondsToResetAvatar = 1;
  if (lastPlayersTouched[0] != null && lastPlayersTouched[0].team == team) {
    if (lastPlayersTouched[1] != null && lastPlayersTouched[1].team == team) {
      var frasegol = frasesgoles[(Math.random() * frasesgoles.length) | 0];
      var fraseasis = frasesasis[(Math.random() * frasesasis.length) | 0];
      room.sendAnnouncement(
        "⚽ " +
          getTime(scores) +
          frasegol +
          lastPlayersTouched[0].name +
          fraseasis +
          lastPlayersTouched[1].name +
          ". Velocidade da bola : " +
          ballSpeed.toPrecision(4).toString() +
          "km/h " +
          (team == Team.RED ? "🔴" : "🔵"),
        null,
        team == Team.RED ? 0xff250d : 0x34e5eb,
        "bold"
      );
      game.goals.push(
        new Goal(
          scores.time,
          team,
          lastPlayersTouched[0],
          lastPlayersTouched[1]
        )
      );
      if (lastPlayersTouched[1]) {
        room.setPlayerAvatar(lastPlayersTouched[1].id, "👟");
        setTimeout(() => {
          room.setPlayerAvatar(lastPlayersTouched.id[1].id, null);
        }, secondsToResetAvatar * 1000);
      }

      room.setPlayerAvatar(lastPlayersTouched[0].id, "⚽");
      setTimeout(() => {
        room.setPlayerAvatar(lastPlayersTouched.id[1].id, null);
      }, secondsToResetAvatar * 1000);
    } else {
      var frasegol = frasesgoles[(Math.random() * frasesgoles.length) | 0];
      room.sendAnnouncement(
        "⚽ " +
          getTime(scores) +
          frasegol +
          lastPlayersTouched[0].name +
          " ! Velocidade da bola : " +
          ballSpeed.toPrecision(4).toString() +
          "km/h " +
          (team == Team.RED ? "🔴" : "🔵"),
        null,
        team == Team.RED ? 0xff250d : 0x34e5eb,
        "bold"
      );
      game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], null));

      room.setPlayerAvatar(lastPlayersTouched[0].id, "⚽");
      setTimeout(() => {
        room.setPlayerAvatar(lastPlayersTouched[0].id, null);
      }, secondsToResetAvatar * 1000);
    }
  } else {
    var fraseautogol =
      frasesautogol[(Math.random() * frasesautogol.length) | 0];
    room.sendAnnouncement(
      "😂 " +
        getTime(scores) +
        fraseautogol +
        lastPlayersTouched[0].name +
        " ! Velocidade da bola : " +
        ballSpeed.toPrecision(4).toString() +
        "km/h " +
        (team == Team.RED ? "🔴" : "🔵"),
      null,
      team == Team.RED ? 0xff250d : 0x34e5eb,
      "bold"
    );
    game.goals.push(new Goal(scores.time, team, null, null));

    room.setPlayerAvatar(lastPlayersTouched[0].id, "🤣");
    setTimeout(() => {
      for (let i = 0; i < players.length; i++) {
        room.setPlayerAvatar(lastPlayersTouched.id, null);
      }
    }, secondsToResetAvatar * 1000);
  }
  if (
    scores.scoreLimit != 0 &&
    (scores.red == scores.scoreLimit ||
      (scores.blue == scores.scoreLimit && scores.blue > 0) ||
      goldenGoal == true)
  ) {
    endGame(team);
    goldenGoal = false;
    setTimeout(() => {
      room.stopGame();
    }, 1000);
  }

  room.setPlayerAvatar(lastPlayersTouched[0].id, "⚽️");

  setTimeout(() => {
    room.setPlayerAvatar(lastPlayersTouched[0].id, null);
  }, secondsToResetAvatar * 1000);

  for (let i = 0; i < players.length; i++) {
    if (players[i].team != team) room.setPlayerAvatar(players[i].id, "😭");
  }
  setTimeout(() => {
    for (let i = 0; i < players.length; i++) {
      room.setPlayerAvatar(players[i].id, null);
    }
  }, secondsToResetAvatar * 1000);
};

room.onPositionsReset = function () {
  countAFK = true;
  lastPlayersTouched = [null, null];
};

/* MISCELLANEOUS */

room.onRoomLink = function (url) {};

room.onRoomLink = (link) => {
  if (localStorage.getItem("registros") == null)
    console.error(
      `%c\u2716 localStorage [ registros ]`,
      css + "#FF0000;color: white;"
    );
  else {
    registro = new Map(JSON.parse(localStorage.registros));
    console.log(`%c\u2714 localStorage [ registros ]`, css + "#00FF00;");
  }

  document.querySelector("body").style.backgroundColor = "lightblue";
  document.querySelector("title").innerText = "FMT SERVER";
  
  var subBody = document.querySelector('iframe').contentDocument.getElementsByTagName("body")[0] //subBody
  // change the h1 inside subBody to "FMT SERVER"
  subBody.getElementsByTagName("h1")[0].innerText = "FMT SERVER - " + roomToCode.replace('|', "");
  // creates a img component and set the src to the image and append it to subBody bellow the h1
  var img = document.createElement("img");
  img.width = "300"
  img.src = "https://cdn.discordapp.com/attachments/1014731403067392030/1065374535748157502/FMT_Arena_Logo.png";
  subBody.appendChild(img);
};

room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
  if (getMute(changedPlayer) && changedPlayer.admin) {
    room.sendChat(changedPlayer.name + " foi desmutado.");
    setMute(changedPlayer, false);
  }
  if (
    byPlayer.id != 0 &&
    localStorage.getItem(getAuth(byPlayer)) &&
    JSON.parse(localStorage.getItem(getAuth(byPlayer)))[Ss.RL] == "admin"
  ) {
    room.sendChat(
      "Você não tem permissão para nomear um Administrador !",
      byPlayer.id
    );
    room.setPlayerAdmin(changedPlayer.id, false);
  }
};

room.onStadiumChange = function (newStadiumName, byPlayer) {
  room.sendAnnouncement(" 𝙈𝙐𝘿𝘼𝙉𝘿𝙊 𝘼 𝘼𝙍𝙀𝙉𝘼... ", null, 0xe7ff0f, "bold", 2);
};

room.onGameTick = function () {
  checkTime();
  getLastTouchOfTheBall();
  getStats();
  handleInactivity();
};

setInterval(() => {
  PublicitaDiscord();
}, 900000);

setInterval(() => {
  PublicitaConcurso();
}, 1500000);

setInterval(() => {
  PublicitaNovatemp();
}, 1700000);

// a cada 30 minutos o papai noel vai dar um presente para um jogador aleatório se a sala estiver com mais de 5 jogadores


if (Object.keys(localStorage).includes("_grecaptcha")) {
  localStorage.removeItem("_grecaptcha");
}
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  var a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

function backupServerData() {
  let data = {};
  data.stats = stats;
  // data.bans = bans;

  let jsonData = JSON.stringify(data);
  download(jsonData, "server_stats.json", "application/json");
}

function decryptHex(str) {
  let hexString = str;
  let strOut = "";
  for (let x = 0; x < hexString.length; x += 2) {
    strOut += String.fromCharCode(parseInt(hexString.substr(x, 2), 16));
  }
  return strOut;
}
