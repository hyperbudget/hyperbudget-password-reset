const bcrypt = require('bcrypt');

const bcryptHash = (str, salt) => (
    new Promise((resolve, reject) => (
      bcrypt.hash(str, salt, (err, res) => err ? reject(err) : resolve(res))
    ))
);

const checkHash = (str, hash) => {
  return new Promise((resolve, reject) => (
    bcrypt.compare(str, hash, (err, same) => err ? reject(err) : resolve(same)
  )));
}

module.exports = {
  bcryptHash,
  checkHash
};
