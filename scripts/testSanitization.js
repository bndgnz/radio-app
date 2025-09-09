/**
 * Test script to verify zero-width character sanitization works correctly
 */

// Import our sanitization functions
const { deepSanitizeText, deepSanitizeObject } = require('./cleanZeroWidthCharacters');

// Test data with zero-width characters (like what we see in the logs)
const testData = {
  // Real contaminated data from the logs
  title: 'Theme​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​‍‌‍‍‌‌‍‌﻿‌‍‍‌‌‍﻿‍​‍​‍​﻿‍‍​‍​‍‌﻿​﻿‌‍​‌‌‍﻿‍‌‍‍‌‌﻿‌​‌﻿‍‌​‍﻿‍‌‍‍‌‌‍﻿﻿​‍​‍​‍﻿​​‍​‍‌‍‍​‌﻿​‍‌‍‌‌‌‍‌‍​‍​‍​﻿‍‍​‍​‍‌‍‍​‌﻿‌​‌﻿‌​‌﻿​​​﻿‍‍​‍﻿﻿​‍﻿﻿‌‍﻿​‌‍﻿﻿‌‍​﻿‌‍​‌‌‍﻿​‌‍‍​‌‍﻿﻿‌﻿​﻿‌﻿‌​​﻿‍‍​﻿​﻿​﻿​﻿​﻿​﻿​﻿​﻿​‍﻿﻿‌‍‍‌‌‍﻿‍‌﻿‌​‌‍‌‌‌‍﻿‍‌﻿‌​​‍﻿﻿‌‍‌‌‌‍‌​‌‍‍‌‌﻿‌​​‍﻿﻿‌‍﻿‌‌‍﻿﻿‌‍‌​‌‍‌‌​﻿﻿‌‌﻿​​‌﻿​‍‌‍‌‌‌﻿​﻿‌‍‌‌‌‍﻿‍‌﻿‌​‌‍​‌‌﻿‌​‌‍‍‌‌‍﻿﻿‌‍﻿‍​﻿‍﻿‌‍‍‌‌‍‌​​﻿﻿‌​﻿‌‌​﻿‍‌​﻿‌‌​﻿​​​﻿​‌​﻿​‌‌‍‌​​﻿‌​​‍﻿‌​﻿‌​​﻿​​​﻿‍​​﻿‌﻿​‍﻿‌​﻿‌​​﻿‌﻿‌‍‌‌‌‍​‍​‍﻿‌‌‍​‍‌‍‌‍‌‍‌‌​﻿​‌​‍﻿‌​﻿‌﻿​﻿‌​​﻿​​​﻿‌﻿‌‍‌‌​﻿​​​﻿‌‌​﻿​‍​﻿​‍‌‍​‌​﻿‌‌‌‍​﻿​﻿‍﻿‌﻿‌​‌﻿‍‌‌﻿​​‌‍‌‌​﻿﻿‌‌‍﻿​‌‍​‌‌‍﻿‍‌‍‌​‌‍‍‌‌‍﻿‍‌‍‌﻿‌‌​​‌‍​‌‌‍‌﻿‌‍‌‌​﻿‍﻿‌﻿​​‌‍​‌‌﻿‌​‌‍‍​​﻿﻿‌‌​',
  
  folder: 'Beaches and landscapes​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​‍‌‍‍‌‌‍‌﻿‌‍‍‌‌‍﻿‍​‍​‍​﻿‍‍​‍​‍‌﻿​﻿‌‍​‌‌‍﻿‍‌‍‍‌‌﻿‌​‌﻿‍‌​‍﻿‍‌‍‍‌‌‍﻿﻿​‍​‍​‍﻿​​‍​‍‌‍‍​‌﻿​‍‌‍‌‌‌‍‌‍​‍​‍​﻿‍‍​‍​‍‌‍‍​‌﻿‌​‌﻿‌​‌﻿​​​﻿‍‍​‍﻿﻿​‍﻿﻿‌‍﻿​‌‍﻿﻿‌‍​﻿‌‍​‌‌‍﻿​‌‍‍​‌‍﻿﻿‌﻿​﻿‌﻿‌​​﻿‍‍​﻿​﻿​﻿​﻿​﻿​﻿​﻿​﻿​‍﻿﻿‌‍‍‌‌‍﻿‍‌﻿‌​‌‍‌‌‌‍﻿‍‌﻿‌​​‍﻿﻿‌‍‌‌‌‍‌​‌‍‍‌‌﻿‌​​‍﻿﻿‌‍﻿‌‌‍﻿﻿‌‍‌​‌‍‌‌​﻿﻿‌‌﻿​​‌﻿​‍‌‍‌‌‌﻿​﻿‌‍‌‌‌‍﻿‍‌﻿‌​‌‍​‌‌﻿‌​‌‍‍‌‌‍﻿﻿‌‍﻿‍​﻿‍﻿‌‍‍‌‌‍‌​​﻿﻿‌​﻿‌‌​﻿‍‌​﻿‌‌​﻿​​​﻿​‌​﻿​‌‌‍‌​​﻿‌​​‍﻿‌​﻿‌​​﻿​​​﻿‍​​﻿‌﻿​‍﻿‌​﻿‌​​﻿‌﻿‌‍‌‌‌‍​‍​‍﻿‌‌‍​‍‌‍‌‍‌‍‌‌​﻿​‌​‍﻿‌​﻿‌﻿​﻿‌​​﻿​​​﻿‌﻿‌‍‌‌​﻿​​​﻿‌‌​﻿​‍​﻿​‍‌‍​‌​﻿‌‌‌‍​﻿​﻿‍﻿‌﻿‌​‌﻿‍‌‌﻿​​‌‍‌‌​﻿﻿‌‌‍﻿​‌‍​‌‌‍﻿‍‌‍‌​‌‍‍‌‌‍﻿‍‌‍‌﻿‌‌​​‌‍​‌‌‍‌﻿‌‍‌‌​﻿‍﻿‌﻿​​‌‍​‌‌﻿‌​‌‍‍​​﻿﻿‌‌‍',
  
  access_mode: 'public​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​‍‌‍‍‌‌‍‌﻿‌‍‍‌‌‍﻿‍​‍​‍​﻿‍‍​‍​‍‌﻿​﻿‌‍​‌‌‍﻿‍‌‍‍‌‌﻿‌​‌﻿‍‌​‍﻿‍‌‍‍‌‌‍﻿﻿​‍​‍​‍﻿​​‍​‍‌‍‍​‌﻿​‍‌‍‌‌‌‍‌‍​‍​‍​﻿‍‍​‍​‍‌‍‍​‌﻿‌​‌﻿‌​‌﻿​​​﻿‍‍​‍﻿﻿​‍﻿﻿‌‍﻿​‌‍﻿﻿‌‍​﻿‌‍​‌‌‍﻿​‌‍‍​‌‍﻿﻿‌﻿​﻿‌﻿‌​​﻿‍‍​﻿​﻿​﻿​﻿​﻿​﻿​﻿​﻿​‍﻿﻿‌‍‍‌‌‍﻿‍‌﻿‌​‌‍‌‌‌‍﻿‍‌﻿‌​​‍﻿﻿‌‍‌‌‌‍‌​‌‍‍‌‌﻿‌​​‍﻿﻿‌‍﻿‌‌‍﻿﻿‌‍‌​‌‍‌‌​﻿﻿‌‌﻿​​‌﻿​‍‌‍‌‌‌﻿​﻿‌‍‌‌‌‍﻿‍‌﻿‌​‌‍​‌‌﻿‌​‌‍‍‌‌‍﻿﻿‌‍﻿‍​﻿‍﻿‌‍‍‌‌‍‌​​﻿﻿‌​﻿‌‌​﻿‍‌​﻿‌‌​﻿​​​﻿​‌​﻿​‌‌‍‌​​﻿‌​​‍﻿‌​﻿‌​​﻿​​​﻿‍​​﻿‌﻿​‍﻿‌​﻿‌​​﻿‌﻿‌‍‌‌‌‍​‍​‍﻿‌‌‍​‍‌‍‌‍‌‍‌‌​﻿​‌​‍﻿‌​﻿‌﻿​﻿‌​​﻿​​​﻿‌﻿‌‍‌‌​﻿​​​﻿‌‌​﻿​‍​﻿​‍‌‍​‌​﻿‌‌‌‍​﻿​﻿‍﻿‌﻿‌​‌﻿‍‌‌﻿​​‌‍‌‌​﻿﻿‌‌‍﻿​‌‍​‌‌‍﻿‍‌‍‌​‌‍‍‌‌‍﻿‍‌‍‌﻿‌‌​​‌‍​‌‌‍‌﻿‌‍‌‌​﻿‍﻿‌﻿​​‌‍​‌‌﻿‌​‌‍‍​​﻿﻿‌‌‍​﻿‌‍﻿​‌‍﻿﻿‌﻿‌‌‌‍‌​‌‍‍‌‌‍﻿‍‌‍​‌‌﻿​‍‌﻿‍‌‌​‍‌‌‍﻿‌‌‍​‌‌‍‌﻿‌‍‌‌​‍﻿‍‌‍​‌‌‍​﻿‌‍​﻿‌‍‌‌‌﻿​﻿‌﻿​﻿‌‌﻿﻿‌‍﻿‌‌‍﻿﻿‌‍‌​‌‍‌‌​﻿﻿﻿‌‍​‍‌‍​‌‌﻿​﻿‌‍‌‌‌‌‌‌‌﻿​‍‌‍﻿​​﻿﻿‌‌‍‍​‌﻿‌​‌﻿‌​‌﻿​​​‍‌‌​﻿​﻿‌​​‌​‍‌‌​﻿​‍‌​‌‍​‍‌‌​﻿​‍‌​‌‍‌‍﻿​‌‍﻿﻿‌‍​﻿‌‍​‌‌‍﻿​‌‍‍​‌‍﻿﻿‌﻿​﻿‌﻿‌​​‍‌‌​﻿​﻿‌​​‌​﻿​﻿​﻿​﻿​﻿​﻿​﻿​﻿​‍‌‍‌‍‍‌‌‍‌​​﻿﻿‌​﻿‌‌​﻿‍‌​﻿‌‌​﻿​​​﻿​‌​﻿​‌‌‍‌​​﻿‌​​‍﻿‌​﻿‌​​﻿​​​﻿‍​​﻿‌﻿​‍﻿‌​﻿‌​​﻿‌﻿‌‍‌‌‌‍​‍​‍﻿‌‌‍​‍‌‍‌‍‌‍‌‌​﻿​‌​‍﻿‌​﻿‌﻿​﻿‌​​﻿​​​﻿‌﻿‌‍‌‌​﻿​​​﻿‌‌​﻿​‍​﻿​‍‌‍​‌​﻿‌‌‌‍​﻿​‍‌‍‌﻿‌​‌﻿‍‌‌﻿​​‌‍‌‌​﻿﻿‌‌‍﻿​‌‍​‌‌‍﻿‍‌‍‌​‌‍‍‌‌‍﻿‍‌‍‌﻿‌‌​​‌‍​‌‌‍‌﻿‌‍‌‌​‍‌‍‌﻿​​‌‍​‌‌﻿‌​‌‍‍​​﻿﻿‌‌‍​﻿‌‍﻿​‌‍﻿﻿‌﻿‌‌‌‍‌​‌‍‍‌‌‍﻿‍‌‍​‌‌﻿​‍‌﻿‍‌‌​‍‌‌‍﻿‌‌‍​‌‌‍‌﻿‌‍‌‌​‍﻿‍‌‍​‌‌‍​﻿‌‍​﻿‌‍‌‌‌﻿​﻿‌﻿​﻿‌‌﻿﻿‌‍﻿‌‌‍﻿﻿‌‍‌​‌‍‌‌​‍‌‍‌﻿​​‌‍‌‌‌﻿​‍‌﻿​﻿‌﻿​​‌‍‌‌‌‍​﻿‌﻿‌​‌‍‍‌‌﻿‌‍‌‍‌‌​﻿﻿‌‌﻿​​‌﻿‌‌‌‍​‍‌‍﻿​‌‍‍‌‌﻿​﻿‌‍‍​‌‍‌‌‌‍‌​​‍​‍‌﻿﻿‌',
  
  // Normal data for comparison
  normalTitle: 'Theme',
  normalFolder: 'Beaches and landscapes',
  normalAccessMode: 'public',
  
  // Mixed data
  mixedArray: [
    'Normal string',
    'Contaminated​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​‍‌‍‍‌‌‍‌﻿‌‍‍‌‌‍﻿‍​‍​‍​﻿‍‍​‍​‍‌﻿​﻿‌‍​‌‌‍﻿‍‌‍‍‌‌﻿‌​‌﻿‍‌​‍﻿‍‌‍‍‌‌‍﻿﻿​‍​‍​‍﻿​​‍​‍‌‍‍​‌﻿​‍‌‍‌‌‌‍‌‍​‍​‍​﻿‍‍​‍​‍‌‍‍​‌﻿‌​‌﻿‌​‌﻿​​​﻿‍‍​‍﻿﻿​‍﻿﻿‌‍﻿​‌‍﻿﻿‌‍​﻿‌‍​‌‌‍﻿​‌‍‍​‌‍﻿﻿‌﻿​﻿‌﻿‌​​﻿‍‍​﻿​﻿​﻿​﻿​﻿​﻿​﻿​﻿​‍﻿﻿‌‍‍‌‌‍﻿‍‌﻿‌​‌‍‌‌‌‍﻿‍‌﻿‌​​‍﻿﻿‌‍‌‌‌‍‌​‌‍‍‌‌﻿‌​​‍﻿﻿‌‍﻿‌‌‍﻿﻿‌‍‌​‌‍‌‌​﻿﻿‌‌﻿​​‌﻿​‍‌‍‌‌‌﻿​﻿‌‍‌‌‌‍﻿‍‌﻿‌​‌‍​‌‌﻿‌​‌‍‍‌‌‍﻿﻿‌‍﻿‍​﻿‍﻿‌‍‍‌‌‍‌​​﻿﻿‌​﻿‌‌​﻿‍‌​﻿‌‌​﻿​​​﻿​‌​﻿​‌‌‍‌​​﻿‌​​‍﻿‌​﻿‌​​﻿​​​﻿‍​​﻿‌﻿​‍﻿‌​﻿‌​​﻿‌﻿‌‍‌‌‌‍​‍​‍﻿‌‌‍​‍‌‍‌‍‌‍‌‌​﻿​‌​‍﻿‌​﻿‌﻿​﻿‌​​﻿​​​﻿‌﻿‌‍‌‌​﻿​​​﻿‌‌​﻿​‍​﻿​‍‌‍​‌​﻿‌‌‌‍​﻿​﻿‍﻿‌﻿‌​‌﻿‍‌‌﻿​​‌‍‌‌​﻿﻿‌‌‍﻿​‌‍​‌‌‍﻿‍‌‍‌​‌‍‍‌‌‍﻿‍‌‍‌﻿‌‌​​‌‍​‌‌‍‌﻿‌‍‌‌​﻿‍﻿‌﻿​​‌‍​‌‌﻿‌​‌‍‍​​﻿﻿‌‌‍',
    null,
    123,
    { nestedContaminated: 'Test​​​​‌﻿‍﻿​‍​‍‌‍' }
  ]
};

