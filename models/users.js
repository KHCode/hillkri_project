const {Datastore} = require('@google-cloud/datastore');
const { builtinModules } = require('module');
const datastore = new Datastore();
const USERS = "users";

module.exports = {

    post_user: async function (req, res, next) {
        var key = datastore.key(USERS, req.oidc.user.sub);
        const new_user = {
            "username": req.oidc.user.name,  
            "teams": []};
        res.locals.res_key = await datastore.save({
            "key":key, 
            "data":new_user});
        console.log(res_key);
        next();
    },

    new_user_check: async function (req, res, next) {
        const query = datastore.createQuery(USERS).filter('name', '=', req.oidc.user.sub);
        const user = await datastore.runQuery(query);
        console.log(user);
        
        if(typeof user[0] === 'undefined'){
            res.locals.isNewUser = true;
        } else {
            res.locals.isNewUser = false;
        }
        next();
    } 
}
