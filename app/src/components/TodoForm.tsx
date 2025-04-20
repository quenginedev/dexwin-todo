import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { TodoFormProps } from '../types/todo';
import { Add as AddIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  error: unknown
}

// Make SpeechRecognitionResultList iterable
interface SpeechRecognitionResultList extends Iterable<SpeechRecognitionResult> {
  [index: number]: SpeechRecognitionResult;
  length: number;
  [Symbol.iterator](): Iterator<SpeechRecognitionResult>;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string>('');
  const isListeningRef = useRef(false);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setError('');
      };

      recognitionInstance.onresult = (event) => {
        if (!event.results || event.results.length === 0) return;

        const results = event.results;
        let interimTranscript = '';
        let finalTranscript = '';

        // Iterate through all results to handle Safari's different result structure
        for (const element of results) {
          const result = element;
          if (!result || result.length === 0) continue;

          const transcript = result[0]?.transcript || '';
          if (result.isFinal) {
            finalTranscript = transcript;
          } else {
            interimTranscript = transcript;
          }
        }

        // Update the input field with either the final or interim transcript
        const newText = finalTranscript || interimTranscript;
        if (newText) {
          setTitle(newText);
        }

        if (finalTranscript) {
          setIsListening(false);
          isListeningRef.current = false;
          setError('');
          try {
            recognitionInstance.stop();
          } catch (err) {
            console.error("Error stopping recognition:", err);
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === 'not-allowed') {
          setError('Microphone permission denied');
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error === 'no-speech') {
          // Don't stop listening on no-speech error
          setError('Listening... (No speech detected)');
        } else {
          setError(`Error: ${String(event.error)}`);
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognitionInstance.onend = () => {
        // Only restart if intentionally still listening
        if (isListeningRef.current) {
          try {
            recognitionInstance.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            setIsListening(false);
            isListeningRef.current = false;
            setError('Recognition ended unexpectedly');
          }
        } else {
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      setRecognition(recognitionInstance);
    } catch (initError) {
      console.error("Error initializing speech recognition:", initError);
      setError('Failed to initialize speech recognition');
    }

    // Cleanup function to stop recognition when component unmounts
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (err) {
          console.error("Error stopping recognition during cleanup:", err);
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    try {
      if (isListening) {
        recognition.stop();
        isListeningRef.current = false;
        setIsListening(false);
      } else {
        recognition.start();
        isListeningRef.current = true;
        setIsListening(true);
      }
    } catch (error) {
      console.error("Error toggling speech recognition:", error);
      setError(`Failed to ${isListening ? 'stop' : 'start'} speech recognition`);
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');

      // Stop listening if currently active
      if (isListening && recognition) {
        try {
          recognition.stop();
          setIsListening(false);
          isListeningRef.current = false;
        } catch (err) {
          console.error("Error stopping recognition after submit:", err);
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
            },
          }}
        />
        {title ? (
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <AddIcon />
          </Button>
        ) : (
          <Tooltip title={error || (recognition ? 'Click to use voice input' : 'Speech recognition not supported')}>
            <Button
              onClick={toggleListening}
              variant="contained"
              disabled={!recognition}
              sx={{
                borderRadius: 2,
                px: 4,
                backgroundColor: isListening ? 'error.light' : 'primary.light',
                '&:hover': {
                  backgroundColor: isListening ? 'error.main' : 'primary.main',
                },
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </Button>
          </Tooltip>
        )}
      </Box>
    </motion.div>
  );
};

export default TodoForm;