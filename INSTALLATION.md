# 📦 Installation & Setup Guide

## Quick Start

### 1. Copy folder ke project Anda

```bash
# Copy seluruh folder MachineLearning ke project Anda
cp -r MachineLearning /path/to/your/project/
```

### 2. Import di kode Anda

```typescript
import predictAvailability, { BayesClassifier } from './MachineLearning';
```

### 3. Gunakan

```typescript
const result = await predictAvailability(
  { area: 'Jakarta Selatan' },
  dataWilayah
);
```

Done! ✅ Tidak perlu install dependencies apa pun!

---

## 📋 Requirements

- **Node.js**: ≥ 14.0.0
- **TypeScript**: ≥ 4.0 (optional, untuk TypeScript projects)
- **Dependencies**: NONE ✨

---

## 🔧 Setup untuk TypeScript Project

### 1. Copy folder MachineLearning

```bash
your-project/
├── src/
│   ├── MachineLearning/
│   │   ├── BayesClassifier.ts
│   │   ├── index.ts
│   │   ├── tokenizer.ts
│   │   ├── types.ts
│   │   └── ...
│   └── app.ts
└── package.json
```

### 2. Update `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  }
}
```

### 3. Gunakan di `src/app.ts`

```typescript
import predictAvailability from './MachineLearning';

async function main() {
  const result = await predictAvailability(
    { area: 'Jakarta' },
    dataWilayah
  );
  console.log(result);
}

main();
```

### 4. Compile

```bash
npx tsc
```

---

## 🔧 Setup untuk JavaScript Project (Vanilla)

Jika menggunakan vanilla JavaScript (transpile dengan Babel):

### 1. Copy folder (tanpa .ts extension)

Atau jika menggunakan Babel, file `.ts` akan otomatis di-handle.

### 2. Setup Babel

```bash
npm install --save-dev @babel/core @babel/preset-typescript
```

**.babelrc:**
```json
{
  "presets": ["@babel/preset-typescript"]
}
```

### 3. Gunakan

```javascript
import predictAvailability from './MachineLearning/index.ts';

const result = await predictAvailability(
  { area: 'Jakarta' },
  dataWilayah
);
```

---

## 🔧 Setup untuk Express.js Server

### 1. Install dependencies

```bash
npm install express ts-node typescript @types/express @types/node
```

### 2. Copy folder MachineLearning

```
your-express-app/
├── MachineLearning/
├── server.ts
└── package.json
```

### 3. Gunakan Express integration

```typescript
import express from 'express';
import predictAvailability from './MachineLearning';

const app = express();

app.post('/api/predict', async (req, res) => {
  const result = await predictAvailability(
    { area: req.body.area },
    dataWilayah
  );
  res.json(result);
});

app.listen(3000);
```

### 4. Run server

```bash
npx ts-node server.ts
```

---

## 🔧 Setup untuk Next.js

### 1. Copy folder ke `src/lib/`

```
your-nextjs-app/
├── src/
│   ├── lib/
│   │   └── MachineLearning/
│   └── pages/
└── package.json
```

### 2. Gunakan di API route

```typescript
// src/pages/api/predict.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import predictAvailability from '@/lib/MachineLearning';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const result = await predictAvailability(
    { area: req.body.area },
    dataWilayah
  );

  res.status(200).json(result);
}
```

### 3. Gunakan dari client

```typescript
// src/components/PredictionForm.tsx
'use client';

import { useState } from 'react';

