const lib = require('./lib.js');
const fs = require('fs');

(async (clientId, clientSecret) => {
    const file = fs.readFileSync(".env", {encoding:'utf8', flag:'r'});
    const env = JSON.parse(file);

    console.log(env);
    let token = await lib.getToken(env.uid, env.secret);
    console.log(token);
    const logtimes = await lib.getUserLocationStats(token, 'kmeixner');
    console.log(logtimes);
    let sum = 0.0;
    console.log(Object.values(logtimes).forEach(element => {
        splitElement = element.split(':');
        sum += parseFloat(splitElement[0]);
        sum += parseFloat(splitElement[1]) / 60;
        sum += parseFloat(splitElement[2]) / 3600;
    }));
    console.log('avg monthly logtime:', sum/4);
})();