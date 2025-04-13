// Sorting algorithms implementation
export type SortingAlgorithm = 
  | 'Bubble Sort' 
  | 'Selection Sort' 
  | 'Insertion Sort' 
  | 'Merge Sort' 
  | 'Quick Sort' 
  | 'Heap Sort'
  | 'Counting Sort'
  | 'Radix Sort'
  | 'Bucket Sort'
  | 'Shell Sort'
  | 'Tim Sort'
  | 'Comb Sort'
  | 'Pigeonhole Sort'
  | 'Cycle Sort'
  | 'Strand Sort'
  | 'Bitonic Sort'
  | 'Pancake Sort'
  | 'Bogo Sort'
  | 'Gnome Sort'
  | 'Stooge Sort'
  | 'Odd-Even Sort';

export type Distribution = 
  | 'Random'
  | 'Ascending'
  | 'Descending'
  | 'Split Ascending'
  | 'Split Descending';

export type SortEvent = {
  type: 'comparison' | 'swap' | 'update' | 'complete';
  indices: number[];
  array: number[];
};

export type SortGenerator = Generator<SortEvent, SortEvent, unknown>;

// Helper function to generate arrays based on distribution
export function generateArray(size: number, distribution: Distribution): number[] {
  const array = Array.from({ length: size }, (_, i) => i + 1);
  
  switch (distribution) {
    case 'Random':
      return shuffleArray([...array]);
    case 'Ascending':
      return [...array];
    case 'Descending':
      return [...array].reverse();
    case 'Split Ascending':
      const midpoint1 = Math.floor(size / 2);
      return [...array.slice(midpoint1), ...array.slice(0, midpoint1)];
    case 'Split Descending':
      const midpoint2 = Math.floor(size / 2);
      return [...array.slice(midpoint2).reverse(), ...array.slice(0, midpoint2).reverse()];
    default:
      return shuffleArray([...array]);
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Bubble Sort
export function* bubbleSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison event
      yield { type: 'comparison', indices: [j, j + 1], array: [...arr] };
      
      if (arr[j] > arr[j + 1]) {
        // Swap event
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', indices: [j, j + 1], array: [...arr] };
      }
    }
  }
  
  return { type: 'complete', indices: [], array: arr };
}

// Selection Sort
export function* selectionSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      // Comparison event
      yield { type: 'comparison', indices: [minIndex, j], array: [...arr] };
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      // Swap event
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      yield { type: 'swap', indices: [i, minIndex], array: [...arr] };
    }
  }
  
  return { type: 'complete', indices: [], array: arr };
}

// Insertion Sort
export function* insertionSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0) {
      // Comparison event
      yield { type: 'comparison', indices: [j, j + 1], array: [...arr] };
      
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        yield { type: 'update', indices: [j + 1], array: [...arr] };
        j--;
      } else {
        break;
      }
    }
    
    arr[j + 1] = key;
    yield { type: 'update', indices: [j + 1], array: [...arr] };
  }
  
  return { type: 'complete', indices: [], array: arr };
}

// Merge Sort
export function* mergeSort(array: number[]): SortGenerator {
  const arr = [...array];
  
  yield* mergeSortHelper(arr, 0, arr.length - 1);
  
  return { type: 'complete', indices: [], array: arr };
}

function* mergeSortHelper(arr: number[], left: number, right: number): Generator<SortEvent, void, unknown> {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    yield* mergeSortHelper(arr, left, mid);
    yield* mergeSortHelper(arr, mid + 1, right);
    yield* merge(arr, left, mid, right);
  }
}

function* merge(arr: number[], left: number, mid: number, right: number): Generator<SortEvent, void, unknown> {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  const L = new Array(n1);
  const R = new Array(n2);
  
  for (let i = 0; i < n1; i++) {
    L[i] = arr[left + i];
  }
  
  for (let j = 0; j < n2; j++) {
    R[j] = arr[mid + 1 + j];
  }
  
  let i = 0;
  let j = 0;
  let k = left;
  
  while (i < n1 && j < n2) {
    yield { type: 'comparison', indices: [left + i, mid + 1 + j], array: [...arr] };
    
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    
    yield { type: 'update', indices: [k], array: [...arr] };
    k++;
  }
  
  while (i < n1) {
    arr[k] = L[i];
    yield { type: 'update', indices: [k], array: [...arr] };
    i++;
    k++;
  }
  
  while (j < n2) {
    arr[k] = R[j];
    yield { type: 'update', indices: [k], array: [...arr] };
    j++;
    k++;
  }
}

