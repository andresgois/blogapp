// Carregando modulos
    const express = require('express');
    const app = express();
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser');
    const admin = require('./routes/admin');
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    require('./models/Postagem');
    const Postagem = mongoose.model("postagens");
    require('./models/Categoria');
    const Categoria = mongoose.model("categorias");
    const usuarios = require("./routes/usuario");
    const passport = require("passport");
    require("./config/auth")(passport)
    const db = require("./config/db")

// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        })); //- serve para criação e configuração de middleware
        // Middleware de autenticação
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");// cria variaveis globais
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error");
            res.locals.user = req.user || null;
            next();
        });
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine','handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoUri , {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then( () =>{
            console.log("Conectado ao mongo");
        }).catch( (err) => {
            console.log("Erro ao Conectar: "+err);
        });
    // Public
        app.use(express.static(path.join(__dirname,'public')));

    // MIDDLEWARE   
    // app.use( (req, tes, next) => {
    //     console.log("middleware");
    //     next();
    // })

// Rotas
app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404");
    })
})

// rota (Leia mais) da página Home
app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {

        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Essa postagem não existe")
            res.redirect("/");
        }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/");
    })
})

// link em categorias, para pesquisar todos os posts com aquele tipo de categoria
app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {

        if(categoria){
            
            Postagem.find({categoria: categoria._id}).lean().then( (postagens) => {
                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao lista os posts!")
                res.redirect("/");
            })

        }else{
            req.flash("error_msg", "Essa categoria não existe")
            res.redirect("/");
        }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao carregar a página deste categoria")
        res.redirect("/");
    })
})

app.get("/404", (req, res) => {
    res.send("<h2>Erro 404!</h2>")
});

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then( (categorias) => {
        res.render("categorias/index", {categorias: categorias});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/");
    })
});

app.use('/admin', admin);
app.use('/usuarios', usuarios);

// Outros - para heroku->process.env.PORT (pega porta especifica da heroku)
const PORT = process.env.PORT || 8081;
app.listen(PORT,() => {
    console.log('Servidor rodando!');
})