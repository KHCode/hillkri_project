const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const USERS = "users";

module.exports = {

    get_users: async function (req, res, next) {
        const query = datastore.createQuery(USERS);
        const [users] = await datastore.runQuery(query);
        res.locals.users = users;
        next();
    },

    get_a_user: async function (req, res, next) {
        const key = datastore.key([USERS, parseInt(req.params.user_id,10)]);
        res.locals.user = await datastore.get(key);
        next();
    },

    post_user: async function (req, res, next) {
        console.log(req.body.name);
        console.log(req.body.username);
        var key = datastore.key([USERS, req.body.name]);
        const new_user = {
            "username": req.body.username,  
            "teams": []};
        res.locals.res_key = await datastore.save({
            "key":key, 
            "data":new_user});
        console.log(res.locals.res_key);
        res.locals.isPost = true;
        next();
    },

    build_user: function (req, res, next) {
        if(res.locals.isPost){
            res.locals.newUser = {
                "name": req.body.name,
                "username": req.body.username,
                "teams": []
            };
        }
        next();
    },

    new_user_check: async function (req, res, next) {
        const query = datastore.createQuery(USERS).filter('name', '=', req.oidc.user.sub);
        const user = await datastore.runQuery(query);
                
        if(user[0].length < 1){
            res.locals.isNewUser = true;
        } else {
            res.locals.isNewUser = false;
        }
        next();
    } 
}
