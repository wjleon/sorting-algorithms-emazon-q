'use client';

import React, { useState, useEffect } from 'react';
import { SORTING_ALGORITHMS, DISTRIBUTIONS, SortingAlgorithm, Distribution } from '../utils/sortingAlgorithms';

interface ControlPanelProps {
  algorithm: SortingAlgorithm;
  setAlgorithm: (algorithm: SortingAlgorithm) => void;
  elementCount: number;
  setElementCount: (count: number) => void;
  distribution: Distribution;
  setDistribution: (distribution: Distribution) => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  isSorting: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  elementCount,
  setElementCount,
  distribution,
  setDistribution,
  isAudioEnabled,
  toggleAudio,
  isSorting,
  isPaused,
  onStart,
  onPause,
  onReset
}) => {
  const [inputValue, setInputValue] = useState<string>(elementCount.toString());
  
  // Update input value when elementCount changes externally
  useEffect(() => {
    setInputValue(elementCount.toString());
  }, [elementCount]);

  const handleElementCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleElementCountBlur = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 10 && value <= 200) {
      setElementCount(value);
    } else {
      // Reset to previous valid value if input is invalid
      setInputValue(elementCount.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleElementCountBlur();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Configuration</h2>
      
      {/* Algorithm Selection */}
      <div className="mb-4">
        <label htmlFor="algorithm" className="block text-sm font-medium text-black mb-1">
          Choose Sorting Algorithm
        </label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
          disabled={isSorting}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          {SORTING_ALGORITHMS.map((algo) => (
            <option key={algo} value={algo} className="text-black">
              {algo}
            </option>
          ))}
        </select>
      </div>
      
      {/* Element Count */}
      <div className="mb-4">
        <label htmlFor="elementCount" className="block text-sm font-medium text-black mb-1">
          Number of Elements (10-200)
        </label>
        <input
          id="elementCount"
          type="text"
          value={inputValue}
          onChange={handleElementCountChange}
          onBlur={handleElementCountBlur}
          onKeyDown={handleKeyDown}
          disabled={isSorting}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
      
      {/* Distribution */}
      <div className="mb-4">
        <p className="block text-sm font-medium text-black mb-1">Distribution of Elements</p>
        <div className="space-y-2">
          {DISTRIBUTIONS.map((dist) => (
            <div key={dist} className="flex items-center">
              <input
                id={`dist-${dist}`}
                type="radio"
                name="distribution"
                value={dist}
                checked={distribution === dist}
                onChange={() => setDistribution(dist)}
                disabled={isSorting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`dist-${dist}`} className="ml-2 text-sm text-black">
                {dist}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Audio Toggle */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            id="audio-toggle"
            type="checkbox"
            checked={isAudioEnabled}
            onChange={toggleAudio}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="audio-toggle" className="ml-2 text-sm text-black">
            Enable Audio Feedback
          </label>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onStart}
          disabled={isSorting && !isPaused}
          className={`px-4 py-2 rounded-md ${
            isSorting && !isPaused
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isPaused ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={onPause}
          disabled={!isSorting || isPaused}
          className={`px-4 py-2 rounded-md ${
            !isSorting || isPaused
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          Pause
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
