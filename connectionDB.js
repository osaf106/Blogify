const mongooes = require('mongoose')

async function connectionMongodb(url){
    return mongooes.connect(url)
}

module.exports={
    connectionMongodb
}