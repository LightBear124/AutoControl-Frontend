import { pipeline } from '@huggingface/transformers';

export type SimilarFlightItem = {
  id: number;
  flightNumber: string;
  terminalName: string;
  direction: 'arrival' | 'departure';
  routeName: string;
  flightDate: string;
  status: string;
};

let extractorPromise: Promise<any> | null = null;

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
  }

  return extractorPromise;
}

function buildFlightText(flight: SimilarFlightItem): string {
  return [
    `Рейс ${flight.flightNumber}`,
    `Терминал ${flight.terminalName}`,
    `Направление ${flight.direction === 'arrival' ? 'прилёт' : 'вылет'}`,
    `Маршрут ${flight.routeName}`,
    `Дата ${flight.flightDate}`,
    `Статус ${flight.status}`,
  ].join('. ');
}

function meanPool(matrix: number[][]): number[] {
  if (!matrix.length) {
    return [];
  }

  const dimension = matrix[0].length;
  const result = new Array<number>(dimension).fill(0);

  for (const row of matrix) {
    for (let i = 0; i < dimension; i += 1) {
      result[i] += row[i];
    }
  }

  for (let i = 0; i < dimension; i += 1) {
    result[i] /= matrix.length;
  }

  return result;
}

function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

  if (!norm) {
    return vector;
  }

  return vector.map((value) => value / norm);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let result = 0;

  for (let i = 0; i < a.length; i += 1) {
    result += a[i] * b[i];
  }

  return result;
}

async function embedText(text: string): Promise<number[]> {
  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  });

  if (Array.isArray(output?.data)) {
    return output.data as number[];
  }

  if (Array.isArray(output)) {
    return normalize(meanPool(output as number[][]));
  }

  if (output?.tolist) {
    const array = output.tolist();
    if (Array.isArray(array?.[0])) {
      return normalize(meanPool(array as number[][]));
    }
    if (Array.isArray(array)) {
      return normalize(array as number[]);
    }
  }

  return [];
}

export async function findSimilarFlights(
  currentFlight: SimilarFlightItem,
  allFlights: SimilarFlightItem[],
  limit = 3,
): Promise<SimilarFlightItem[]> {
  const candidates = allFlights.filter((flight) => flight.id !== currentFlight.id);

  if (candidates.length === 0) {
    return [];
  }

  const currentEmbedding = await embedText(buildFlightText(currentFlight));

  const scored = await Promise.all(
    candidates.map(async (flight) => {
      const embedding = await embedText(buildFlightText(flight));
      return {
        flight,
        score: cosineSimilarity(currentEmbedding, embedding),
      };
    }),
  );

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.flight);
}