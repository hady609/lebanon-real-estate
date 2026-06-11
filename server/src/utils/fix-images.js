import mongoose from 'mongoose';
import { config } from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
config();

const knownGood = [
  '1564013799919-ab600027ffc6',
  '1600585154340-be6161a56a0c',
  '1600573472550-8090b5e0745e',
  '1600596542815-ffad4c1539a9',
  '1512917774080-9991f1c4c750',
];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const props = await mongoose.connection.db.collection('properties').find({}).toArray();
  let count = 0;
  for (const p of props) {
    const newImages = [0, 1, 2].map(i => ({
      public_id: `prop_${count}_${i}`,
      url: `https://images.unsplash.com/photo-${knownGood[(count + i) % knownGood.length]}?w=800&q=80`,
      isPrimary: i === 0,
    }));
    await mongoose.connection.db.collection('properties').updateOne(
      { _id: p._id },
      { $set: { images: newImages } }
    );
    count++;
  }
  console.log(`Updated ${count} properties with verified images`);
  process.exit(0);
};
run().catch(e => { console.error(e); process.exit(1); });
