# Digital Looper Project

## Overview

This project implements a digital audio looper using Next.js and the Web Audio API. It aims to replicate the functionality of hardware loopstations in a web browser environment. The application allows users to record, play, and layer multiple audio tracks in real-time.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Components](#components)
4. [State Management](#state-management)
5. [Audio Processing](#audio-processing)
6. [User Interface](#user-interface)
7. [Future Enhancements](#future-enhancements)
8. [Getting Started](#getting-started)

## Features

The current implementation includes the following features:

- Multi-track recording (up to 4 separate audio tracks)
- Independent record, play, and stop functions for each track
- Dynamic addition and removal of tracks
- Volume control for each track
- Global play all and stop all functions
- Basic waveform visualization
- Responsive design (primarily for desktop use)

## Architecture

The application is built using the following technologies:

- **Next.js**: React framework for building the user interface and handling routing
- **Web Audio API**: For low-latency audio processing and playback
- **React Hooks**: For state management and side effects
- **CSS-in-JS**: Styling using styled-jsx (built into Next.js)

The architecture follows a component-based structure, with the main application logic residing in the `pages/index.js` file. Audio processing is handled through the Web Audio API, with visualizations rendered using the Canvas API.

## Components

### 1. Home Component (`pages/index.js`)

This is the main component that orchestrates the entire application. It manages the overall state, including:
- Track management (adding, removing, updating)
- Global playback controls
- Audio context and analyzer setup

### 2. Track Component (`components/Track.js`)

Represents an individual audio track. Each track is responsible for:
- Recording audio input
- Playing back recorded audio
- Controlling track volume
- Handling track activation and removal

### 3. WaveformVisualizer Component (`components/WaveformVisualizer.js`)

Provides a visual representation of the audio output. It:
- Renders a waveform using the Canvas API
- Updates in real-time based on the audio analyzer data

## State Management

The application uses React's built-in state management through the `useState` hook. The main state is managed in the Home component and includes:

- `tracks`: An array of track objects, each containing:
  - `id`: Unique identifier for the track
  - `recording`: AudioBuffer of the recorded audio
  - `isRecording`: Boolean indicating if the track is currently recording
  - `isPlaying`: Boolean indicating if the track is currently playing
  - `volume`: Number representing the track's volume level
- `activeTrack`: ID of the currently active track
- `status`: String representing the current status of the looper

State is passed down to child components as props, and updates are handled through callback functions.

## Audio Processing

Audio processing is handled using the Web Audio API. Key aspects include:

- `AudioContext`: Created and managed in the Home component
- `MediaRecorder`: Used for capturing audio input in each Track component
- `AudioBufferSourceNode`: Used for playing back recorded audio
- `GainNode`: Used for controlling the volume of each track
- `AnalyserNode`: Used for generating data for the waveform visualization

## User Interface

The user interface is built using Next.js and React components. It features:

- A main container for the looper interface
- Individual track controls (record, play, stop, volume)
- Global controls (play all, stop all)
- Status display
- Waveform visualization

Styling is done using CSS-in-JS with styled-jsx, allowing for component-scoped styles.

## Future Enhancements

Planned future enhancements include:

1. Enhanced loop control (quantization, loop length setting)
2. Advanced audio features (overdubbing, undo/redo, click track)
3. Effects processing
4. Extended playback controls
5. Improved visual feedback
6. MIDI integration
7. Save and recall functionality
8. Performance features (one-shot samples, scenes)
9. Advanced mixing capabilities
10. Hardware integration
11. Mobile optimization
12. Accessibility improvements
13. Advanced routing options
14. Enhanced visualizations
15. AI-assisted features

## Getting Started

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Contributions to the project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your fork
5. Submit a pull request

## License

[MIT License](LICENSE)

---

This README provides an overview of the current state of the Digital Looper project. As the project evolves, this document should be updated to reflect new features, architectural changes, and development guidelines.