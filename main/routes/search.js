const sw = require('../db/models')
const express = require('express')
const bodyParser = require('body-parser')
const {User} = require("../db/models")
const { authenticateMember } = require('../users')
const Op = require('sequelize').Op

const router = express.Router();
let jsonParser = bodyParser.json();

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

router.post('/search_users', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let results = []
        let searchTokens = req.body.query.split(' ')
        for (let i = 0; i < searchTokens.length; i++) {
            let searchToken = searchTokens[i]
            sw.User.findAll({
                include: [{ all: true }],
                where: {[Op.or]: [{firstName: {[Op.like]: '%' + searchToken + '%'}}, {lastName: {[Op.like]: '%' + searchToken + '%'}}]}
            }).then(async function (users) {
                results = results.concat(users).unique(); 
                res.send({status: 'success', users: results});
            });
        }
    });
});

module.exports = router;
