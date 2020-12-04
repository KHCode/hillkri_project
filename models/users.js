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
        if(res.locals.isNewUser) {
            var key = datastore.key([USERS, req.oidc.user.sub]);
            const new_user = {
                "username": req.oidc.user.name,  
                "teams": []};
            res.locals.res_key = await datastore.save({
                "key":key, 
                "data":new_user});
            res.locals.isPost = true;
        }
        next();
    },

    build_a_user: function (req, res, next) {
        if(res.locals.isPost){
            res.locals.newUser = {
                "name": req.body.name,
                "username": req.body.username,
                "teams": []
            };
        }
        next();
    },

    build_users: function (req, res, next) {
        res.locals.users_res = res.locals.users.map((user) => {
            const name = user[Datastore.KEY].name;
            const username = user.username;
            const teams = user.teams;
            const self = req.protocol + "://" + req.get('host') + req.baseUrl + '/users/' + name;
            return {name, username, teams, self};
        });
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
    },
}
