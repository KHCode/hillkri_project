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
            "real_team": []
        }
        res.locals.res_key = await datastore.save({
            "key": key,
            "data": new_pol
        });
        next();
    },
    
    get_pols: async function (req, res, next) {
        const query = datastore.createQuery(POLS);
        const [pols] = await datastore.runQuery(query);
        res.locals.pols = pols;
        next();
    },
    
    get_a_pol: async function (req, res, next) {
        const key = datastore.key([POLS, parseInt(req.params.pol_id,10)]);
        res.locals.pol = await datastore.get(key);
        next();
    },
    
    patch_a_pol: async function (req, res, next) {
        
    },
    
    put_a_pol: async function (req, res, next) {
    
    },

    delete_pol: async function (req, res, next) {

    },
}