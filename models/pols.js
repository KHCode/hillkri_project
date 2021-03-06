const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const POLS = 'pols';

module.exports =  {
    
    post_pol: async function (req, res, next) {
        let key = datastore.key(POLS);
        const new_pol = {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "institutions": [],
            "party": req.body.party,
            "net_worth": req.body.net_worth,
            "expertise": req.body.expertise,
            "advocate_for": req.body.advocate_for,
            "actual_team": [],
            "jobs": []
        }
        let res_key = await datastore.save({
            "key": key,
            "data": new_pol
        });
        res.locals.polId = res_key[0].mutationResults[0].key.path[0].id;

        next();
    },
    
    get_pols: async function (req, res, next) {
        const query = datastore.createQuery(POLS);
        const [pols] = await datastore.runQuery(query);
        res.locals.pols = pols;
        for(let i = 0; i < pols.length; i++) {
            res.locals.pols[i].id = pols[i][Datastore.KEY].id;
            res.locals.pols[i].self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + pols[i][Datastore.KEY].id;
        }
        next();
    },
    
    get_a_pol: async function (req, res, next) {
        req.params.pol_id ? polId = req.params.pol_id : polId = res.locals.polId;
        const key = datastore.key([POLS, parseInt(polId,10)]);
        let pol = await datastore.get(key);
        res.locals.pol = pol[0];
        res.locals.pol.id = polId;
        res.locals.pol.self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + polId;
        next();
    },

    edit_a_pol: async function (req, res, next) {
        const key = datastore.key([POLS, parseInt(req.params.pol_id,10)]);
        let pol = {first_name: "", last_name: "", net_worth: 0, party: [], expertise: [], advocate_for: [], jobs: [], actual_team: []};

        req.body.first_name ? pol.first_name = req.body.first_name : pol.first_name = res.locals.pol.first_name;
        req.body.last_name ? pol.last_name = req.body.last_name : pol.last_name = res.locals.pol.last_name;
        req.body.net_worth ? pol.net_worth = req.body.net_worth : pol.net_worth = res.locals.pol.net_worth;
        req.body.party && (req.body.party.length > 0) ? pol.party = req.body.party : pol.party = res.locals.pol.party;
        req.body.expertise && (req.body.expertise.length > 0) ? pol.expertise = req.body.expertise : pol.expertise = res.locals.pol.expertise;
        req.body.advocate_for && (req.body.advocate_for.length > 0) ? pol.advocate_for = req.body.advocate_for : pol.advocate_for = res.locals.pol.advocate_for;
        res.locals.pol.jobs && (res.locals.pol.jobs.length > 0 ) ? pol.jobs = res.locals.pol.jobs: pol.jobs = [];
        res.locals.pol.actual_team && (res.locals.pol.actual_team.length > 0 ) ? pol.actual_team = res.locals.pol.actual_team: pol.actual_team = [];
        res.locals.edited_pol = pol;

        await datastore.save({"key":key, "data":res.locals.edited_pol});

        res.locals.edited_pol.id = res.locals.pol.id;
        res.locals.edited_pol.self = res.locals.pol.self;
        next();
    },
    
    get_a_member: async function (req, res, next) {
        const key = datastore.key([POLS, parseInt(req.params.member_id,10)]);
        let member = await datastore.get(key);
        res.locals.member = member[0];
        res.locals.member.id = req.params.member_id;
        res.locals.member.self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + req.params.member_id;
        next();
    },
    
    join_actual_team: async function (req, res, next) {
        res.locals.pol.actual_team.push(res.locals.member.id);
        res.locals.member.actual_team.push(res.locals.pol.id);
        next();
    },

    edit_a_member: async function (req, res, next) {
        const key = datastore.key([POLS, parseInt(res.locals.member.id,10)]);
        let pol = {
            first_name: res.locals.member.first_name, 
            last_name: res.locals.member.last_name, 
            net_worth: res.locals.member.net_worth, 
            party: res.locals.member.party, 
            expertise: res.locals.member.expertise, 
            advocate_for: res.locals.member.advocate_for, 
            jobs: res.locals.member.jobs, 
            actual_team: res.locals.member.actual_team
        };
        await datastore.save({"key":key, "data":pol});
        next();
    },

    remove_inst_from_pols: async function (req, res, next) {
        for(let i = 0; i < res.locals.pols.length; i++) {
            if(!res.locals.pols[i].jobs) {
                res.locals.pols[i].jobs = [];
            }
            for(let j = 0; j < res.locals.pols[i].jobs.length; j++) {
                if(res.locals.pols[i].jobs[j] == req.params.inst_id) {
                    res.locals.pols[i].jobs.splice(j, 1);
                    res.locals.pol = res.locals.pols[i];
                    console.log("****remove_inst_from_pols****");
                    console.log(res.locals.pol.id);
                    const key = datastore.key([POLS, parseInt(res.locals.pol.id,10)]);
                    if(res.locals.pol.hasOwnProperty('id')) { delete res.locals.pol['id']; }
                    if(res.locals.pol.hasOwnProperty('self')) { delete res.locals.pol['self']; }
                    console.log(res.locals.pol);
                    await datastore.save({"key":key, "data":res.locals.pol});
                }
            }
        }
        next();
    },

    remove_pol_from_pols: async function (req, res, next) {
        for(let i = 0; i < res.locals.pols.length; i++) {
            if(!res.locals.pols[i].actual_team) {
                res.locals.pols[i].actual_team = [];
            }
            for(let j = 0; j < res.locals.pols[i].actual_team.length; j++) {
                if(res.locals.pols[i].actual_team[j] == req.params.pol_id) {
                    res.locals.pols[i].actual_team.splice(j, 1);
                    res.locals.pol = res.locals.pols[i];
                    console.log("****remove_pol_from_pols****");
                    console.log(res.locals.pol.id);
                    const key = datastore.key([POLS, parseInt(res.locals.pol.id,10)]);
                    if(res.locals.pol.hasOwnProperty('id')) { delete res.locals.pol['id']; }
                    if(res.locals.pol.hasOwnProperty('self')) { delete res.locals.pol['self']; }
                    console.log(res.locals.pol);
                    await datastore.save({"key":key, "data":res.locals.pol});
                }
            }
        }
        next();
    },

    remove_inst_from_a_pol: async function (req, res, next) {
        for(let j = 0; j < res.locals.pol.jobs.length; j++) {
            if(res.locals.pol.jobs[j] == req.params.inst_id) {
                res.locals.pol.jobs.splice(j, 1);
                // console.log("****remove_inst_from_pols****");
                // console.log(res.locals.pol.id);
                const key = datastore.key([POLS, parseInt(res.locals.pol.id,10)]);
                if(res.locals.pol.hasOwnProperty('id')) { delete res.locals.pol['id']; }
                if(res.locals.pol.hasOwnProperty('self')) { delete res.locals.pol['self']; }
                // console.log(res.locals.pol);
                await datastore.save({"key":key, "data":res.locals.pol});
            }
        }
        next();
    },

    remove_pol_from_a_pol: async function (req, res, next) {
        for(let j = 0; j < res.locals.pol.actual_team.length; j++) {
            if(res.locals.pol.actual_team[j] == req.params.member_id) {
                res.locals.pol.actual_team.splice(j, 1);
                // console.log("****remove_pol_from_pols****");
                // console.log(res.locals.pol.id);
                const key = datastore.key([POLS, parseInt(res.locals.pol.id,10)]);
                if(res.locals.pol.hasOwnProperty('id')) { delete res.locals.pol['id']; }
                if(res.locals.pol.hasOwnProperty('self')) { delete res.locals.pol['self']; }
                // console.log(res.locals.pol);
                await datastore.save({"key":key, "data":res.locals.pol});
            }
        }
        next();
    },

    remove_member_from_a_pol: async function (req, res, next) {
        for(let j = 0; j < res.locals.member.actual_team.length; j++) {
            if(res.locals.member.actual_team[j] == req.params.pol_id) {
                res.locals.member.actual_team.splice(j, 1);
                // console.log("****remove_pol_from_pols****");
                // console.log(res.locals.pol.id);
                const key = datastore.key([POLS, parseInt(res.locals.member.id,10)]);
                if(res.locals.member.hasOwnProperty('id')) { delete res.locals.member['id']; }
                if(res.locals.member.hasOwnProperty('self')) { delete res.locals.member['self']; }
                // console.log(res.locals.member);
                await datastore.save({"key":key, "data":res.locals.member});
            }
        }
        next();
    },

    delete_pol: async function (req, res, next) {
        console.log("****delete_pol****");
        console.log(req.params.pol_id);
        const key = datastore.key([POLS, parseInt(req.params.pol_id,10)]);
        await datastore.delete(key);
        next();
    },
}