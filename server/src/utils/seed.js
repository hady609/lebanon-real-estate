import mongoose from 'mongoose';
import { config } from 'dotenv';
import dns from 'dns';
import bcrypt from 'bcryptjs';
dns.setServers(['8.8.8.8', '8.8.4.4']);
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

const lebanesePhones = [
  '+961 3 123456','+961 3 789012','+961 3 456789','+961 3 234567','+961 3 890123',
  '+961 70 123456','+961 70 789012','+961 71 456789','+961 71 234567','+961 76 890123',
  '+961 81 123456','+961 81 789012','+961 03 456789','+961 03 234567','+961 76 123456'
];

const imageIds = [
  '1564013799919-ab600027ffc6','1600585154340-be6161a56a0c','1600573472550-8090b5e0745e','1600596542815-ffad4c1539a9','1512917774080-9991f1c4c750',
  '1564013799919-ab600027ffc6','1600585154340-be6161a56a0c','1600573472550-8090b5e0745e','1600596542815-ffad4c1539a9','1512917774080-9991f1c4c750',
  '1564013799919-ab600027ffc6','1600585154340-be6161a56a0c','1600573472550-8090b5e0745e','1600596542815-ffad4c1539a9','1512917774080-9991f1c4c750',
  '1564013799919-ab600027ffc6','1600585154340-be6161a56a0c','1600573472550-8090b5e0745e','1600596542815-ffad4c1539a9','1512917774080-9991f1c4c750',
];

const descriptions = {
  apartment: [
    'Modern apartment in the heart of Beirut with stunning sea views. Features open-plan living, floor-to-ceiling windows, and a spacious balcony. Walking distance to restaurants, cafes, and shopping.',
    'Elegant fully-furnished apartment in a premium building with 24/7 security and generator. Close to ABC Mall and major hospitals. Ideal for families or professionals.',
    'Recently renovated apartment with high ceilings and traditional Lebanese architecture. Located in a quiet street near all amenities. Includes parking space and storage room.',
  ],
  villa: [
    'Luxurious villa with private pool and large garden in the mountains of Broummana. Panoramic views of the valley. Features 5 bedrooms, maids room, and rooftop terrace.',
    'Stunning Mediterranean villa with direct sea access in Jounieh. Modern design with infinity pool, outdoor kitchen, and landscaped gardens. Perfect for entertaining.',
    'Traditional stone villa restored to modern standards in Batroun. Original arches and wooden ceilings combined with contemporary finishes. Walking distance to the old souk.',
  ],
  house: [
    'Charming 3-bedroom house with garden in a quiet residential area. Recently renovated kitchen and bathrooms. Includes parking for 2 cars and a small backyard.',
    'Beautiful traditional Lebanese house with red tile roof and stone facade. Features a large terrace with mountain views. Ideal for those seeking authentic living.',
  ],
  penthouse: [
    'Exclusive penthouse with 360-degree views of Beirut and the Mediterranean. Private rooftop pool, outdoor jacuzzi, and panoramic terrace. State-of-the-art smart home system.',
    'Premium duplex penthouse in the heart of Achrafieh. Floor-to-ceiling windows, private elevator access, and a rooftop garden. 3 parking spaces included.',
  ],
  land: [
    'Prime building land in the heart of Dbayeh with city views. Perfect for residential or commercial development. All utilities available at the plot boundary.',
    'Agricultural land in the Bekaa valley with irrigation rights. Ideal for vineyards or organic farming. Stunning views of the surrounding mountains.',
    'Scenic plot in the mountains of Ehden with breathtaking views. Perfect for a summer retreat or chalet. Easy road access and nearby water source.',
  ],
  commercial: [
    'Prime commercial space on Hamra Street with high foot traffic. Open-plan layout with large display windows. Previously a restaurant with existing kitchen infrastructure.',
    'Modern office space in Beirut Central District with sea views. Fully fitted with meeting rooms, kitchenette, and 24/7 building access. Ideal for corporate headquarters.',
  ],
  office: [
    'Modern office space in a premium tower in Beirut Central District. Floor-to-ceiling windows with panoramic city views. 5 private offices plus open-plan area.',
    'Fully equipped office in Jounieh with parking. Ideal for a small to medium business. High-speed fiber internet and backup generator included.',
  ],
  studio: [
    'Cozy studio apartment perfect for students or young professionals. Open-plan layout with built-in kitchenette. Walking distance to AUB andABC Verdun.',
    'Modern studio with sea views in a premium building in Ramlet Al Baida. All bills included. Ideal for single occupancy. Fully furnished.',
  ],
  chalet: [
    'Beautiful mountain chalet in Faraya with ski-in/ski-out access. Stone fireplace, wooden interiors, and stunning valley views. Perfect winter getaway.',
    'Summer chalet in the mountains of Kfardebian with a large garden and pool access. Walking distance to restaurants and hiking trails.',
  ],
  townhouse: [
    'Elegant townhouse in a gated community in Jounieh. Three floors with private garden and rooftop terrace. Community pool and gym included.',
    'Modern townhouse in Rabieh with direct access to the highway. 4 bedrooms, maids room, and a large backyard. 24/7 security and maintained gardens.',
  ],
  duplex: [
    'Spacious duplex apartment in Sodeco with high ceilings and industrial-chic design. Mezzanine level with home office. Private terrace with city views.',
    'Luxury duplex in downtown Beirut with private elevator. Marble floors, floor-to-ceiling windows, and a stunning spiral staircase. 2 indoor parking spaces.',
  ],
  building: [
    ' Entire residential building in Gemmayze with 6 apartments. Each unit is 120m2 with balcony. Stable rental income. Ideal for investors.',
    ' Mixed-use building in Hamra with 3 commercial shops on ground floor and 4 apartments above. Prime location with steady rental yield.',
  ]
};

