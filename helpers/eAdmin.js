// Arquivo de pequenas funções auxiliares

// fução que verificará se o usuário está autenticado
module.exports = {
    eAdmin: function(req, res, next){
        // método do passport
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }

        req.flash("error_msg", "Você precisa ser admin")
        res.redirect("/")
    }
}