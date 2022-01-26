const fetch = require('node-fetch');
const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  const date = new Date().toUTCString();

  let requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }
  let result = await (await fetch('https://society.kasperian.cloud/auth/get_users', requestOptions)).json();

  let users = [];
  
  users.push({
    email: 'admin',
    password: bcrypt.hashSync('admin', 10),
    isAdmin: true,
    name: 'admin',
    username: 'admin',
    subscribeToOwnCards: false,
    createdAt: date,
    updatedAt: date,
  });

  result.users.forEach(user => {
    users.push(({
      email: user.username,
      password: bcrypt.hashSync(user.username, 10),
      isAdmin: true,
      name: user.firstName + ' ' + user.lastName,
      username: user.username,
      subscribeToOwnCards: false,
      createdAt: date,
      updatedAt: date,
    }));
  });

  return knex('user_account').insert(users);
};
