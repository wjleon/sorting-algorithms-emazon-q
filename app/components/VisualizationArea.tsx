'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SortingAlgorithm } from '../utils/sortingAlgorithms';
import useWindowSize from '../hooks/useWindowSize';

interface VisualizationAreaProps {
  array: number[];
  elementCount: number;
  algorithm: SortingAlgorithm;
  comparisonIndices: number[];
  comparisons: number;
  timeElapsed: number;
  isComplete: boolean;
}

const VisualizationArea: React.FC<VisualizationAreaProps> = ({
  array,
  elementCount,
  algorithm,
  comparisonIndices,
  comparisons,
  timeElapsed,
  isComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState<number>(4);
  const windowSize = useWindowSize();
  
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...array, elementCount);
  
  // Recalculate bar width when container size or element count changes
  useEffect(() => {
    const updateBarWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Calculate width to ensure bars are together with minimal spacing
        const calculatedWidth = Math.max(2, (containerWidth - 20) / elementCount - 1);
        setBarWidth(calculatedWidth);
      }
    };
    
    updateBarWidth();
    
    // Create a ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(updateBarWidth);
    const currentRef = containerRef.current; // Store ref value in a variable
    
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
      resizeObserver.disconnect();
    };
  }, [elementCount, windowSize]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      {/* Main Title */}
      <h1 className="text-2xl font-bold mb-4 text-center text-black">
        Sorting Algorithms Motion Showcase by{' '}
        <Link href="https://medium.com/@wjleon" className="text-blue-600 hover:underline">
          Wilmer Leon
        </Link>
      </h1>
      
      {/* Subtitle */}
      <h2 className="text-xl font-bold mb-2 text-center text-black">
        Sorting {elementCount} Elements with {algorithm} - Made with Amazon Q
      </h2>
      
      {/* Metrics */}
      <div className="flex justify-between mb-4 text-sm text-black">
        <div>Number of Comparisons: {comparisons}</div>
        <div>Time Elapsed: {timeElapsed.toFixed(3)} seconds</div>
      </div>
      
      {/* Visualization Container */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-end justify-center border border-gray-200 rounded-md p-2 bg-gray-50"
      >
        {array.map((value, index) => (
          <div
            key={index}
            className={`transition-all duration-100 ${
              comparisonIndices.includes(index)
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{
              height: `${(value / maxValue) * 100}%`,
              width: `${barWidth}px`,
              margin: '0 0.5px'
            }}
          />
        ))}
      </div>
      
      {/* Completion Message */}
      {isComplete && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
          <span className="text-black">
            Finished sorting {elementCount} elements with {algorithm}. 
            Number of comparisons: {comparisons}, Time: {timeElapsed.toFixed(3)} seconds.
          </span>
        </div>
      )}
    </div>
  );
};

export default VisualizationArea;
