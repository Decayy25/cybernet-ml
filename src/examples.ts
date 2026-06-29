// /**
//  * CONTOH PENGGUNAAN - Machine Learning Library
//  * Berbagai skenario penggunaan library untuk prediksi ketersediaan layanan
//  */

// // ============================================
// // CONTOH 1: Penggunaan Dasar
// // ============================================

// import predictAvailability, { 
//   BayesClassifier, 
//   textUtils 
// } from './index';

// // Data wilayah simulasi (dari database Anda)
// const dataWilayah = [
//   { _id: '1', area: 'Jakarta Selatan', status: 'tersedia' },
//   { _id: '2', area: 'Jakarta Utara', status: 'tidak_tersedia' },
//   { _id: '3', area: 'Jakarta Timur', status: 'tersedia' },
//   { _id: '4', area: 'Bandung', status: 'tersedia' },
//   { _id: '5', area: 'Bogor', status: 'tidak_tersedia' },
//   { _id: '6', area: 'Depok', status: 'tidak_tersedia' },
//   { _id: '7', area: 'Tangerang', status: 'tersedia' },
//   { _id: '8', area: 'Bekasi', status: 'tidak_tersedia' },
// ];

// // Fungsi helper untuk display hasil
// const printResult = (title: string, result: any) => {
//   console.log('\n' + '='.repeat(50));
//   console.log(`📍 ${title}`);
//   console.log('='.repeat(50));
//   console.log(JSON.stringify(result, null, 2));
// };

// // ============================================
// // CONTOH 1A: Prediksi Exact Match
// // ============================================
// async function example1a_exactMatch() {
//   const result = await predictAvailability(
//     { area: 'Jakarta Selatan' },
//     dataWilayah
//   );
  
//   printResult('Exact Match - Jakarta Selatan', result);
//   // Expected: Tersedia (Verified)
// }

// // ============================================
// // CONTOH 1B: Prediksi Fuzzy Match
// // ============================================
// async function example1b_fuzzyMatch() {
//   const result = await predictAvailability(
//     { area: 'Jakartaa Selatan' }, // Typo: extra 'a'
//     dataWilayah
//   );
  
//   printResult('Fuzzy Match - Jakartaa Selatan (Typo)', result);
//   // Expected: Akan match ke 'Jakarta Selatan' dengan similarity ~85%
// }

// // ============================================
// // CONTOH 1C: Prediksi Unknown Area
// // ============================================
// async function example1c_unknownArea() {
//   const result = await predictAvailability(
//     { area: 'Cirebon' }, // Area tidak ada di database
//     dataWilayah
//   );
  
//   printResult('Prediction - Cirebon (Unknown)', result);
//   // Expected: Predicted berdasarkan ML training
// }

// // ============================================
// // CONTOH 2: Menggunakan Classifier Langsung
// // ============================================

// function example2_classifierDirect() {
//   console.log('\n' + '='.repeat(50));
//   console.log('🤖 Direct Classifier Usage');
//   console.log('='.repeat(50));

//   const classifier = new BayesClassifier();

//   // Training dengan data
//   dataWilayah.forEach(item => {
//     classifier.addDocument(item.area, item.status);
//   });

//   classifier.train();

//   // Test berbagai area
//   const testAreas = ['Jakarta Selatan', 'Bogor', 'Cirebon', 'Bandung'];

//   testAreas.forEach(area => {
//     const label = classifier.classify(area);
//     const classifications = classifier.getClassifications(area);
    
//     console.log(`\n📌 Area: ${area}`);
//     console.log(`   Prediction: ${label}`);
//     console.log(`   Confidence scores:`);
//     classifications.forEach(c => {
//       console.log(`     - ${c.label}: ${(c.value * 100).toFixed(2)}%`);
//     });
//   });

//   console.log(`\nℹ️  Classifier Stats:`);
//   console.log(`   Documents trained: ${classifier.getDocumentCount()}`);
//   console.log(`   Labels: ${classifier.getLabelCount()}`);
// }

// // ============================================
// // CONTOH 3: Text Utilities
// // ============================================

// function example3_textUtilities() {
//   console.log('\n' + '='.repeat(50));
//   console.log('✂️  Text Utilities');
//   console.log('='.repeat(50));

//   // 3A: Tokenization
//   console.log('\n1️⃣  Tokenization:');
//   const tokens = textUtils.tokenize('Jakarta Selatan Jaya');
//   console.log(`   Input: 'Jakarta Selatan Jaya'`);
//   console.log(`   Output:`, tokens);

//   // 3B: Normalization
//   console.log('\n2️⃣  Normalization:');
//   const normalized = textUtils.normalizeAreaName('jakarta selatan');
//   console.log(`   Input: 'jakarta selatan'`);
//   console.log(`   Output: '${normalized}'`);

//   // 3C: Similarity Calculation
//   console.log('\n3️⃣  Similarity Calculation:');
//   const pairs = [
//     ['Jakarta', 'Jakarta'],
//     ['Jakarta', 'Jakartaa'],
//     ['Jakarta', 'Bandung'],
//     ['Tangerang', 'Tangerang Selatan'],
//   ];

//   pairs.forEach(([str1, str2]) => {
//     const similarity = textUtils.calculateSimilarity(str1, str2);
//     console.log(`   ${str1} ↔️  ${str2}: ${(similarity * 100).toFixed(2)}%`);
//   });

