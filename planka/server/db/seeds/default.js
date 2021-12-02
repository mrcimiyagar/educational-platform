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
  let result = await (await fetch('https://kaspersoft.cloud/auth/get_users', requestOptions)).json();

  let users = [];
  
  users.push({
    email: 'kasper',
    password: bcrypt.hashSync('kasper', 10),
    isAdmin: true,
    name: 'kasper',
    username: 'kasper',
    subscribeToOwnCards: false,
    createdAt: date,
    updatedAt: date,
  });

  result.users.forEach(user => {
    users.push(({
      email: user.username,
      password: bcrypt.hashSync('demo', 10),
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
