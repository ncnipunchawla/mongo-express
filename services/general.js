const jwtDecode = require('jwt-decode');

function jwtVerifyAndDecode(jwtString) {
    return new Promise((resolve, reject) => {
        if (!jwtString) {
            return reject('jwt must be provided');
        }

        if (typeof jwtString !== 'string') {
            return reject('jwt must be a string');
        }

        var parts = jwtString.split('.');

        if (parts.length !== 3) {
            return reject('not a standard jwt');
        }
        let decoded_token = jwtDecode(jwtString);
        return resolve(decoded_token);
    })
}

module.exports = {
    jwtVerifyAndDecode
}