export default function PredictionForm() {
  const [area, setArea] = useState('');
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <input
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Enter area name"
      />
      <button onClick={handlePredict}>Predict</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

---

## 🔧 Setup untuk React

### 1. Copy folder ke `src/lib/`

```
your-react-app/
├── src/
│   ├── lib/
│   │   └── MachineLearning/
│   └── App.tsx
└── package.json
```

### 2. Create custom hook

```typescript
// src/hooks/usePrediction.ts
import { useState } from 'react';
import predictAvailability from '@/lib/MachineLearning';

export function usePrediction(dataWilayah: any[]) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const predict = async (area: string) => {
    setLoading(true);
    try {
      const result = await predictAvailability(
        { area },
        dataWilayah
      );
      setResult(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { predict, loading, result, error };
}
```

### 3. Gunakan di component

```typescript
// src/components/PredictionForm.tsx
import { useState } from 'react';
import { usePrediction } from '@/hooks/usePrediction';

export function PredictionForm({ dataWilayah }) {
  const [area, setArea] = useState('');
  const { predict, loading, result } = usePrediction(dataWilayah);

  return (
    <div>
      <input
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Enter area"
      />
      <button onClick={() => predict(area)} disabled={loading}>
        {loading ? 'Predicting...' : 'Predict'}
      </button>
      {result && (
        <div>
          <p>Status: {result.status}</p>
          <p>Confidence: {result.confidence}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 Setup untuk Webpack Project

### 1. Ensure Webpack supports ES6 imports

**webpack.config.js:**
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
```

### 2. Copy folder

```
your-webpack-app/
├── src/
│   ├── MachineLearning/
│   └── index.ts
└── webpack.config.js
```

### 3. Import dan gunakan

```typescript
import predictAvailability from './MachineLearning';
```

---

## 🔧 Setup untuk Vite

### 1. Copy folder

```
your-vite-app/
├── src/
│   ├── lib/
│   │   └── MachineLearning/
│   └── main.ts
└── vite.config.ts
```

### 2. Gunakan

```typescript
import predictAvailability from '@/lib/MachineLearning';

await predictAvailability(
  { area: 'Jakarta' },
  dataWilayah
);
```

---

## 📝 Verifikasi Instalasi

Jalankan test sederhana:

```typescript
import BayesClassifier from './MachineLearning/BayesClassifier';

// Test classifier
const classifier = new BayesClassifier();
classifier.addDocument('good', 'positive');
classifier.addDocument('bad', 'negative');
classifier.train();

const result = classifier.classify('good');
console.assert(result === 'positive', 'Classification failed');
console.log('✅ MachineLearning library is working!');
```

---

## ❓ Troubleshooting

### Issue 1: Module not found

**Error:** `Cannot find module './MachineLearning'`

**Solution:** Pastikan path import sesuai dengan lokasi folder

```typescript
// Jika di src/MachineLearning/
import ML from './MachineLearning';

// Jika di src/lib/MachineLearning/
import ML from './lib/MachineLearning';

// Dengan alias (tsconfig)
import ML from '@/MachineLearning';
```

### Issue 2: TypeScript errors

**Error:** `Cannot find type definition`

**Solution:** Pastikan file `.ts` ada dan tsconfig.json correct

```json
{
  "compilerOptions": {
    "lib": ["ES2020"],
    "target": "ES2020"
  }
}
```

### Issue 3: Import errors in Node.js

**Error:** `SyntaxError: Cannot use import statement outside a module`

**Solution:** Gunakan `type: "module"` di package.json

```json
{
  "type": "module",
  "name": "your-app"
}
```

### Issue 4: Performance issues

**Error:** Predictions are slow

**Solution:** 
- Jangan retrain classifier setiap kali, cache hasilnya
- Gunakan batch processing untuk multiple predictions
- Optimalkan database query

---

## 📚 Next Steps

1. Baca [README.md](./README.md) untuk dokumentasi lengkap
2. Lihat [examples.ts](./examples.ts) untuk contoh penggunaan
3. Bandingkan dengan [COMPARISON.md](./COMPARISON.md)
4. Deploy dan enjoy! 🚀

---

## 🆘 Support

Jika ada pertanyaan:

1. Baca dokumentasi di README.md
2. Lihat contoh di examples.ts
3. Check troubleshooting section
4. Inspect error message dengan detail

---

**Selamat menggunakan MachineLearning library! 🎉**