const titles = {
  apartment: ['Sleek Downtown Apartment','Modern Sea-View Apartment','Elegant Furnished Apartment','Spacious Family Apartment','Charming Garden Apartment'],
  villa: ['Luxury Mountain Villa','Mediterranean Sea-View Villa','Premium Modern Villa','Exclusive Beachfront Villa','Grand Estate Villa'],
  house: ['Charming Family Home','Traditional Lebanese House','Cozy Garden Home','Modern Town House','Renovated Heritage Home'],
  penthouse: ['Skyview Luxury Penthouse','Panoramic Duplex Penthouse','Premier Rooftop Penthouse','Ultra-Luxury Penthouse Suite'],
  land: ['Prime Development Land','Scenic Mountain Plot','Agricultural Farmland','Beachfront Building Plot','Investment Land Parcel'],
  commercial: ['Prime Hamra Storefront','Downtown Retail Space','High-Traffic Commercial Unit','Restaurant-Ready Space'],
  office: ['Grade-A Office Tower Suite','Modern Corporate Office','Executive Business Center','Creative Studio Office'],
  studio: ['Compact City Studio','Cozy Sea-View Studio','Modern Student Studio','Starter Home Studio'],
  chalet: ['Ski Chalet Faraya','Summer Mountain Retreat','Premium Chalet with View','Cozy Winter Cabin'],
  townhouse: ['Gated Community Townhouse','Modern Family Townhouse','Elegant Row House'],
  duplex: ['Industrial-Chic Duplex','Luxury Downtown Duplex','Spacious Split-Level Home'],
  building: ['Investment Apartment Building','Mixed-Use Commercial Building','High-Yield Residential Block'],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Property.deleteMany({});
    await Inquiry.deleteMany({});

    const hash = (pw) => bcrypt.hashSync(pw, 12);

    const admin = await User.findOneAndUpdate(
      { email: 'admin@lere.com' },
      { firstName: 'Admin', lastName: 'User', email: 'admin@lere.com', password: hash('admin12345'), role: 'admin', phone: '+961 3 111111', isVerified: true },
      { upsert: true, new: true }
    );
    console.log('Admin: admin@lere.com / admin12345');

    const agents = [];
    for (let i = 0; i < 8; i++) {
      const phone = lebanesePhones[i % lebanesePhones.length];
      const email = `agent${i+1}@lere.com`;
      const a = await User.findOneAndUpdate(
        { email },
        {
          firstName: lebaneseNames.first[i], lastName: lebaneseNames.last[i],
          email, password: hash('agent12345'), role: 'agent',
          phone, isVerified: true,
          agency: { name: `${lebaneseNames.last[i]} Properties`, licenseNumber: `LIC-${1000+i}`, address: `${lebaneseNames.streets[i % lebaneseNames.streets.length]}, ${cities[i]}` }
        },
        { upsert: true, new: true }
      );
      agents.push(a);
    }
    console.log('Agents: agent1@lere.com ... agent8@lere.com / agent12345');

    const buyer = await User.findOneAndUpdate(
      { email: 'buyer@lere.com' },
      { firstName: 'Test', lastName: 'Buyer', email: 'buyer@lere.com', password: hash('buyer12345'), role: 'buyer', phone: '+961 70 123456', isVerified: true },
      { upsert: true, new: true }
    );

    for (let i = 0; i < 40; i++) {
      const city = cities[i % cities.length];
      const type = types[i % types.length];
      const isLand = type === 'land';
      const typeTitles = titles[type] || ['Beautiful Property'];
      const typeDescs = descriptions[type] || ['Beautiful property with great location.'];

      const price = (() => {
        if (type === 'land') return (Math.floor(Math.random() * 800) + 50) * 1000;
        if (type === 'villa' || type === 'penthouse') return (Math.floor(Math.random() * 1500) + 300) * 1000;
        if (type === 'commercial' || type === 'building') return (Math.floor(Math.random() * 2000) + 200) * 1000;
        if (type === 'apartment' || type === 'duplex') return (Math.floor(Math.random() * 600) + 80) * 1000;
        return (Math.floor(Math.random() * 400) + 50) * 1000;
      })();

      const bedrooms = isLand ? 0 : [0,1,2,3,4,5,6][Math.floor(Math.random() * 6)];
      const bathrooms = isLand ? 0 : Math.min(bedrooms + Math.floor(Math.random() * 2), 5);
      const agent = agents[i % agents.length];
      const agentPhone = lebanesePhones[(i + 3) % lebanesePhones.length];

      const prop = await Property.create({
        title: typeTitles[i % typeTitles.length] + ' in ' + city,
        description: typeDescs[i % typeDescs.length],
        price, currency: 'USD',
        purpose: i % 3 === 0 ? 'rent' : 'sale',
        type,
        bedrooms, bathrooms,
        floorArea: isLand ? 0 : Math.floor(Math.random() * 400) + 60,
        landArea: isLand ? Math.floor(Math.random() * 1500) + 200 : 0,
        floors: ['villa','house','townhouse','building'].includes(type) ? Math.floor(Math.random() * 2) + 1 : 1,
        furnished: ['apartment','studio','penthouse','duplex'].includes(type) ? Math.random() > 0.3 : Math.random() > 0.7,
        amenities: [
          ...(Math.random() > 0.4 ? ['parking'] : []),
          ...(Math.random() > 0.5 ? ['balcony'] : []),
          ...(Math.random() > 0.6 ? ['generator'] : []),
          ...(Math.random() > 0.7 ? ['ac'] : []),
          ...(Math.random() > 0.8 ? ['security'] : []),
          ...(type === 'villa' || type === 'penthouse' ? ['pool','garden'] : []),
        ],
        location: {
          street: lebaneseNames.streets[Math.floor(Math.random() * lebaneseNames.streets.length)],
          district: city,
          city, governorate: govs[i % govs.length],
          coordinates: { lat: 33.82 + Math.random() * 0.5, lng: 35.45 + Math.random() * 0.4 }
        },
        images: [
          { public_id: `prop_${i}_1`, url: `https://images.unsplash.com/photo-${imageIds[i % imageIds.length]}?w=800&q=80`, isPrimary: true },
          { public_id: `prop_${i}_2`, url: `https://images.unsplash.com/photo-${imageIds[(i + 3) % imageIds.length]}?w=800&q=80`, isPrimary: false },
          { public_id: `prop_${i}_3`, url: `https://images.unsplash.com/photo-${imageIds[(i + 7) % imageIds.length]}?w=800&q=80`, isPrimary: false },
        ],
        owner: agent._id,
        contactInfo: { name: `${agent.firstName} ${agent.lastName}`, phone: agentPhone, email: agent.email },
        featured: i < 8, approved: true, isActive: true,
      });
    }

    const counts = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Inquiry.countDocuments(),
    ]);
    console.log(`Seeded: ${counts[0]} users, ${counts[1]} properties, ${counts[2]} inquiries`);
    console.log('\nLogin Credentials:');
    console.log('  Admin: admin@lere.com / admin12345');
    console.log('  Agent: agent1@lere.com / agent12345');
    console.log('  Buyer: buyer@lere.com / buyer12345');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}
seed();
