const createError = require('http-errors');

module.exports = {
    check_sub: function (req, res, next) {
        if (res.locals.team.owner) {
            if(req.user.sub != res.locals.team.owner) {
                var error = new createError.Forbidden('Forbidden, you do not have access to that');
                next(error);
            }
        } else if (res.locals.user.id) {
            if (req.user.sub != res.locals.user.id) {
                var error = new createError.Forbidden('Forbidden, you do not have access to that');
                next(error);
            }
        }
        next();
    },

    check_accepts: function (req, res, next) {
        if(req.accepts('application/json') == false) {
            var error = new createError.NotAcceptable('Cannot send back response in that MIME type');
            next(error);
        }
        next();
    },

    has_required_params: function (req, res, next) {
        console.dir(req.path);
        if(!req.body.name || req.body.name == '') {
            var error = new createError.BadRequest('Missing required attributes')
            next(error);
        }
        next();
    },

    check_for_duplicate_name: function (req, res, next) {
        for(let i = 0; i < res.locals.teams.length; i++) {
            if(res.locals.teams[i].name == req.body.name) {
                var error = new createError.Forbidden('Cannot Have Duplicate Names');
                next(error);
            }
        }
        next();
    },

    check_media_type: function (req, res, next) {
        if(req.get('content-type') !== 'application/json'){
            var error = new createError.UnsupportedMediaType('Unsupported Media Type');
            next(error);
        }
        next();
    }
 }