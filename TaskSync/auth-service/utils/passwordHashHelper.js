const bcrypt = require('bcrypt')

const encryptPassword = (pass) => {
    return bcrypt.hashSync(pass, 10)
}

const decryptPassword = (pass, hash) => {
    return bcrypt.compareSync(pass, hash)
}

module.exports = {
    encryptPassword,
    decryptPassword
}