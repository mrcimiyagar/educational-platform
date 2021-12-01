const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  const date = new Date().toUTCString();

  let requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    redirect: 'follow',
  }
  let result = await (await fetch(serverRoot + '/auth/get_users', requestOptions)).json();

  return knex('user_account').insert(result.users.map(user => ({
    email: user.username,
    password: bcrypt.hashSync('demo', 10),
    isAdmin: true,
    name: user.firstName + ' ' + user.lastName,
    username: user.username,
    subscribeToOwnCards: false,
    createdAt: date,
    updatedAt: date,
  })));
};
