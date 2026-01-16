require('dotenv').config();
const mongoose = require('mongoose');
const PatientProfile = require('./models/PatientProfile');
const PhysicalVitals = require('./models/PhysicalVitals');
const Prescription = require('./models/Prescription');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Function to get schema information
const getSchemaInfo = (model) => {
  const schema = model.schema.obj;
  const fields = {};
  
  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'object' && value.type) {
      fields[key] = {
        type: value.type.name || value.type,
        required: value.required || false,
        default: value.default,
        enum: value.enum || null,
        min: value.min || null,
        max: value.max || null,
        maxlength: value.maxlength || null
      };
    } else {
      fields[key] = {
        type: value.name || typeof value,
        required: false
      };
    }
  }
  
  return fields;
};

// Function to get sample data
const getSampleData = async (model, limit = 1) => {
  try {
    const samples = await model.find().limit(limit).lean();
    return samples;
  } catch (error) {
    return [];
  }
};

// Function to get collection stats
const getCollectionStats = async (collectionName) => {
  try {
    const stats = await mongoose.connection.db.collection(collectionName).stats();
    return {
      count: stats.count,
      size: `${(stats.size / 1024).toFixed(2)} KB`,
      avgDocSize: `${(stats.avgObjSize / 1024).toFixed(2)} KB`
    };
  } catch (error) {
    return { count: 0, size: '0 KB', avgDocSize: '0 KB' };
  }
};

// Main function to display all collections and sample data
const displayAllSchemas = async () => {
  await connectDB();

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         MONGODB COLLECTIONS & SAMPLE DOCUMENTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Get all collections in database
  console.log('📚 ALL COLLECTIONS IN DATABASE:\n');
  const collections = await mongoose.connection.db.listCollections().toArray();
  collections.forEach((col, index) => {
    console.log(`${index + 1}. ${col.name}`);
  });

  console.log('\n' + '═'.repeat(70));
  console.log('\n📄 SAMPLE DOCUMENTS FROM EACH COLLECTION:\n');
  console.log('═'.repeat(70));

  // Get sample document from each collection
  for (const col of collections) {
    const collectionName = col.name;
    console.log(`\n\n📊 Collection: ${collectionName.toUpperCase()}`);
    console.log('─'.repeat(70));
    
    try {
      // Get collection stats
      const stats = await getCollectionStats(collectionName);
      console.log(`Documents: ${stats.count} | Size: ${stats.size}`);
      
      // Get one sample document
      const sample = await mongoose.connection.db.collection(collectionName).findOne();
      
      if (sample) {
        console.log('\nSample Document:');
        console.log(JSON.stringify(sample, null, 2));
      } else {
        console.log('\nSample Document: No data found in this collection');
      }
    } catch (error) {
      console.log(`\nError fetching from ${collectionName}: ${error.message}`);
    }
  }

  console.log('\n\n' + '═'.repeat(70));
  console.log(`\n✅ Total Collections: ${collections.length}`);
  
  mongoose.connection.close();
  console.log('✅ Database connection closed\n');
};

// Run the script
displayAllSchemas().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
