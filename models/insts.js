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
        res.locals.res_key = await datastore.save({
            "key": key,
            "data": new_inst
        });
        next();
    },
    
    get_insts: async function (req, res, next) {
        const query = datastore.createQuery(INSTS);
        const [insts] = await datastore.runQuery(query);
        res.locals.insts = insts;
        next();
    },
    
    get_a_inst: async function (req, res, next) {
        const key = datastore.key([INSTS, parseInt(req.params.inst_id,10)]);
        res.locals.inst = await datastore.get(key);
        next();
    },
    
    patch_a_inst: async function (req, res, next) {
        
    },
    
    put_a_inst: async function (req, res, next) {
    
    },

    delete_inst: async function (req, res, next) {

    },
}