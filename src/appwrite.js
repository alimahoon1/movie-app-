import {Client, Databases, ID, Query,} from 'appwrite'
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

//to get access to appwrite's functionalities define a new client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);


export const updateSearchCount = async (searchTerm,movie) => {
    //1. use appwrite sdk to check if the search term exists in the DB
    try {
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])

        //2. if it does then update the count
        if(result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
                count: doc.count+1,
            })
        }
        //3. if it doest, create a new document with the search term and set count as 1
        else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    }catch(error) {
        console.log(error)
    }




}