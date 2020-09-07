//mongodb+srv://andregois:<password>@blogapp-prod.kwfgn.mongodb.net/<dbname>?retryWrites=true&w=majority

if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://andregois:05042010@blogapp-prod.kwfgn.mongodb.net/blogapp-prod?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoUri: "mongodb://localhost/blogapp"}
}