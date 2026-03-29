// AI Response Generator - Creates empathetic, conversational responses
export const generateAIResponse = (userText, emotion, stressLevel) => {
  if (!userText || userText.trim().length === 0) {
    return null;
  }

  const text = userText.toLowerCase();

  // Context-aware response generator
  const responses = {
    // Critical/Emergency responses
    critical: {
      condition: (t) =>
        t.includes('suicide') ||
        t.includes('kill myself') ||
        t.includes('end it') ||
        t.includes('no point') ||
        t.includes('want to die') ||
        t.includes('death') ||
        t.includes('harm myself') ||
        t.includes('self harm'),
      response: (userInput) => ({
        message: `I'm really concerned about what you're sharing. What you're feeling right now is important, and you deserve immediate support. Please reach out to someone who can help you - a counselor, doctor, or crisis line. You don't have to go through this alone.`,
        urgency: 'critical',
        recommendation: 'Please contact a mental health professional or crisis line immediately',
      }),
    },

    // Severe stress/depression
    severe: {
      condition: (t) =>
        (t.includes('depressed') || t.includes('hopeless')) &&
        (stressLevel > 75),
      response: () => ({
        message: `I hear that you're in a really dark place right now. These feelings, as overwhelming as they are, can improve with proper support. You've taken a brave step by sharing this. Let's get you connected with professional help who can truly assist you.`,
        urgency: 'high',
        recommendation: 'Speaking with a therapist or counselor would be very beneficial',
      }),
    },

    // Emotional support - Stressed
    stressed: {
      condition: (t) => emotion === 'stressed' || emotion === 'anxious',
      response: (userInput) => {
        const responses_list = [
          `I can hear the weight you're carrying. It sounds like you're dealing with a lot right now. Sometimes when we're overwhelmed, the best thing we can do is break things down into smaller pieces. What's the one thing that feels most urgent to address right now?`,
          `That sounds really exhausting. You know, stress like this often means you're pushing yourself hard - which shows you care. But it's also a sign that you need to take care of yourself. What's one thing you could do today to give yourself a break?`,
          `Being overwhelmed is actually your mind and body telling you something important. You matter, and your wellbeing matters. What would help you feel even slightly better in this moment?`,
        ];
        return {
          message: responses_list[Math.floor(Math.random() * responses_list.length)],
          urgency: stressLevel > 70 ? 'high' : 'normal',
          recommendation: stressLevel > 70 ? 'Consider reaching out to a professional' : 'Try a grounding technique like deep breathing',
        };
      },
    },

    // Emotional support - Sad
    sad: {
      condition: (t) => emotion === 'sad',
      response: () => {
        const responses_list = [
          `Sadness is a natural emotion, and it sounds like you're processing something important. It's okay to feel this way. Tell me more about what's weighing on your heart.`,
          `What you're feeling matters. There's no timeline on sadness, and no "right way" to feel. I'm here to listen and support you. What do you need right now?`,
          `Sometimes we need to sit with our sadness for a while before we can move through it. That's okay. You're not alone in feeling this way. What could help you feel a little less alone right now?`,
        ];
        return {
          message: responses_list[Math.floor(Math.random() * responses_list.length)],
          urgency: 'normal',
          recommendation: 'Connect with someone you trust or engage in something comforting',
        };
      },
    },

    // Emotional support - Happy
    happy: {
      condition: (t) => emotion === 'happy',
      response: () => {
        const responses_list = [
          `That's wonderful! I can feel the positivity in your words. These moments of joy are precious - hold onto them. What are you most grateful for right now?`,
          `It sounds like things are going well for you! That's amazing. These positive feelings are worth savoring. What's bringing you the most joy?`,
          `Your happiness is beautiful to witness. Tell me more about what's making you feel this way. Let's celebrate this moment together.`,
        ];
        return {
          message: responses_list[Math.floor(Math.random() * responses_list.length)],
          urgency: 'positive',
          recommendation: 'Keep doing what brings you joy and share it with others',
        };
      },
    },

    // Emotional support - Calm
    calm: {
      condition: (t) => emotion === 'calm',
      response: () => {
        const responses_list = [
          `I can sense the peace in your words. This calm space is a great place to think clearly. What insights are coming up for you?`,
          `It's beautiful that you're feeling grounded right now. How can we make the most of this clarity and peace you're experiencing?`,
          `You sound balanced and centered. What's helping you feel this way, and how can we protect and nurture this peace?`,
        ];
        return {
          message: responses_list[Math.floor(Math.random() * responses_list.length)],
          urgency: 'positive',
          recommendation: 'Reflect on what\'s working well and continue those practices',
        };
      },
    },

    // Default
    default: {
      condition: () => true,
      response: (userInput) => ({
        message: `I'm here to listen and support you. You shared something important with me - thank you for trusting me. What would help you most right now? Would you like to explore your feelings, find solutions, or just talk?`,
        urgency: 'normal',
        recommendation: 'Continue sharing what\'s on your mind',
      }),
    },
  };

  // Find matching response type
  let selectedResponse = responses.default;

  if (responses.critical.condition(text)) {
    selectedResponse = responses.critical;
  } else if (responses.severe.condition(text)) {
    selectedResponse = responses.severe;
  } else if (responses.stressed.condition(text)) {
    selectedResponse = responses.stressed;
  } else if (responses.sad.condition(text)) {
    selectedResponse = responses.sad;
  } else if (responses.happy.condition(text)) {
    selectedResponse = responses.happy;
  } else if (responses.calm.condition(text)) {
    selectedResponse = responses.calm;
  }

  return selectedResponse.response(userText);
};

// Text-to-speech functionality for natural voice output
export const speakResponse = (message) => {
  if (!message) return;

  // Check if browser supports Speech Synthesis API
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
  if (!SpeechSynthesisUtterance) {
    console.log('Speech Synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(message);

  // Configure voice settings for natural, friendly tone
  utterance.rate = 0.95; // Slightly slower than normal for clarity
  utterance.pitch = 1; // Natural pitch
  utterance.volume = 1; // Full volume

  // Try to use a female voice for friendlier tone
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (voice) =>
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Moira')
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // Speak the message
  speechSynthesis.speak(utterance);

  return utterance;
};

// Get available voices (useful for debugging/selection)
export const getAvailableVoices = () => {
  return speechSynthesis.getVoices();
};
