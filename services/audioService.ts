// Advanced Audio Service for Immersive Learning Experience

export interface AudioSettings {
    masterVolume: number;
    voiceVolume: number;
    effectsVolume: number;
    ambientVolume: number;
    voiceRate: number;
    voicePitch: number;
}

export interface VoiceSettings {
    voice: SpeechSynthesisVoice | null;
    rate: number;
    pitch: number;
    volume: number;
}

class AudioService {
    private synth: SpeechSynthesis;
    private audioContext: AudioContext | null = null;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private sentences: string[] = [];
    private currentSentenceIndex: number = 0;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;

    // Callbacks
    private onStateChange: ((state: any) => void) | null = null;
    private onSentenceChange: ((index: number, sentence: string) => void) | null = null;
    private onProgress: ((progress: number) => void) | null = null;

    // Settings
    private settings: AudioSettings = {
        masterVolume: 1,
        voiceVolume: 1,
        effectsVolume: 0.5,
        ambientVolume: 0.3,
        voiceRate: 0.9,
        voicePitch: 1.0
    };

    private selectedVoice: SpeechSynthesisVoice | null = null;

    constructor() {
        this.synth = window.speechSynthesis;
        this.initAudioContext();
    }

    private initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // ============================================
    // VOICE MANAGEMENT
    // ============================================

    getAvailableVoices(): SpeechSynthesisVoice[] {
        return this.synth.getVoices().filter(voice => voice.lang.startsWith('en'));
    }

