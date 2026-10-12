/**
 * Smart Sound and Voice Announcement Service
 * Uses Web Audio API for melodic chime and Web Speech API for voice announcement
 */

class SoundAndSpeechService {
  constructor() {
    this.audioCtx = null;
    this.speechEnabled = true;
    this.soundEnabled = true;
    this.volume = 0.9;
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play a pleasant dual-tone airport / bank chime
  playChime() {
    if (!this.soundEnabled || typeof window === 'undefined') return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // First Tone (G4: ~392Hz or E5: ~659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.3 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Second Tone (G5: ~783.99Hz or A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.25); // A5
      gain2.gain.setValueAtTime(0.35 * this.volume, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.9);
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  // Announce token with chime and natural speech
  announceToken(tokenNumber, counterNumber, officerName = '') {
    if (typeof window === 'undefined') return;

    // First play chime
    this.playChime();

    if (!this.speechEnabled || !('speechSynthesis' in window)) return;

    // Small delay to allow the chime to ring first
    setTimeout(() => {
      try {
        window.speechSynthesis.cancel(); // Stop any pending utterances

        // Format token for speech (e.g., "A-024" -> "Token A, zero two four" or "Token A 24")
        const formattedToken = tokenNumber.replace('-', ' ');
        const speechText = officerName
          ? `Attention please. Token ${formattedToken}, please proceed to Counter ${counterNumber}, with officer ${officerName}.`
          : `Attention please. Token ${formattedToken}, please proceed to Counter ${counterNumber}.`;

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 0.9; // clear, deliberate pace
        utterance.pitch = 1.05;
        utterance.volume = this.volume;

        // Try to pick an English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('English')) && v.lang.startsWith('en'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }, 450);
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleSpeech(enabled) {
    this.speechEnabled = enabled !== undefined ? enabled : !this.speechEnabled;
    return this.speechEnabled;
  }
}

export const soundService = new SoundAndSpeechService();
export default soundService;
