import { tokenize } from "./tokenizer";
import { ClassificationResult } from "./types";

export default class BayesClassifier {
  private documents: { text: string; label: string }[] = [];
  private vocabulary = new Set<string>();
  private wordFrequency = new Map<string, Map<string, number>>();
  private classFrequency = new Map<string, number>();
  private totalWords = new Map<string, number>();
  private totalDocuments = 0;

  /**
   * Menambahkan dokumen untuk training
   * @param text - Teks dokumen
   * @param label - Label/kategori dokumen
   */
  addDocument(text: string, label: string): void {
    this.documents.push({ text, label });

    const tokens = tokenize(text);

    // Hitung frekuensi kelas
    this.classFrequency.set(label, (this.classFrequency.get(label) || 0) + 1);

    // Hitung frekuensi kata per kelas
    if (!this.wordFrequency.has(label)) {
      this.wordFrequency.set(label, new Map());
    }

    const classWords = this.wordFrequency.get(label)!;
    let wordCount = this.totalWords.get(label) || 0;

    tokens.forEach((token) => {
      this.vocabulary.add(token);
      classWords.set(token, (classWords.get(token) || 0) + 1);
      wordCount++;
    });

    this.totalWords.set(label, wordCount);
    this.totalDocuments++;
  }

  /**
   * Training classifier (dalam implementasi ini, cukup menginisialisasi)
   */
  train(): void {
    // Data sudah diproses saat addDocument dipanggil
    // Method ini ada untuk compatibility dengan natural library
  }

  /**
   * Mengklasifikasi teks baru
   * @param text - Teks yang akan diklasifikasi
   * @returns Label dengan probabilitas tertinggi
   */
  classify(text: string): string {
    const classifications = this.getClassifications(text);
    return classifications.length > 0 ? classifications[0].label : "tidak_tersedia";
  }

  /**
   * Mendapatkan semua klasifikasi dengan probabilitasnya
   * @param text - Teks yang akan diklasifikasi
   * @returns Array of classifications dengan score
   */
  getClassifications(text: string): ClassificationResult[] {
    const tokens = tokenize(text);
    const labels = Array.from(this.classFrequency.keys());

    const scores: ClassificationResult[] = labels.map((label) => {
      let score = this.calculateProbability(label, tokens);
      return {
        label,
        value: score,
      };
    });

    // Sort berdasarkan score descending
    return scores.sort((a, b) => b.value - a.value);
  }

  /**
   * Menghitung probabilitas Naive Bayes
   * P(Class|Text) = P(Text|Class) * P(Class) / P(Text)
   * Menggunakan log probability untuk menghindari underflow
   */
  private calculateProbability(label: string, tokens: string[]): number {
    const classFreq = this.classFrequency.get(label) || 1;
    const classProbability = classFreq / this.totalDocuments;

    let logProbability = Math.log(classProbability);
    const classWords = this.wordFrequency.get(label);
    const totalClassWords = this.totalWords.get(label) || 1;

    tokens.forEach((token) => {
      const wordFreq = classWords?.get(token) || 0;
      // Laplace smoothing untuk kata yang tidak ditemukan
      const smoothedFreq = (wordFreq + 1) / (totalClassWords + this.vocabulary.size);
      logProbability += Math.log(smoothedFreq);
    });

    // Convert dari log probability kembali ke probability
    return Math.exp(logProbability);
  }

  /**
   * Mendapatkan jumlah dokumen yang ditraining
   */
  getDocumentCount(): number {
    return this.totalDocuments;
  }

  /**
   * Mendapatkan jumlah label yang ada
   */
  getLabelCount(): number {
    return this.classFrequency.size;
  }

  /**
   * Reset classifier
   */
  reset(): void {
    this.documents = [];
    this.vocabulary.clear();
    this.wordFrequency.clear();
    this.classFrequency.clear();
    this.totalWords.clear();
    this.totalDocuments = 0;
  }
}