//   // 3D: Find Similar Area
//   console.log('\n4️⃣  Find Similar Area (Fuzzy Matching):');
//   const testInputs = ['Jakartaa Selatan', 'Bogoor', 'Tangeran'];
  
//   testInputs.forEach(input => {
//     const similar = textUtils.findSimilarArea(input, dataWilayah, 0.7);
//     console.log(`   "${input}" → ${similar ? `"${similar.area}"` : 'No match'}`);
//   });
// }

// // ============================================
// // CONTOH 4: Batch Processing
// // ============================================

// async function example4_batchProcessing() {
//   console.log('\n' + '='.repeat(50));
//   console.log('📦 Batch Processing');
//   console.log('='.repeat(50));

//   const searchTerms = [
//     'Jakarta Selatan',
//     'Bandung',
//     'Bogor',
//     'Surabaya',
//     'Medan',
//   ];

//   const results = await Promise.all(
//     searchTerms.map(area =>
//       predictAvailability({ area }, dataWilayah)
//     )
//   );

//   console.log('\n📊 Hasil Batch:');
//   results.forEach((result, index) => {
//     console.log(`${index + 1}. ${result.area}`);
//     console.log(`   Status: ${result.status}`);
//     console.log(`   Confidence: ${result.confidence}`);
//     console.log(`   Verified: ${result.isVerified ? '✅' : '❌'}`);
//   });
// }

// // ============================================
// // CONTOH 5: Custom Classifier untuk Use Case Lain
// // ============================================

// function example5_customClassifier() {
//   console.log('\n' + '='.repeat(50));
//   console.log('🎯 Custom Classifier - Sentiment Analysis');
//   console.log('='.repeat(50));

//   const sentimentClassifier = new BayesClassifier();

//   // Training data untuk sentiment
//   const trainingData = [
//     { text: 'ini sangat bagus sekali', label: 'positive' },
//     { text: 'produk yang bagus dan berkualitas', label: 'positive' },
//     { text: 'layanan sangat memuaskan', label: 'positive' },
//     { text: 'tidak puas dengan produk ini', label: 'negative' },
//     { text: 'produk rusak dan mengecewakan', label: 'negative' },
//     { text: 'kualitas sangat buruk', label: 'negative' },
//   ];

//   trainingData.forEach(item => {
//     sentimentClassifier.addDocument(item.text, item.label);
//   });

//   sentimentClassifier.train();

//   // Test sentiment
//   const testTexts = [
//     'produk bagus',
//     'kualitas buruk',
//     'sangat memuaskan',
//   ];

//   console.log('\n📝 Sentiment Analysis Results:');
//   testTexts.forEach(text => {
//     const sentiment = sentimentClassifier.classify(text);
//     const scores = sentimentClassifier.getClassifications(text);
    
//     console.log(`\n   Text: "${text}"`);
//     console.log(`   Sentiment: ${sentiment}`);
//     scores.forEach(s => {
//       console.log(`     - ${s.label}: ${(s.value * 100).toFixed(2)}%`);
//     });
//   });
// }

// // ============================================
// // CONTOH 6: Error Handling
// // ============================================

// async function example6_errorHandling() {
//   console.log('\n' + '='.repeat(50));
//   console.log('⚠️  Error Handling');
//   console.log('='.repeat(50));

//   // Case 1: Empty area input
//   console.log('\n1. Empty Input:');
//   const result1 = await predictAvailability(
//     { area: '' },
//     dataWilayah
//   );
//   console.log(`   Result: ${result1.status}`);

//   // Case 2: Empty database
//   console.log('\n2. Empty Database:');
//   const result2 = await predictAvailability(
//     { area: 'Jakarta' },
//     []
//   );
//   console.log(`   Result: ${result2.status}`);

//   // Case 3: Invalid data
//   console.log('\n3. Invalid Data Structure:');
//   const invalidData = [
//     { _id: '1', area: 'Jakarta', status: 'tersedia' },
//     { _id: '2', area: '', status: 'tidak_tersedia' }, // Area kosong
//   ];
  
//   const result3 = await predictAvailability(
//     { area: 'Jakarta' },
//     invalidData
//   );
//   console.log(`   Result: ${result3.status}`);
// }

// // ============================================
// // MAIN: Jalankan semua contoh
// // ============================================

// async function runAllExamples() {
//   console.log('\n\n');
//   console.log('╔═══════════════════════════════════════════════════╗');
//   console.log('║   MACHINE LEARNING LIBRARY - CONTOH PENGGUNAAN   ║');
//   console.log('╚═══════════════════════════════════════════════════╝');

//   // Run examples
//   await example1a_exactMatch();
//   await example1b_fuzzyMatch();
//   await example1c_unknownArea();
  
//   example2_classifierDirect();
//   example3_textUtilities();
  
//   await example4_batchProcessing();
//   example5_customClassifier();
  
//   await example6_errorHandling();

//   console.log('\n\n');
//   console.log('═'.repeat(50));
//   console.log('✅ Semua contoh selesai!');
//   console.log('═'.repeat(50));
// }

// // Uncomment untuk menjalankan
// // runAllExamples().catch(console.error);

// export {
//   example1a_exactMatch,
//   example1b_fuzzyMatch,
//   example1c_unknownArea,
//   example2_classifierDirect,
//   example3_textUtilities,
//   example4_batchProcessing,
//   example5_customClassifier,
//   example6_errorHandling,
// };
