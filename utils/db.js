exports.utilsDB = async function (client) {
    try {
        await client.connect()
  
        const database = client.db('Accounts')
  
        const collection = database.collection('Boeken')
  
        // Stopt de data uit mijn database in een Array
        return collection.find().toArray()
  
        // Error, als de database niet doet
    } catch (err) {
        console.log(err)
    }
  
  }
  