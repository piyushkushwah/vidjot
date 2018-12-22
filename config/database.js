if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://piyush:piyush123@ds141704.mlab.com:41704/vidjot-prod'}
}else{
    module.exports = {mongoURI:'mongodb://localhost:27017/vidjot-dev'}
}