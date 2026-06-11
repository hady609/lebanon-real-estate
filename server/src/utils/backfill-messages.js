import mongoose from 'mongoose';
import { config } from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const inquiries = await mongoose.connection.db.collection('inquiries').find({}).toArray();
  let count = 0;
  for (const inq of inquiries) {
    if (!inq.messages || inq.messages.length === 0) {
      await mongoose.connection.db.collection('inquiries').updateOne(
        { _id: inq._id },
        { $set: { messages: [{
          sender: inq.sender || null,
          senderName: inq.name,
          senderEmail: inq.email,
          text: inq.message,
          isFromAgent: false,
          createdAt: inq.createdAt || new Date(),
          updatedAt: inq.createdAt || new Date(),
        }]}}
      );
      count++;
    }
  }
  console.log(`Updated ${count} inquiries with messages array`);
  process.exit(0);
};
run().catch(e => { console.error(e); process.exit(1); });
