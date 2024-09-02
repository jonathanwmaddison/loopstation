'use client';

import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Track from '../components/Track';
import WaveformVisualizer from '../components/WaveformVisualizer';

const MAX_TRACKS = 4;

interface TrackData {
  id: number;
  recording: AudioBuffer | null;
  isRecording: boolean;
  isPlaying: boolean;
  volume: number;
  source?: AudioBufferSourceNode;
}

export default function Home() {
  const [tracks, setTracks] = useState<TrackData[]>([
    { id: 1, recording: null, isRecording: false, isPlaying: false, volume: 1 }
  ]);
  const [activeTrack, setActiveTrack] = useState<number>(1);
  const [status, setStatus] = useState<string>('Ready');

  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.connect(audioContext.current.destination);
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const addTrack = () => {
    if (tracks.length < MAX_TRACKS) {
      setTracks([...tracks, { id: tracks.length + 1, recording: null, isRecording: false, isPlaying: false, volume: 1 }]);
    }
  };

  const removeTrack = (id: number) => {
    setTracks(tracks.filter(track => track.id !== id));
    if (activeTrack === id) {
      setActiveTrack(tracks[0].id);
    }
  };

  const updateTrack = (id: number, updates: Partial<TrackData>) => {
    setTracks(tracks.map(track => track.id === id ? { ...track, ...updates } : track));
  };

  const playAllTracks = () => {
    if (!audioContext.current || !analyser.current) return;

    tracks.forEach(track => {
      if (track.recording) {
        const source = audioContext.current!.createBufferSource();
        source.buffer = track.recording;
        const gainNode = audioContext.current!.createGain();
        gainNode.gain.setValueAtTime(track.volume, audioContext.current!.currentTime);
        source.connect(gainNode);
        gainNode.connect(analyser.current!);
        source.loop = true;
        source.start();
        updateTrack(track.id, { isPlaying: true, source });
      }
    });
    setStatus('Playing all tracks');
  };

  const stopAllTracks = () => {
    tracks.forEach(track => {
      if (track.isPlaying && track.source) {
        track.source.stop();
        updateTrack(track.id, { isPlaying: false, source: undefined });
      }
    });
    setStatus('All tracks stopped');
  };

  return (
    <div>
      <Head>
        <title>Next.js Multi-Track Looper</title>
        <meta name="description" content="A multi-track audio looper built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <h1>Next.js Multi-Track Looper</h1>
        <div className="looper">
          {tracks.map(track => (
            <Track
              key={track.id}
              {...track}
              isActive={activeTrack === track.id}
              onRecord={(buffer: AudioBuffer) => updateTrack(track.id, { recording: buffer, isRecording: false })}
              onPlay={() => updateTrack(track.id, { isPlaying: true })}
              onStop={() => updateTrack(track.id, { isPlaying: false })}
              onVolumeChange={(volume: number) => updateTrack(track.id, { volume })}
              onActivate={() => setActiveTrack(track.id)}
              onRemove={() => removeTrack(track.id)}
              audioContext={audioContext.current}
              analyser={analyser.current}
            />
          ))}
          {tracks.length < MAX_TRACKS && (
            <button onClick={addTrack} className="btn btn-secondary">Add Track</button>
          )}
          <div className="global-controls">
            <button onClick={playAllTracks} className="btn btn-primary">Play All</button>
            <button onClick={stopAllTracks} className="btn btn-primary">Stop All</button>
          </div>
          <div className="status">{status}</div>
          <WaveformVisualizer analyser={analyser.current} />
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        .looper {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          text-align: center;
          width: 80%;
          max-width: 800px;
        }
        .btn {
          margin: 5px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          color: white;
          border: none;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .btn-primary {
          background-color: #0070f3;
        }
        .btn-secondary {
          background-color: #6c757d;
        }
        .global-controls {
          margin-top: 20px;
        }
        .status {
          margin-top: 20px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}