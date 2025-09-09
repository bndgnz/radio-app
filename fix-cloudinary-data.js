const fs = require('fs');
const path = require('path');

console.log('🔄 Converting Cloudinary data format in dataset...');

// Read the dataset file
const datasetPath = path.join(__dirname, 'migration-output', 'dataset.ndjson');
const data = fs.readFileSync(datasetPath, 'utf8');
const lines = data.trim().split('\n');

let processedLines = [];
let convertedCount = 0;

for (const line of lines) {
  try {
    const doc = JSON.parse(line);
    let modified = false;
    
    // Convert cloudinaryImage arrays to cloudinary.asset format
    if (doc.cloudinaryImage && Array.isArray(doc.cloudinaryImage) && doc.cloudinaryImage.length > 0) {
      const legacy = doc.cloudinaryImage[0];
      doc.cloudinaryImage = {
        _type: 'cloudinary.asset',
        public_id: legacy.public_id,
        version: legacy.version,
        format: legacy.format,
        resource_type: legacy.resource_type || 'image',
        type: legacy.type || 'upload',
        width: legacy.width,
        height: legacy.height,
        bytes: legacy.bytes,
        url: legacy.secure_url || legacy.url,
        secure_url: legacy.secure_url
      };
      modified = true;
      console.log(`✅ Converted cloudinaryImage for ${doc._type}: ${doc._id}`);
    }
    
    // Convert cimage arrays to cloudinary.asset format
    if (doc.cimage && Array.isArray(doc.cimage) && doc.cimage.length > 0) {
      const legacy = doc.cimage[0];
      doc.cimage = {
        _type: 'cloudinary.asset',
        public_id: legacy.public_id,
        version: legacy.version,
        format: legacy.format,
        resource_type: legacy.resource_type || 'image',
        type: legacy.type || 'upload',
        width: legacy.width,
        height: legacy.height,
        bytes: legacy.bytes,
        url: legacy.secure_url || legacy.url,
        secure_url: legacy.secure_url
      };
      modified = true;
      console.log(`✅ Converted cimage for ${doc._type}: ${doc._id}`);
    }
    
    // Convert bannerImage arrays to cloudinary.asset format
    if (doc.bannerImage && Array.isArray(doc.bannerImage) && doc.bannerImage.length > 0) {
      const legacy = doc.bannerImage[0];
      doc.bannerImage = {
        _type: 'cloudinary.asset',
        public_id: legacy.public_id,
        version: legacy.version,
        format: legacy.format,
        resource_type: legacy.resource_type || 'image',
        type: legacy.type || 'upload',
        width: legacy.width,
        height: legacy.height,
        bytes: legacy.bytes,
        url: legacy.secure_url || legacy.url,
        secure_url: legacy.secure_url
      };
      modified = true;
      console.log(`✅ Converted bannerImage for ${doc._type}: ${doc._id}`);
    }
    
    if (modified) {
      convertedCount++;
    }
    
    processedLines.push(JSON.stringify(doc));
  } catch (e) {
    // Keep original line if parsing fails
    processedLines.push(line);
  }
}

// Write the modified dataset back
const newData = processedLines.join('\n') + '\n';
fs.writeFileSync(datasetPath, newData);

console.log(`🎉 Conversion complete! Modified ${convertedCount} documents`);
console.log('📁 Updated dataset file: migration-output/dataset.ndjson');