function runTests() {
  console.log('🧪 Testing Zero-Width Character Sanitization\n');
  
  // Test individual string sanitization
  console.log('=== STRING SANITIZATION TEST ===');
  const contaminatedTitle = testData.title;
  const cleanTitle = deepSanitizeText(contaminatedTitle);
  
  console.log(`Original length: ${contaminatedTitle.length}`);
  console.log(`Cleaned length:  ${cleanTitle.length}`);
  console.log(`Original: "${contaminatedTitle.substring(0, 50)}..."`);
  console.log(`Cleaned:  "${cleanTitle}"`);
  console.log(`Fully cleaned: ${cleanTitle === 'Theme'}\n`);
  
  // Test folder name
  console.log('=== FOLDER NAME TEST ===');
  const contaminatedFolder = testData.folder;
  const cleanFolder = deepSanitizeText(contaminatedFolder);
  
  console.log(`Original length: ${contaminatedFolder.length}`);
  console.log(`Cleaned length:  ${cleanFolder.length}`);
  console.log(`Original: "${contaminatedFolder.substring(0, 50)}..."`);
  console.log(`Cleaned:  "${cleanFolder}"`);
  console.log(`Fully cleaned: ${cleanFolder === 'Beaches and landscapes'}\n`);
  
  // Test access mode
  console.log('=== ACCESS MODE TEST ===');
  const contaminatedAccess = testData.access_mode;
  const cleanAccess = deepSanitizeText(contaminatedAccess);
  
  console.log(`Original length: ${contaminatedAccess.length}`);
  console.log(`Cleaned length:  ${cleanAccess.length}`);
  console.log(`Original: "${contaminatedAccess.substring(0, 50)}..."`);
  console.log(`Cleaned:  "${cleanAccess}"`);
  console.log(`Fully cleaned: ${cleanAccess === 'public'}\n`);
  
  // Test object deep sanitization
  console.log('=== OBJECT DEEP SANITIZATION TEST ===');
  const originalJson = JSON.stringify(testData);
  const cleanedData = deepSanitizeObject(testData);
  const cleanedJson = JSON.stringify(cleanedData);
  
  console.log(`Original JSON length: ${originalJson.length}`);
  console.log(`Cleaned JSON length:  ${cleanedJson.length}`);
  console.log(`Size reduction: ${originalJson.length - cleanedJson.length} characters`);
  console.log(`Percentage reduction: ${Math.round((1 - cleanedJson.length / originalJson.length) * 100)}%\n`);
  
  // Show cleaned results
  console.log('=== CLEANED RESULTS ===');
  console.log('Cleaned data:');
  console.log(JSON.stringify(cleanedData, null, 2));
  
  // Verify all contaminated strings are clean
  console.log('\n=== VERIFICATION ===');
  const verifications = [
    { name: 'title', expected: 'Theme', actual: cleanedData.title },
    { name: 'folder', expected: 'Beaches and landscapes', actual: cleanedData.folder },
    { name: 'access_mode', expected: 'public', actual: cleanedData.access_mode },
    { name: 'normalTitle', expected: 'Theme', actual: cleanedData.normalTitle },
    { name: 'mixedArray[1]', expected: 'Contaminated', actual: cleanedData.mixedArray[1] },
    { name: 'mixedArray[4].nestedContaminated', expected: 'Test', actual: cleanedData.mixedArray[4].nestedContaminated }
  ];
  
  let allPassed = true;
  verifications.forEach(({ name, expected, actual }) => {
    const passed = actual === expected;
    console.log(`${passed ? '✅' : '❌'} ${name}: "${actual}" (expected: "${expected}")`);
    if (!passed) allPassed = false;
  });
  
  console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED!' : '💥 SOME TESTS FAILED!'}`);
  
  if (allPassed) {
    console.log('✅ Zero-width character sanitization is working correctly!');
    console.log('✅ Ready to run cleanup on the Sanity database.');
  } else {
    console.log('❌ Sanitization needs improvement before running on live data.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };