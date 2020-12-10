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
}