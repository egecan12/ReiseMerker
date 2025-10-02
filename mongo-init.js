// MongoDB initialization script
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'location_notebook');

// Create collections
db.createCollection('locations');
db.createCollection('users');

// Create indexes for better performance
db.locations.createIndex({ "userId": 1 });
db.locations.createIndex({ "timestamp": -1 });
db.locations.createIndex({ "latitude": 1, "longitude": 1 });

db.users.createIndex({ "googleId": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

// Insert sample data (optional)
db.locations.insertOne({
  _id: ObjectId(),
  userId: "demo-user",
  name: "Sample Location",
  latitude: 40.7128,
  longitude: -74.0060,
  description: "This is a sample location for testing",
  timestamp: new Date(),
  photos: []
});

print('Database initialized successfully!');
