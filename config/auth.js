const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Model usuário
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email,senha,done) => {

        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario){ // dados  da conta, sucesso na autenticação, mensagem de erro
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))
    // salva os dados de usuários em uma sessão
    passport.serializeUser( (usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser( (id, done) => {
        // procura o usuário pelo seu id
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })

}