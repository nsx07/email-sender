import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoURL } from "../environment/environment.js"

export class MongoService {

    static client = new MongoClient(mongoURL, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

    constructor() {
        console.log("MongoService ON");
    }

    static async run() {
        try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();
          // Send a ping to confirm a successful connection
          await client.db("subscriptions").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
    
    static async getSubscribers() {
        try {
            await this.client.connect();
            return await this.client.db("subscriptions").collection("subscriptions").find().toArray();
        } catch (error) {
            console.error("Erro ao buscar inscritos", error);
        } finally {
            await this.client.close();
        }
    }
    static async set() {}

}