    getPremiumVoices(): SpeechSynthesisVoice[] {
        return this.synth.getVoices().filter(voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') ||
             voice.name.includes('Microsoft') ||
             voice.name.includes('Natural') ||
             voice.name.includes('Neural') ||
             voice.name.includes('Premium') ||
             !voice.localService)
        );
    }

    setVoice(voice: SpeechSynthesisVoice) {
        this.selectedVoice = voice;
    }

    setSettings(settings: Partial<AudioSettings>) {
        this.settings = { ...this.settings, ...settings };
    }

    // ============================================
    // TEXT PROCESSING
    // ============================================

    private cleanText(text: string): string {
        return text
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]*`/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private splitIntoSentences(text: string): string[] {
        const cleanedText = this.cleanText(text);

        // Split by sentence boundaries
        const sentences = cleanedText
            .split(/(?<=[.!?])\s+/)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim());

        // Further split long sentences
        const result: string[] = [];
        for (const sentence of sentences) {
            if (sentence.length > 200) {
                // Split by commas or semicolons for very long sentences
                const parts = sentence.split(/(?<=[,;:])\s+/);
                let current = '';
                for (const part of parts) {
                    if ((current + ' ' + part).length > 150 && current) {
                        result.push(current.trim());
                        current = part;
                    } else {
                        current = current ? current + ' ' + part : part;
                    }
                }
                if (current) result.push(current.trim());
            } else {
                result.push(sentence);
            }
        }

        return result;
    }

    // ============================================
    // PLAYBACK CONTROLS
    // ============================================

    speak(text: string): void {
        this.stop();

        this.sentences = this.splitIntoSentences(text);
        this.currentSentenceIndex = 0;

        if (this.sentences.length === 0) return;

        this.isPlaying = true;
        this.isPaused = false;

        this.notifyStateChange();
        this.playNextSentence();
    }

    private playNextSentence(): void {
        if (this.currentSentenceIndex >= this.sentences.length) {
            this.isPlaying = false;
            this.notifyStateChange();
            return;
        }

        const sentence = this.sentences[this.currentSentenceIndex];
        this.currentUtterance = new SpeechSynthesisUtterance(sentence);

        // Apply voice settings
        if (this.selectedVoice) {
            this.currentUtterance.voice = this.selectedVoice;
        } else {
            const premiumVoices = this.getPremiumVoices();
            if (premiumVoices.length > 0) {
                this.currentUtterance.voice = premiumVoices[0];
            }
        }

        this.currentUtterance.rate = this.settings.voiceRate;
        this.currentUtterance.pitch = this.settings.voicePitch;
        this.currentUtterance.volume = this.settings.masterVolume * this.settings.voiceVolume;

        // Event handlers
        this.currentUtterance.onstart = () => {
            this.onSentenceChange?.(this.currentSentenceIndex, sentence);
            this.notifyStateChange();
        };

        this.currentUtterance.onend = () => {
            this.currentSentenceIndex++;
            this.onProgress?.(this.currentSentenceIndex / this.sentences.length);

            if (this.currentSentenceIndex < this.sentences.length && this.isPlaying) {
                // Small pause between sentences for natural flow
                setTimeout(() => this.playNextSentence(), 200);
            } else {
                this.isPlaying = false;
                this.notifyStateChange();
            }
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech error:', event);
            this.isPlaying = false;
            this.notifyStateChange();
        };

        this.synth.speak(this.currentUtterance);
    }

    pause(): void {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.isPaused = true;
            this.notifyStateChange();
        }
    }

    resume(): void {
        if (this.synth.paused) {
            this.synth.resume();
            this.isPaused = false;
            this.notifyStateChange();
        }
    }

    stop(): void {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentSentenceIndex = 0;
        this.sentences = [];
        this.currentUtterance = null;
        this.notifyStateChange();
    }

    skipToNext(): void {
        if (this.sentences.length === 0) return;
        this.synth.cancel();
        this.currentSentenceIndex = Math.min(this.currentSentenceIndex + 1, this.sentences.length - 1);
        if (this.isPlaying) {
            this.playNextSentence();
        }
    }

    skipToPrevious(): void {
        if (this.sentences.length === 0) return;
        this.synth.cancel();
        this.currentSentenceIndex = Math.max(this.currentSentenceIndex - 1, 0);
        if (this.isPlaying) {
            this.playNextSentence();
        }
    }

    skipToSentence(index: number): void {
        if (index < 0 || index >= this.sentences.length) return;
        this.synth.cancel();
        this.currentSentenceIndex = index;
        if (this.isPlaying) {
            this.playNextSentence();
        }
    }

    // ============================================
    // SOUND EFFECTS
    // ============================================

    playClickSound(): void {
        this.playTone(800, 0.05, 'sine', this.settings.effectsVolume * 0.3);
    }

    playSuccessSound(): void {
        this.playTone(523, 0.1, 'sine', this.settings.effectsVolume * 0.4);
        setTimeout(() => this.playTone(659, 0.1, 'sine', this.settings.effectsVolume * 0.4), 100);
        setTimeout(() => this.playTone(784, 0.15, 'sine', this.settings.effectsVolume * 0.4), 200);
    }

    playErrorSound(): void {
        this.playTone(200, 0.2, 'sawtooth', this.settings.effectsVolume * 0.3);
    }

    playNotificationSound(): void {
        this.playTone(440, 0.1, 'sine', this.settings.effectsVolume * 0.3);
        setTimeout(() => this.playTone(554, 0.15, 'sine', this.settings.effectsVolume * 0.3), 150);
    }

    playTransitionSound(): void {
        this.playTone(300, 0.1, 'sine', this.settings.effectsVolume * 0.2);
        this.playTone(600, 0.1, 'sine', this.settings.effectsVolume * 0.1);
    }

    private playTone(frequency: number, duration: number, type: OscillatorType, volume: number): void {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume * this.settings.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    setOnStateChange(callback: (state: any) => void): void {
        this.onStateChange = callback;
    }

    setOnSentenceChange(callback: (index: number, sentence: string) => void): void {
        this.onSentenceChange = callback;
    }

    setOnProgress(callback: (progress: number) => void): void {
        this.onProgress = callback;
    }

    private notifyStateChange(): void {
        this.onStateChange?.({
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentSentence: this.currentSentenceIndex,
            totalSentences: this.sentences.length,
            progress: this.sentences.length > 0 ? this.currentSentenceIndex / this.sentences.length : 0
        });
    }

    // ============================================
    // UTILITY
    // ============================================

    getState() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentSentence: this.currentSentenceIndex,
            totalSentences: this.sentences.length,
            sentences: this.sentences,
            progress: this.sentences.length > 0 ? this.currentSentenceIndex / this.sentences.length : 0
        };
    }

    isSupported(): boolean {
        return 'speechSynthesis' in window;
    }

    getCurrentSentence(): string {
        return this.sentences[this.currentSentenceIndex] || '';
    }
}

export const audioService = new AudioService();
export default audioService;
