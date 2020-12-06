const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const TEAMS = 'teams';

module.exports =  {
    
    post_team: async function (req, res, next) {
        let key = datastore.key(TEAMS);
        const new_team = {
            "name": req.body.name,
            "owner": req.user.sub,
            "members": [],
            "public": false,
            "date_created": new Date()
        }
        let res_key = await datastore.save({
            "key": key,
            "data": new_team
        });
        res.locals.teamId = res_key[0].mutationResults[0].key.path[0].id;
        
        next();
    },
    
    get_teams: async function (req, res, next) {
        const query = datastore.createQuery(TEAMS).filter('owner', '=', res.locals.userId);
        const [teams] = await datastore.runQuery(query);
        res.locals.teams = teams;
        for(let i = 0; i < teams.length; i++) {
            res.locals.teams[i].id = teams[i][Datastore.KEY].id;
            res.locals.teams[i].self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + teams[i][Datastore.KEY].id;
        }
        next();
    },
    
    get_a_team: async function (req, res, next) {
        req.params.team_id ? teamId = req.params.team_id : teamId = res.locals.teamId;
        const key = datastore.key([TEAMS, parseInt(teamId,10)]);
        let team = await datastore.get(key);
        res.locals.team = team[0];
        res.locals.team.id = teamId;
        res.locals.team.self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + teamId;
        next();
    },

    edit_a_team: async function (req, res, next) {
        const key = datastore.key([TEAMS, parseInt(req.params.team_id,10)]);
        let team = {name: "", owner: "", members: [], public: false};

        req.body.name ? team.name = req.body.name : team.name = res.locals.team.name;
        req.body.public ? team.public = req.body.public : team.public = res.locals.team.public;
        res.locals.team.members && (res.locals.team.members.length > 0 ) ? team.members = res.locals.team.members: team.members = [];
        team.owner = res.locals.team.owner;
        res.locals.edited_team = team;

        await datastore.save({"key":key, "data":res.locals.edited_team});

        res.locals.edited_team.id = res.locals.team.id;
        res.locals.edited_team.self = res.locals.team.self;
        next();
    },
    
    patch_a_team: async function (req, res, next) {
        
    },
    
    put_a_team: async function (req, res, next) {
    
    },

    delete_team: async function (req, res, next) {

    },
}

