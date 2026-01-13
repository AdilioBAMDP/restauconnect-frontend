/**
 * Service de notification audio pour les nouveaux messages
 */
export class AudioNotificationService {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = true;

  constructor() {
    // Créer l'élément audio avec un son de notification simple
    this.audio = new Audio();
    this.audio.volume = 0.5;
    
    // Charger le son (on utilise un data URL pour éviter de dépendre d'un fichier externe)
    // Ce son est un simple bip généré programmatiquement
    this.loadNotificationSound();
    
    // Charger la préférence depuis localStorage
    const savedPreference = localStorage.getItem('audio_notifications_enabled');
    this.enabled = savedPreference !== 'false';
  }

  /**
   * Génère un son de notification simple
   */
  private loadNotificationSound(): void {
    try {
      // Créer un AudioContext pour générer un son
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const duration = 0.2;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const channel = buffer.getChannelData(0);

      // Générer une tonalité simple (440Hz + 880Hz pour un son agréable)
      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        channel[i] = 
          Math.sin(2 * Math.PI * 440 * t) * 0.3 * Math.exp(-t * 5) +
          Math.sin(2 * Math.PI * 880 * t) * 0.2 * Math.exp(-t * 7);
      }

      // Convertir en WAV et créer un data URL
      const wavData = this.audioBufferToWav(buffer);
      const blob = new Blob([wavData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      if (this.audio) {
        this.audio.src = url;
      }
    } catch (error) {
      console.warn('Impossible de générer le son de notification:', error);
      // Fallback: utiliser un data URL vide si la génération échoue
      if (this.audio) {
        this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      }
    }
  }

  /**
   * Convertit un AudioBuffer en WAV
   */
  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    // Écrire le header WAV
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // "RIFF"
    setUint32(0x46464952);
    setUint32(length - 8);
    // "WAVE"
    setUint32(0x45564157);
    // "fmt " chunk
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16);
    // "data" chunk
    setUint32(0x61746164);
    setUint32(length - pos - 4);

    // Écrire les données audio
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return arrayBuffer;
  }

  /**
   * Joue le son de notification
   */
  public async play(): Promise<void> {
    if (!this.enabled || !this.audio) {
      return;
    }

    try {
      // Réinitialiser la position pour pouvoir rejouer
      this.audio.currentTime = 0;
      
      // Jouer le son
      await this.audio.play();
    } catch (error) {
      // Erreur silencieuse (peut arriver si l'utilisateur n'a pas interagi avec la page)
      console.warn('Impossible de jouer le son de notification:', error);
    }
  }

  /**
   * Active les notifications audio
   */
  public enable(): void {
    this.enabled = true;
    localStorage.setItem('audio_notifications_enabled', 'true');
  }

  /**
   * Désactive les notifications audio
   */
  public disable(): void {
    this.enabled = false;
    localStorage.setItem('audio_notifications_enabled', 'false');
  }

  /**
   * Bascule l'état des notifications audio
   */
  public toggle(): boolean {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  /**
   * Vérifie si les notifications audio sont activées
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Ajuste le volume (0 à 1)
   */
  public setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Instance singleton
export const audioNotificationService = new AudioNotificationService();
