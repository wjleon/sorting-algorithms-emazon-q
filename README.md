# Sorting Algorithm Visualizer

An interactive web application to visualize how sorting algorithms work, built with Next.js and TypeScript.

## Features

- Visualize multiple sorting algorithms in real-time
- Configure the number of elements and their initial distribution
- Track metrics like comparison count and elapsed time
- Audio feedback for comparisons and swaps
- Responsive design with Tailwind CSS

## Supported Sorting Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Counting Sort
- And many more!

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sorting-algorithm-visualizer.git
cd sorting-algorithm-visualizer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Select a sorting algorithm from the dropdown menu
2. Set the number of elements (10-200)
3. Choose the initial distribution of elements
4. Click "Start" to begin the visualization
5. Use "Pause" and "Reset" buttons to control the animation
6. Toggle audio feedback on/off as desired

## Project Structure

```
sorting-battle/
├── app/
│   ├── components/
│   │   ├── ControlPanel.tsx
│   │   └── VisualizationArea.tsx
│   ├── hooks/
│   │   └── useAudio.ts
│   ├── utils/
│   │   └── sortingAlgorithms.ts
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various sorting algorithm visualizers
- Built with Next.js and Tailwind CSS
