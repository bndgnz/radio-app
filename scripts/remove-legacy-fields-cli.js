const { execSync } = require('child_process');

console.log('Legacy Fields Cleanup Tool (Using Sanity CLI)');
console.log('==============================================\n');

try {
  // First, get all documents with legacy fields
  console.log('Fetching documents with legacy fields...\n');
  
  // Escape the query properly for Windows
  const query = `*[_type == "landingPage" && (defined(components) || defined(showBanner) || defined(showContent) || defined(showIntroduction))]{_id, title}`;
  const escapedQuery = query.replace(/"/g, '\\"');
  
  const queryResult = execSync(
    `npx sanity documents query "${escapedQuery}" --dataset production --api-version v2022-06-01`,
    { encoding: 'utf8', shell: true }
  );
  
  const documents = JSON.parse(queryResult);
  
  if (documents.length === 0) {
    console.log('✅ No documents with legacy fields found!');
    process.exit(0);
  }
  
  console.log(`Found ${documents.length} document(s) with legacy fields:`);
  documents.forEach(doc => {
    console.log(`• ${doc.title || 'Untitled'} (ID: ${doc._id})`);
  });
  
  console.log('\n⚠️  About to remove legacy fields from these documents');
  console.log('This will unset: components, showBanner, showContent, showIntroduction');
  console.log('\nPress Enter to continue or Ctrl+C to cancel...');
  
  // Wait for user confirmation
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).question('', () => {
    console.log('\nProcessing documents...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each document
    documents.forEach(doc => {
      try {
        // Create a patch to unset the legacy fields
        const patchCommand = `npx sanity documents patch ${doc._id} --unset components --unset showBanner --unset showContent --unset showIntroduction --dataset production --api-version v2022-06-01`;
        
        execSync(patchCommand, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✓ Cleaned: ${doc.title || 'Untitled'} (${doc._id})`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to clean ${doc._id}: ${error.message}`);
        errorCount++;
      }
    });
    
    console.log('\n==============================================');
    console.log(`✅ Cleanup complete!`);
    console.log(`   Successfully cleaned: ${successCount} documents`);
    if (errorCount > 0) {
      console.log(`   Failed: ${errorCount} documents`);
    }
    
    process.exit(0);
  });
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}