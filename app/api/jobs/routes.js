import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("neighborhood-services"); // database name

    
    const collections = await db.collections();
    const collectionNames = collections.map(c => c.collectionName);

    res.status(200).json({ collections: collectionNames });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database connection failed" });
  }
}