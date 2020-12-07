const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const INSTS = 'insts';

module.exports =  {
    
    post_inst: async function (req, res, next) {
        let key = datastore.key(INSTS);
        const new_inst = {
            "name": req.body.name,
            "year_est": req.body.year_est,
            "type": req.body.type,
            "focus": req.body.focus,
            "actual_members": [],
        }
        let res_key = await datastore.save({
            "key": key,
            "data": new_inst
        });
        res.locals.instId = res_key[0].mutationResults[0].key.path[0].id;

        next();
    },
    
    get_insts: async function (req, res, next) {
        const query = datastore.createQuery(INSTS);
        const [insts] = await datastore.runQuery(query);
        res.locals.insts = insts;
        for(let i = 0; i < insts.length; i++) {
            res.locals.insts[i].id = insts[i][Datastore.KEY].id;
            res.locals.insts[i].self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + insts[i][Datastore.KEY].id;
        }
        next();
    },
    
    get_an_inst: async function (req, res, next) {
        req.params.inst_id ? instId = req.params.inst_id : instId = res.locals.instId;
        const key = datastore.key([INSTS, parseInt(instId,10)]);
        let inst = await datastore.get(key);
        res.locals.inst = inst[0];
        res.locals.inst.id = instId;
        res.locals.inst.self = req.protocol + "://" + req.get('host') + req.baseUrl + "/" + instId;
        next();
    },
    
    edit_an_inst: async function (req, res, next) {
        const key = datastore.key([INSTS, parseInt(req.params.inst_id,10)]);
        let inst = {name: "", year_est: 0, type: [], focus: [], actual_members: []};
        req.body.name ? inst.name = req.body.name : inst.name = res.locals.inst.name;
        req.body.year_est ? inst.year_est = req.body.year_est : inst.year_est = res.locals.inst.year_est;
        req.body.type && (req.body.type.length > 0) ? inst.type = req.body.type : inst.type = res.locals.inst.type;
        req.body.focus && (req.body.focus.length > 0) ? inst.focus = req.body.focus : inst.focus = res.locals.inst.focus;
        res.locals.inst.actual_members && (res.locals.inst.actual_members.length > 0 ) ? inst.actual_members = res.locals.inst.actual_members: inst.actual_members = [];
        res.locals.edited_inst = inst;

        await datastore.save({"key":key, "data":res.locals.edited_inst});

        res.locals.edited_inst.id = res.locals.inst.id;
        res.locals.edited_inst.self = res.locals.inst.self;
        next();
    },

    join_pol_inst: async function (req, res, next) {
        res.locals.inst.actual_members.push(res.locals.pol.id);
        res.locals.pol.jobs.push(res.locals.inst.id);
        next();
    },

    remove_pol_from_insts: async function (req, res, next) {
        for(let i = 0; i < res.locals.insts.length; i++) {
            if(!res.locals.insts[i].actual_members){
                res.locals.insts[i].actual_members = [];
            }
            for(let j = 0; j < res.locals.insts[i].actual_members.length; j++) {
                if(res.locals.insts[i].actual_members[j] == req.params.pol_id) {
                    res.locals.insts[i].actual_members.splice(j, 1);
                    res.locals.inst = res.locals.insts[i];

                    const key = datastore.key([INSTS, parseInt(res.locals.inst.id,10)]);
                    if(res.locals.inst.hasOwnProperty('id')) { delete res.locals.inst['id']; }
                    if(res.locals.inst.hasOwnProperty('self')) { delete res.locals.inst['self']; }
                    await datastore.save({"key":key, "data":res.locals.inst});
                }
            }
        }
    },

    delete_inst: async function (req, res, next) {
        const key = datastore.key([INSTS, parseInt(req.params.inst_id,10)]);
        await datastore.delete(key);
        next();
    },
}