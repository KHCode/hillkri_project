module.exports = {
    check_sub: function (req, res, next) {
        if (res.locals.team.owner && (req.user.sub != res.locals.team.owner)) {
            var error = new createError.Forbidden('Forbidden, you do not have access to that');
            next(error);
        } else if (res.locals.user.id && (req.user.sub != res.locals.user.id)) {
            var error = new createError.Forbidden('Forbidden, you do not have access to that');
            next(error);
        }
        next();
    }
}