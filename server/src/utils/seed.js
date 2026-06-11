import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';

const cities = ['Beirut','Tripoli','Sidon','Tyre','Jounieh','Zahle','Baalbeck','Byblos','Aley','Batroun','Nabatieh','Broummana','Bikfaya','Jbeil','Ferzol'];
const govs = ['Beirut','Mount Lebanon','North','South','Bekaa','Nabatieh','Baalbek-Hermel'];
const types = ['apartment','villa','house','penthouse','duplex','studio','land','commercial','office','building','townhouse','chalet'];
const amenities = ['parking','garden','pool','gym','elevator','ac','heating','security','generator','waterTank','solarPanels','storage','roof','balcony'];

const lebaneseNames = {
  first: ['Hassan','Ali','Mohammad','Ahmad','Omar','Khaled','Hussein','Mahmoud','Bilal','Karim','Layla','Nour','Sara','Dana','Rana','Maya','Hiba','Lina','Rola','Amal'],
  last: ['Haidar','Khalil','Harb','Jaafar','Moussa','Husseini','Fakhoury','Safieddine','Haddad','Khoury','Maalouf','Gemayel','Abi-Rached','Helou','Boustany','Rizk','Tabet','Fares','Hatem','Sabra'],
  streets: ['Rue Gouraud','Hamra Street','Mar Mikhael','Verdun','Ras Beirut','Corniche','Bliss Street','Monot','Saifi Village','Ashrafieh','Badaro','Downtown','Achrafieh','Gemmayze','Mina El Hosn']
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Promise.all([User.deleteMany({}), Property.deleteMany({}), Inquiry.deleteMany({})]);
    const admin = await User.create({ firstName: 'Admin', lastName: 'User', email: 'admin@lere.com', password: 'admin12345', role: 'admin', phone: '+9613123456', isVerified: true });
    const agents = [];
    for (let i = 0; i < 5; i++) {
      const a = await User.create({
        firstName: lebaneseNames.first[i], lastName: lebaneseNames.last[i], email: `agent${i+1}@lere.com`, password: 'agent12345', role: 'agent', phone: `+9613${String(1000000 + i).slice(0,6)}`, isVerified: true,
        agency: { name: `${lebaneseNames.last[i]} Realty`, licenseNumber: `LIC-${1000+i}`, address: `${lebaneseNames.streets[i % lebaneseNames.streets.length]}, ${cities[i]}` }
      });
      agents.push(a);
    }
    const buyer = await User.create({ firstName: 'Test', lastName: 'Buyer', email: 'buyer@lere.com', password: 'buyer12345', role: 'buyer', phone: '+9617123456', isVerified: true });
    const properties = [];
    for (let i = 0; i < 30; i++) {
      const city = cities[i % cities.length];
      const type = types[i % types.length];
      const isLand = type === 'land';
      const price = type === 'land' ? (Math.floor(Math.random() * 500) + 50) * 1000 : (Math.floor(Math.random() * 800) + 80) * 1000;
      const bedrooms = isLand ? 0 : Math.floor(Math.random() * 5) + 1;
      const bathrooms = isLand ? 0 : Math.min(bedrooms + Math.floor(Math.random() * 2), 5);
      const agent = agents[i % agents.length];
      const prop = await Property.create({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} in ${city} - ${['Modern','Spacious','Luxury','Cozy','Elegant','Premium','Charming','Beautiful','Stylish','Contemporary'][i % 10]}`,
        description: `Beautiful ${type} located in the heart of ${city}. This property offers ${bedrooms || 'N/A'} bedrooms, ${bathrooms || 'N/A'} bathrooms with stunning views. Perfect for families looking for quality living in Lebanon. Close to schools, hospitals, and shopping centers.`,
        price, currency: 'USD', purpose: i % 3 === 0 ? 'rent' : 'sale', type,
        bedrooms, bathrooms,
        floorArea: isLand ? 0 : Math.floor(Math.random() * 300) + 80,
        landArea: isLand ? Math.floor(Math.random() * 1000) + 200 : 0,
        floors: type === 'villa' || type === 'house' ? Math.floor(Math.random() * 2) + 1 : 1,
        furnished: Math.random() > 0.5,
        amenities: [amenities[Math.floor(Math.random() * amenities.length)], amenities[Math.floor(Math.random() * amenities.length)]].filter(Boolean),
        location: {
          street: lebaneseNames.streets[Math.floor(Math.random() * lebaneseNames.streets.length)],
          district: city,
          city, governorate: govs[i % govs.length],
          coordinates: { lat: 33.8 + Math.random() * 0.6, lng: 35.4 + Math.random() * 0.4 }
        },
        images: [{ public_id: `sample_${i}`, url: `https://images.unsplash.com/photo-${[1564013799919-ab600027ffc6,1600596542815-ffad4c1539a9,1600607687939-ce8a2c2516c1,1600566753376-12c8ab7d5a7b,1600573472550-8090b5e0745e,1600046751808-6e5e1a5b7a5c,1600585154340-be6161a56a0c,1600595954664-2e0d8f6a6a8c,1600566753190-17f0baa2a6c3,1600585153490-3b2e5b7c9d8f][i % 10]})?w=800&q=80`, isPrimary: true }],
        owner: agent._id,
        contactInfo: { name: `${agent.firstName} ${agent.lastName}`, phone: agent.phone, email: agent.email },
        featured: i < 6, approved: true, isActive: true,
      });
      properties.push(prop);
    }
    console.log(`Seeded: ${await User.countDocuments()} users, ${await Property.countDocuments()} properties`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}
seed();
