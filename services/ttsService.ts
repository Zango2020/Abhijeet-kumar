// Text-to-Speech Service for Teacher Voice Narration

export interface TTSState {
    isPlaying: boolean;
    isPaused: boolean;
    currentSentence: number;
    totalSentences: number;
    voice: SpeechSynthesisVoice | null;
    rate: number;
    pitch: number;
}

class TextToSpeechService {
    private synth: SpeechSynthesis;
    private utterance: SpeechSynthesisUtterance | null = null;
    private sentences: string[] = [];
    private currentIndex: number = 0;
    private onStateChange: ((state: Partial<TTSState>) => void) | null = null;
    private onSentenceHighlight: ((index: number) => void) | null = null;
    private selectedVoice: SpeechSynthesisVoice | null = null;
    private rate: number = 0.9;
    private pitch: number = 1.0;

    constructor() {
        this.synth = window.speechSynthesis;
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.synth.getVoices().filter(voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') ||
             voice.name.includes('Microsoft') ||
             voice.name.includes('Natural') ||
             voice.name.includes('Premium') ||
             voice.localService === false)
        );
    }

    getAllVoices(): SpeechSynthesisVoice[] {
        return this.synth.getVoices().filter(voice => voice.lang.startsWith('en'));
    }

    setVoice(voice: SpeechSynthesisVoice) {
        this.selectedVoice = voice;
    }

    setRate(rate: number) {
        this.rate = Math.max(0.5, Math.min(2, rate));
    }

    setPitch(pitch: number) {
        this.pitch = Math.max(0.5, Math.min(2, pitch));
    }

    setOnStateChange(callback: (state: Partial<TTSState>) => void) {
        this.onStateChange = callback;
    }

    setOnSentenceHighlight(callback: (index: number) => void) {
        this.onSentenceHighlight = callback;
    }

    private splitIntoSentences(text: string): string[] {
        // Clean HTML and split into sentences
        const cleanText = text
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ')
            .trim();

        // Split by sentence-ending punctuation while keeping the punctuation
        const sentences = cleanText
            .split(/(?<=[.!?])\s+/)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim());

        return sentences;
    }

    speak(text: string): void {
        this.stop();

        this.sentences = this.splitIntoSentences(text);
        this.currentIndex = 0;

        if (this.sentences.length === 0) return;

        this.onStateChange?.({
            isPlaying: true,
            isPaused: false,
            currentSentence: 0,
            totalSentences: this.sentences.length
        });

        this.speakNext();
    }

    private speakNext(): void {
        if (this.currentIndex >= this.sentences.length) {
            this.onStateChange?.({ isPlaying: false, isPaused: false });
            return;
        }

        const sentence = this.sentences[this.currentIndex];
        this.utterance = new SpeechSynthesisUtterance(sentence);

        // Set voice settings
        if (this.selectedVoice) {
            this.utterance.voice = this.selectedVoice;
        } else {
            // Try to find a good default voice
            const voices = this.getVoices();
            if (voices.length > 0) {
                this.utterance.voice = voices[0];
            }
        }

        this.utterance.rate = this.rate;
        this.utterance.pitch = this.pitch;
        this.utterance.volume = 1;

        this.utterance.onstart = () => {
            this.onSentenceHighlight?.(this.currentIndex);
            this.onStateChange?.({
                currentSentence: this.currentIndex,
                isPlaying: true,
                isPaused: false
            });
        };

        this.utterance.onend = () => {
            this.currentIndex++;
            if (this.currentIndex < this.sentences.length) {
                this.speakNext();
            } else {
                this.onStateChange?.({ isPlaying: false, isPaused: false });
            }
        };

        this.utterance.onerror = (event) => {
            console.error('TTS Error:', event);
            this.onStateChange?.({ isPlaying: false, isPaused: false });
        };

        this.synth.speak(this.utterance);
    }

    pause(): void {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.onStateChange?.({ isPaused: true });
        }
    }

    resume(): void {
        if (this.synth.paused) {
            this.synth.resume();
            this.onStateChange?.({ isPaused: false });
        }
    }

    stop(): void {
        this.synth.cancel();
        this.currentIndex = 0;
        this.sentences = [];
        this.utterance = null;
        this.onStateChange?.({
            isPlaying: false,
            isPaused: false,
            currentSentence: 0,
            totalSentences: 0
        });
    }

    skipForward(): void {
        if (this.sentences.length === 0) return;

        this.synth.cancel();
        this.currentIndex = Math.min(this.currentIndex + 1, this.sentences.length - 1);
        this.speakNext();
    }

    skipBackward(): void {
        if (this.sentences.length === 0) return;

        this.synth.cancel();
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.speakNext();
    }

    isSupported(): boolean {
        return 'speechSynthesis' in window;
    }
}

export const ttsService = new TextToSpeechService();
export default ttsService;
