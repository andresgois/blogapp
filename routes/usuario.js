// Carregando modulos
const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
require("../models/Usuario");
// Nome da tabela
const Usuario = mongoose.model("usuarios");
const bcryptjs = require("bcryptjs");
const passport = require("passport")


router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var errors = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errors.push({texto: "Nome inválido"});
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({texto: "Email inválido"});
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        errors.push({texto: "Senha inválido"});
    }

    if(req.body.senha.length < 4){
        errors.push({texto: "Senha muito curta"});
    }

    if(req.body.senha != req.body.senha2){
        errors.push({texto: "As senha são diferentes"});
    }

    if(errors.length > 0){
        res.render("usuarios/registro", {errors: errors})
    }else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg","Já existe uma conta com esse e-mail no nosso sistema")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })    
                // salt -> valor aleatório para misturar com o hash
                bcryptjs.genSalt(10, (erro, salt) => {
                    bcryptjs.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg","Houve um erro durante o salvamento do usuário");
                            res.redirect("/");
                        }

                        novoUsuario.senha = hash
                        console.log(novoUsuario);

                        novoUsuario.save().then( () => {
                            req.flash("success_msg","Usuário criado com sucesso");
                            res.redirect("/");
                        }).catch((erro) => {
                            req.flash("error_msg","Houve um erro ao criar usuário");
                            res.redirect("/usuarios/registro");
                        })
                    })
                })

            }
        }).catch( (err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg","Deslogado com sucesso")
    res.redirect("/")
})

module.exports = router