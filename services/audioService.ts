
import type { SoundType } from '../types';

class AudioService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private createOscillator(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    attack: number = 0.01,
    decay: number = 0.1
  ): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + attack);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  play(sound: SoundType): void {
    if (!this.enabled) return;

    switch (sound) {
      case 'click':
        this.createOscillator(800, 0.08, 'sine', 0.001, 0.05);
        break;
      case 'hover':
        this.createOscillator(600, 0.05, 'sine', 0.001, 0.03);
        break;
      case 'success':
        // Two-tone success sound
        this.createOscillator(523.25, 0.15, 'sine'); // C5
        setTimeout(() => this.createOscillator(659.25, 0.2, 'sine'), 100); // E5
        setTimeout(() => this.createOscillator(783.99, 0.25, 'sine'), 200); // G5
        break;
      case 'notification':
        this.createOscillator(880, 0.1, 'sine');
        setTimeout(() => this.createOscillator(1046.5, 0.15, 'sine'), 80);
        break;
      case 'complete':
        // Celebratory sound
        this.createOscillator(523.25, 0.1, 'sine');
        setTimeout(() => this.createOscillator(659.25, 0.1, 'sine'), 80);
        setTimeout(() => this.createOscillator(783.99, 0.1, 'sine'), 160);
        setTimeout(() => this.createOscillator(1046.5, 0.3, 'sine'), 240);
        break;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const audioService = new AudioService();
