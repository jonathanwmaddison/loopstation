'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from './ui/button'
import { Slider } from './ui/slider'

interface TrackProps {
  id: number
  isActive: boolean
  isRecording: boolean
  isPlaying: boolean
  volume: number
  onRecord: (buffer: AudioBuffer) => void
  onPlay: () => void
  onStop: () => void
  onVolumeChange: (volume: number) => void
  onActivate: () => void
  onRemove: () => void
  audioContext: AudioContext | null
  analyser: AnalyserNode | null
}

const Track: React.FC<TrackProps> = ({
  id,
  isActive,
  isRecording,
  isPlaying,
  volume,
  onRecord,
  onPlay,
  onStop,
  onVolumeChange,
  onActivate,
  onRemove,
  audioContext,
  analyser
}) => {
  const [localIsRecording, setLocalIsRecording] = useState<boolean>(isRecording)
  const [localIsPlaying, setLocalIsPlaying] = useState<boolean>(isPlaying)
  const [localVolume, setLocalVolume] = useState<number>(volume)
  const recorder = useRef<MediaRecorder | null>(null)
  const source = useRef<AudioBufferSourceNode | null>(null)

  const startRecording = async () => {
    if (!audioContext) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      recorder.current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      recorder.current.ondataavailable = (e: BlobEvent) => chunks.push(e.data)
      recorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const arrayBuffer = await blob.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        onRecord(audioBuffer)
      }
      recorder.current.start()
      setLocalIsRecording(true)
    } catch (err) {
      console.error('Error starting recording:', err)
    }
  }

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stop()
      setLocalIsRecording(false)
    }
  }

  const playTrack = () => {
    if (!audioContext || !analyser || !source.current) return

    source.current = audioContext.createBufferSource()
    source.current.buffer = audioBuffer
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(localVolume, audioContext.currentTime)
    source.current.connect(gainNode)
    gainNode.connect(analyser)
    source.current.loop = true
    source.current.start()
    setLocalIsPlaying(true)
    onPlay()
  }

  const stopTrack = () => {
    if (source.current) {
      source.current.stop()
      setLocalIsPlaying(false)
      onStop()
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setLocalVolume(newVolume)
    onVolumeChange(newVolume)
  }

  return (
    <Card className={`${isActive ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Track {id}</h3>
        <div className="flex space-x-2 mb-2">
          <Button onClick={localIsRecording ? stopRecording : startRecording} variant="destructive">
            {localIsRecording ? 'Stop Recording' : 'Record'}
          </Button>
          <Button onClick={localIsPlaying ? stopTrack : playTrack} variant="default" disabled={!source.current}>
            {localIsPlaying ? 'Stop' : 'Play'}
          </Button>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-20">Volume:</span>
          <Slider
            value={[localVolume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={onActivate} variant="secondary">Activate</Button>
          <Button onClick={onRemove} variant="outline">Remove</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Track