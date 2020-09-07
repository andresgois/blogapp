//mongodb+srv://andregois:<password>@blogapp-prod.kwfgn.mongodb.net/<dbname>?retryWrites=true&w=majority

if(process.env.NODE_ENV == "production"){
    module.exports = {mongoUri: "mongodb+srv://deploy:05042010apbA*a@blogapp-prod.kwfgn.mongodb.net/blogapp-prod?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoUri: "mongodb://localhost/blogapp"}
}