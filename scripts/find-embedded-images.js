export default async function(client) {
  // Query for all documents that might contain portable text with embedded images
  const query = `*[_type == "landingPage" && defined(content)]{
    _id,
    title,
    content[]{
      ...,
      _type == "image" => {
        _key,
        _type,
        asset
      }
    }
  }`;
  
  const docs = await client.fetch(query);
  
  console.log("=== EMBEDDED IMAGES AUDIT ===");
  console.log(`Found ${docs.length} landing pages with content`);
  
  let totalImageBlocks = 0;
  
  docs.forEach(doc => {
    console.log(`\n📄 ${doc.title} (${doc._id})`);
    
    if (doc.content && Array.isArray(doc.content)) {
      const imageBlocks = doc.content.filter(block => block._type === "image");
      totalImageBlocks += imageBlocks.length;
      
      if (imageBlocks.length > 0) {
        console.log(`  🖼️  Found ${imageBlocks.length} embedded image(s):`);
        imageBlocks.forEach(img => {
          console.log(`    - Key: ${img._key}`);
          console.log(`    - Asset ref: ${img.asset?._ref || 'NO ASSET'}`);
          console.log(`    - Full block:`, JSON.stringify(img, null, 6));
        });
      } else {
        console.log(`  ✅ No embedded images found`);
      }
    }
  });
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total documents: ${docs.length}`);
  console.log(`Total embedded image blocks: ${totalImageBlocks}`);
  
  return { docs, totalImageBlocks };
}