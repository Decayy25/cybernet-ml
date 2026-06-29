# Machine Learning Library - Location Availability Prediction

Sebuah library Machine Learning pure TypeScript/JavaScript untuk prediksi ketersediaan layanan jaringan berdasarkan nama wilayah. **Tanpa dependency eksternal** seperti library `natural` yang membutuhkan `require` dan waktu loading lama.

## ✨ Keunggulan

- ✅ **Zero Dependencies** - Tidak membutuhkan library eksternal
- ✅ **ES6 Import** - Menggunakan modern JavaScript import, bukan `require`
- ✅ **Fast Loading** - Tidak ada proses parsing `require` yang lambat
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Accurate** - Menggunakan Naive Bayes Classifier dengan Laplace Smoothing
- ✅ **Fuzzy Matching** - Support untuk pencarian area yang mirip

## 📦 Struktur File

```
MachineLearning/
├── BayesClassifier.ts       # Implementasi Naive Bayes Classifier
├── index.ts                 # Fungsi prediksi dan utilities
├── tokenizer.ts             # Text tokenization
├── types.ts                 # TypeScript interfaces
└── README.md               # Dokumentasi ini
```

## 🚀 Cara Penggunaan

### 1. Import Library

```typescript
import predictAvailability, { 
  BayesClassifier, 
  textUtils 
} from './MachineLearning';
```

### 2. Contoh Penggunaan Dasar

```typescript
// Data wilayah dari database Anda
const dataWilayah = [
  { _id: '1', area: 'Jakarta Selatan', status: 'tersedia' },
  { _id: '2', area: 'Jakarta Utara', status: 'tidak_tersedia' },
  { _id: '3', area: 'Bandung', status: 'tersedia' },
  { _id: '4', area: 'Bogor', status: 'tidak_tersedia' },
];

// Prediksi ketersediaan
const result = await predictAvailability(
  { area: 'Jakarta' },
  dataWilayah
);

console.log(result);
// Output:
// {
//   area: 'Jakarta',
//   status: 'Tersedia Layanan Jaringan CyberNet (Predicted)',
//   confidence: '78.45%',
//   isVerified: false,
//   matchedArea: undefined
// }
```

### 3. Menggunakan Classifier Secara Langsung

```typescript
import { BayesClassifier } from './MachineLearning';

const classifier = new BayesClassifier();

// Training dengan data
classifier.addDocument('Jakarta Selatan', 'tersedia');
classifier.addDocument('Jakarta Utara', 'tersedia');
classifier.addDocument('Bogor', 'tidak_tersedia');
classifier.addDocument('Depok', 'tidak_tersedia');

classifier.train();

// Prediksi
const label = classifier.classify('Jakarta');
console.log(label); // 'tersedia'

// Dapatkan semua klasifikasi dengan confidence
const classifications = classifier.getClassifications('Jakarta');
console.log(classifications);
// [
//   { label: 'tersedia', value: 0.85 },
//   { label: 'tidak_tersedia', value: 0.15 }
// ]
```

### 4. Menggunakan Text Utilities

```typescript
import { textUtils } from './MachineLearning';

// Tokenize teks
const tokens = textUtils.tokenize('Jakarta Selatan');
// Output: ['jakarta', 'selatan']

// Normalisasi nama area
const normalized = textUtils.normalizeAreaName('jakarta selatan');
// Output: 'Jakarta Selatan'

// Hitung similarity antara dua string
const similarity = textUtils.calculateSimilarity('Jakarta', 'Jakartaa');
// Output: 0.85

// Cari area yang mirip
const areas = [
  { _id: '1', area: 'Jakarta Selatan', status: 'tersedia' },
  { _id: '2', area: 'Jakarta Utara', status: 'tersedia' },
];

const similarArea = textUtils.findSimilarArea('Jakartaa', areas, 0.7);
// Output: { _id: '1', area: 'Jakarta Selatan', status: 'tersedia' }
```

## 🤖 Cara Kerja

### Prediksi Availability (`predictAvailability`)

Menggunakan 3 tahap pengklasifikasian:

1. **Exact Matching** - Cocokkan 100% dengan database
   - Hasil: `Verified` (status pasti)

2. **Fuzzy Matching** - Cari area yang mirip dengan Levenshtein Distance
   - Threshold: 70% similarity
   - Hasil: `Verified` (jika cocok)

3. **Naive Bayes Prediction** - Prediksi berdasarkan pattern belajar
   - Threshold confidence: 85%
   - Hasil: `Predicted` (prediksi berdasarkan ML)

### Response Format

```typescript
interface PredictionResponse {
  area?: string;              // Nama area yang dicari
  status: string;             // Status ketersediaan layanan
  confidence?: string;        // Confidence score (e.g., "78.45%")
  isVerified?: boolean;       // Apakah hasil verified atau predicted
  matchedArea?: string;       // Nama area yang cocok (untuk fuzzy match)
  error?: string;             // Pesan error jika ada
}
```

### Contoh Response

