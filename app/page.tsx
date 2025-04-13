'use client';

import { useState, useEffect, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import VisualizationArea from './components/VisualizationArea';
import useAudio from './hooks/useAudio';
import { 
  SortingAlgorithm, 
  Distribution, 
  generateArray, 
  getSortingAlgorithm,
  SortEvent
} from './utils/sortingAlgorithms';

export default function Home() {
  // State for configuration
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('Bubble Sort');
  const [elementCount, setElementCount] = useState<number>(30);
  const [distribution, setDistribution] = useState<Distribution>('Random');
  
  // State for visualization
  const [array, setArray] = useState<number[]>([]);
  const [comparisonIndices, setComparisonIndices] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // State for controls
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  // Refs for animation
  const sortingRef = useRef<boolean>(false);
  const pausedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const generatorRef = useRef<Iterator<SortEvent, SortEvent, unknown> | null>(null);
  
  // Audio hook
  const { playComparisonSound, isEnabled: isAudioEnabled, toggleAudio } = useAudio();
  
  // Initialize array
  useEffect(() => {
    resetArray();
  }, [elementCount, distribution]);
  
  const resetArray = () => {
    const newArray = generateArray(elementCount, distribution);
    setArray(newArray);
    setComparisonIndices([]);
    setComparisons(0);
    setTimeElapsed(0);
    setIsComplete(false);
    elapsedTimeRef.current = 0;
  };
  
  const startSorting = () => {
    if (isSorting && isPaused) {
      // Resume sorting
      setIsPaused(false);
      pausedRef.current = false;
      startTimeRef.current = performance.now() - elapsedTimeRef.current * 1000;
      requestAnimationStep();
    } else if (!isSorting) {
      // Start new sorting
      setIsSorting(true);
      setIsComplete(false);
      sortingRef.current = true;
      pausedRef.current = false;
      
      // Get the sorting algorithm
      const sortAlgorithm = getSortingAlgorithm(algorithm);
      generatorRef.current = sortAlgorithm(array);
      
      // Reset metrics
      setComparisons(0);
      setTimeElapsed(0);
      elapsedTimeRef.current = 0;
      startTimeRef.current = performance.now();
      
      // Start animation
      requestAnimationStep();
    }
  };
  
  const pauseSorting = () => {
    if (isSorting && !isPaused) {
      setIsPaused(true);
      pausedRef.current = true;
      
      // Store elapsed time
      elapsedTimeRef.current = (performance.now() - startTimeRef.current) / 1000;
      
      // Cancel animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };
  
  const resetSorting = () => {
    // Cancel animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset state
    setIsSorting(false);
    setIsPaused(false);
    setIsComplete(false);
    sortingRef.current = false;
    pausedRef.current = false;
    generatorRef.current = null;
    
    // Reset array and metrics
    resetArray();
  };
  
  const requestAnimationStep = () => {
    if (!sortingRef.current || pausedRef.current) return;
    
    animationFrameRef.current = requestAnimationFrame(animationStep);
  };
  
  const animationStep = () => {
    if (!generatorRef.current || !sortingRef.current || pausedRef.current) return;
    
    try {
      // Get next step from generator
      const result = generatorRef.current.next();
      
      if (!result.done) {
        const { type, indices, array: newArray } = result.value;
        
        // Update array
        setArray(newArray);
        
        // Update comparison indices
        setComparisonIndices(indices);
        
        // Update metrics
        if (type === 'comparison') {
          setComparisons(prev => prev + 1);
          
          // Play sound for comparison
          if (indices.length >= 2) {
            playComparisonSound(newArray[indices[0]], elementCount);
          }
        }
        
        // Update time elapsed
        const currentTime = performance.now();
        const elapsed = (currentTime - startTimeRef.current) / 1000;
        setTimeElapsed(elapsed);
        elapsedTimeRef.current = elapsed;
        
        // Request next animation frame with delay based on array size
        // Smaller arrays should animate faster
        const delay = Math.max(10, 50 - elementCount / 10);
        setTimeout(() => {
          requestAnimationStep();
        }, delay);
      } else {
        // Sorting complete
        const { array: finalArray } = result.value;
        setArray(finalArray);
        setComparisonIndices([]);
        setIsSorting(false);
        setIsComplete(true);
        sortingRef.current = false;
        
        // Final time update
        const currentTime = performance.now();
        const elapsed = (currentTime - startTimeRef.current) / 1000;
        setTimeElapsed(elapsed);
        elapsedTimeRef.current = elapsed;
      }
    } catch (error) {
      console.error('Error during sorting animation:', error);
      setIsSorting(false);
      sortingRef.current = false;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sorting Algorithm Visualizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1">
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            elementCount={elementCount}
            setElementCount={setElementCount}
            distribution={distribution}
            setDistribution={setDistribution}
            isAudioEnabled={isAudioEnabled}
            toggleAudio={toggleAudio}
            isSorting={isSorting}
            isPaused={isPaused}
            onStart={startSorting}
            onPause={pauseSorting}
            onReset={resetSorting}
          />
        </div>
        
        {/* Right Panel - Visualization */}
        <div className="lg:col-span-2 h-[70vh]">
          <VisualizationArea
            array={array}
            elementCount={elementCount}
            algorithm={algorithm}
            comparisonIndices={comparisonIndices}
            comparisons={comparisons}
            timeElapsed={timeElapsed}
            isSorting={isSorting}
            isComplete={isComplete}
          />
        </div>
      </div>
    </main>
  );
}
