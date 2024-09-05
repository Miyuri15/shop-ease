declare module 'react-native-voice' {
    export interface VoiceEvent {
      error?: string;
      value: string[];
    }
  
    export interface VoiceOptions {
      RECOGNIZER_PARTIAL_RESULTS?: boolean;
      EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS?: number;
      EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS?: number;
    }
  
    const Voice: {
      start: (locale: string, options?: VoiceOptions) => Promise<void>;
      stop: () => Promise<void>;
      cancel: () => Promise<void>;
      destroy: () => Promise<void>;
      isAvailable: () => Promise<boolean>;
      isRecognizing: () => boolean;
      removeAllListeners: () => void;
      onSpeechStart: (callback: (event: VoiceEvent) => void) => void;
      onSpeechEnd: (callback: (event: VoiceEvent) => void) => void;
      onSpeechError: (callback: (event: VoiceEvent) => void) => void;
      onSpeechResults: (callback: (event: VoiceEvent) => void) => void;
      onSpeechPartialResults: (callback: (event: VoiceEvent) => void) => void;
      onSpeechVolumeChanged: (callback: (event: VoiceEvent) => void) => void;
    };
  
    export default Voice;
  }
  