#### 1. Exact Match
```json
{
  "area": "Jakarta Selatan",
  "status": "Tersedia Layanan Jaringan CyberNet (Verified)",
  "confidence": "100.00%",
  "isVerified": true,
  "matchedArea": "Jakarta Selatan"
}
```

#### 2. Fuzzy Match
```json
{
  "area": "Jakartaa Selatan",
  "status": "Tersedia Layanan Jaringan CyberNet (Verified)",
  "confidence": "95.30%",
  "isVerified": true,
  "matchedArea": "Jakarta Selatan"
}
```

#### 3. Predicted
```json
{
  "area": "Jakarta Timur",
  "status": "Tersedia Layanan Jaringan CyberNet (Predicted)",
  "confidence": "87.45%",
  "isVerified": false
}
```

## 📊 Naive Bayes Classifier

### Algoritma

Menggunakan probabilitas Bayes untuk klasifikasi:

```
P(Class|Text) = P(Text|Class) × P(Class) / P(Text)
```

### Fitur

- **Laplace Smoothing** - Menangani kata-kata yang tidak ditemukan
- **Bag of Words** - Tokenisasi text sederhana dan efektif
- **Log Probability** - Menghindari numerical underflow

### Method

```typescript
// Add dokumen untuk training
classifier.addDocument(text: string, label: string): void

// Training (automatic saat addDocument)
classifier.train(): void

// Klasifikasi text baru
classifier.classify(text: string): string

// Dapatkan semua klasifikasi dengan score
classifier.getClassifications(text: string): ClassificationResult[]

// Info classifier
classifier.getDocumentCount(): number
classifier.getLabelCount(): number

// Reset classifier
classifier.reset(): void
```

## 🔧 Utilities & Functions

### Text Processing

```typescript
// Tokenize teks menjadi array of words
tokenize(text: string): string[]

// Bersihkan teks dengan rule khusus wilayah Indonesia
cleanTextSpecial(text: string): string

// Normalisasi nama ke Title Case
normalizeAreaName(area: string): string

// Hitung Levenshtein Distance
calculateLevenshteinDistance(str1: string, str2: string): number

// Hitung Similarity Score (0-1)
calculateSimilarity(str1: string, str2: string): number

// Cari area yang mirip (fuzzy matching)
findSimilarArea(
  input: string, 
  areas: LocationDoc[], 
  threshold?: number
): LocationDoc | null
```

## 📝 Contoh Implementasi Express.js

```typescript
import express from 'express';
import predictAvailability from './MachineLearning';

const app = express();
app.use(express.json());

// Simulasi data dari database
const dataWilayah = [
  { _id: '1', area: 'Jakarta Selatan', status: 'tersedia' },
  { _id: '2', area: 'Jakarta Utara', status: 'tidak_tersedia' },
  // ... data lainnya
];

app.post('/api/predict-availability', async (req, res) => {
  const { area } = req.body;

  const result = await predictAvailability(
    { area },
    dataWilayah
  );

  res.json(result);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## ⚡ Performance

### Perbandingan dengan library `natural`

| Aspek | Dengan `natural` | Pure Implementation |
|-------|-----------------|-------------------|
| Load time | ~200ms | ~1ms |
| Import type | `require` (CJS) | `import` (ESM) |
| Dependencies | 1 package | 0 packages |
| Bundle size | ~150KB | ~5KB |

## 🧪 Testing

```typescript
// Test BayesClassifier
const classifier = new BayesClassifier();

classifier.addDocument('good weather', 'positive');
classifier.addDocument('great day', 'positive');
classifier.addDocument('bad weather', 'negative');
classifier.addDocument('terrible day', 'negative');

classifier.train();

console.assert(
  classifier.classify('good day') === 'positive',
  'Should classify as positive'
);
```

## 📖 Type Definitions

```typescript
interface Location {
  _id: string;
  area: string;
  status: "tersedia" | "tidak_tersedia";
}

interface PredictionResponse {
  area?: string;
  status: string;
  confidence?: string;
  isVerified?: boolean;
  matchedArea?: string;
  error?: string;
}

interface ClassificationResult {
  label: string;
  value: number;
}
```

## 🎯 Best Practices

1. **Data Quality** - Pastikan data training berkualitas baik
2. **Threshold Tuning** - Sesuaikan threshold berdasarkan use case
3. **Regular Training** - Retrain classifier dengan data baru secara berkala
4. **Error Handling** - Selalu handle error response dari prediksi
5. **Caching** - Cache hasil prediksi untuk area yang sama

## 🔍 Troubleshooting

### Prediksi tidak akurat?
- Tambah lebih banyak training data
- Sesuaikan threshold confidence
- Periksa data quality

### Fuzzy matching tidak bekerja?
- Turunkan threshold similarity (dari 0.7 ke 0.6)
- Pastikan input sudah dinormalisasi
- Cek format data di database

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please submit pull requests or open issues for bugs/features.

---

**Dibuat dengan ❤️ untuk kemudahan development**
