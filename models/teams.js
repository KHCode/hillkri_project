const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const TEAMS = 'teams';

module.exports =  {
    
    post_team: async function (req, res, next) {
        let key = datastore.key(TEAMS);
        const new_team = {
            "name": req.body.name,
            "owner": req.oidc.user.sub,
            "members": [],
            "public": false,
            "date_created": new Date()
        }
        res.locals.res_key = await datastore.save({
            "key": key,
            "data": new_team
        });
        next();
    },
    
    get_teams: async function (req, res, next) {
        console.log('GET teams route db function');
        next();
    },
    
    get_a_team: async function (req, res, next) {
        const key = datastore.key([TEAMS, parseInt(req.params.team_id,10)]);
        res.locals.team = await datastore.get(key);
        next();
    },
    
    patch_a_team: async function (req, res, next) {
        
    },
    
    put_a_team: async function (req, res, next) {
    
    },

    delete_team: async function (req, res, next) {

    },
}