// Quick Sort
export function* quickSort(array: number[]): SortGenerator {
  const arr = [...array];
  
  yield* quickSortHelper(arr, 0, arr.length - 1);
  
  return { type: 'complete', indices: [], array: arr };
}

function* quickSortHelper(arr: number[], low: number, high: number): Generator<SortEvent, void, unknown> {
  if (low < high) {
    const pivotIndex = yield* partition(arr, low, high);
    
    yield* quickSortHelper(arr, low, pivotIndex - 1);
    yield* quickSortHelper(arr, pivotIndex + 1, high);
  }
}

function* partition(arr: number[], low: number, high: number): Generator<SortEvent, number, unknown> {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    yield { type: 'comparison', indices: [j, high], array: [...arr] };
    
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: 'swap', indices: [i, j], array: [...arr] };
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { type: 'swap', indices: [i + 1, high], array: [...arr] };
  
  return i + 1;
}

// Heap Sort
export function* heapSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { type: 'swap', indices: [0, i], array: [...arr] };
    
    yield* heapify(arr, i, 0);
  }
  
  return { type: 'complete', indices: [], array: arr };
}

function* heapify(arr: number[], n: number, i: number): Generator<SortEvent, void, unknown> {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n) {
    yield { type: 'comparison', indices: [largest, left], array: [...arr] };
    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }
  
  if (right < n) {
    yield { type: 'comparison', indices: [largest, right], array: [...arr] };
    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { type: 'swap', indices: [i, largest], array: [...arr] };
    
    yield* heapify(arr, n, largest);
  }
}

// Counting Sort
export function* countingSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(n).fill(0);
  
  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    yield { type: 'update', indices: [i], array: [...arr] };
  }
  
  // Calculate cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
    yield { type: 'update', indices: [i, count[arr[i]]], array: [...arr] };
  }
  
  // Copy output array to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { type: 'update', indices: [i], array: [...arr] };
  }
  
  return { type: 'complete', indices: [], array: arr };
}

// Get sorting algorithm by name
export function getSortingAlgorithm(name: SortingAlgorithm): (array: number[]) => SortGenerator {
  const algorithms: Record<SortingAlgorithm, (array: number[]) => SortGenerator> = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Insertion Sort': insertionSort,
    'Merge Sort': mergeSort,
    'Quick Sort': quickSort,
    'Heap Sort': heapSort,
    'Counting Sort': countingSort,
    'Radix Sort': bubbleSort, // Placeholder, implement later
    'Bucket Sort': bubbleSort, // Placeholder, implement later
    'Shell Sort': bubbleSort, // Placeholder, implement later
    'Tim Sort': bubbleSort, // Placeholder, implement later
    'Comb Sort': bubbleSort, // Placeholder, implement later
    'Pigeonhole Sort': bubbleSort, // Placeholder, implement later
    'Cycle Sort': bubbleSort, // Placeholder, implement later
    'Strand Sort': bubbleSort, // Placeholder, implement later
    'Bitonic Sort': bubbleSort, // Placeholder, implement later
    'Pancake Sort': bubbleSort, // Placeholder, implement later
    'Bogo Sort': bubbleSort, // Placeholder, implement later
    'Gnome Sort': bubbleSort, // Placeholder, implement later
    'Stooge Sort': bubbleSort, // Placeholder, implement later
    'Odd-Even Sort': bubbleSort, // Placeholder, implement later
  };
  
  return algorithms[name];
}

// List of all available sorting algorithms
export const SORTING_ALGORITHMS: SortingAlgorithm[] = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Merge Sort',
  'Quick Sort',
  'Heap Sort',
  'Counting Sort',
  'Radix Sort',
  'Bucket Sort',
  'Shell Sort',
  'Tim Sort',
  'Comb Sort',
  'Pigeonhole Sort',
  'Cycle Sort',
  'Strand Sort',
  'Bitonic Sort',
  'Pancake Sort',
  'Bogo Sort',
  'Gnome Sort',
  'Stooge Sort',
  'Odd-Even Sort'
];

// List of all available distributions
export const DISTRIBUTIONS: Distribution[] = [
  'Random',
  'Ascending',
  'Descending',
  'Split Ascending',
  'Split Descending'
];
