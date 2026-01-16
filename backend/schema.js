const mongoose = require('mongoose');
const PatientProfile = require('./models/PatientProfile');
const PhysicalVitals = require('./models/PhysicalVitals');
const Prescription = require('./models/Prescription');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';
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

// Main function to display all schemas
const displayAllSchemas = async () => {
  await connectDB();

  const models = [
    { name: 'PatientProfile', model: PatientProfile, collection: 'patients' },
    { name: 'PhysicalVitals', model: PhysicalVitals, collection: 'physical_vitals' },
    { name: 'Prescription', model: Prescription, collection: 'prescription' },
    { name: 'Appointment', model: Appointment, collection: 'appointments' },
    { name: 'Notification', model: Notification, collection: 'notifications' }
  ];

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         MONGODB COLLECTIONS & SCHEMAS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const { name, model, collection } of models) {
    console.log(`\n📊 ${name.toUpperCase()}`);
    console.log('─'.repeat(70));
    console.log(`Collection: ${collection}`);
    
    // Get collection stats
    const stats = await getCollectionStats(collection);
    console.log(`Documents: ${stats.count} | Size: ${stats.size} | Avg Doc Size: ${stats.avgDocSize}`);
    
    console.log('\n📋 SCHEMA:');
    const schema = getSchemaInfo(model);
    console.table(schema);
    
    // Get sample data
    const samples = await getSampleData(model, 1);
    if (samples.length > 0) {
      console.log('\n📄 SAMPLE DOCUMENT:');
      console.log(JSON.stringify(samples[0], null, 2));
    } else {
      console.log('\n📄 SAMPLE DOCUMENT: No data found');
    }
    
    console.log('\n' + '═'.repeat(70));
  }

  // Get all collections in database
  console.log('\n\n📚 ALL COLLECTIONS IN DATABASE:');
  console.log('─'.repeat(70));
  const collections = await mongoose.connection.db.listCollections().toArray();
  collections.forEach((col, index) => {
    console.log(`${index + 1}. ${col.name}`);
  });

  mongoose.connection.close();
  console.log('\n✅ Database connection closed');
};

// Run the script
displayAllSchemas().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
