// Empathetic AI emotional analysis based on user speech
export const analyzeEmotion = (userText) => {
  if (!userText || userText.trim().length === 0) {
    return null;
  }

  const text = userText.toLowerCase();

  // Emotion keyword mapping with weighted scores
  const emotionKeywords = {
    stressed: {
      keywords: ['overwhelmed', 'stressed', 'pressure', 'burden', 'loaded', 'swamped', 'drowning', 'exhausted', 'worn out', 'burnt out'],
      weight: 25,
    },
    anxious: {
      keywords: ['anxious', 'nervous', 'worried', 'afraid', 'panic', 'tense', 'restless', 'uneasy', 'concerned', 'apprehensive'],
      weight: 25,
    },
    sad: {
      keywords: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'hopeless', 'lost', 'empty', 'lonely', 'isolated'],
      weight: 20,
    },
    angry: {
      keywords: ['angry', 'furious', 'mad', 'rage', 'frustrated', 'irritated', 'upset', 'bitter', 'resentful'],
      weight: 20,
    },
    happy: {
      keywords: ['happy', 'joyful', 'excited', 'great', 'amazing', 'wonderful', 'thrilled', 'blessed', 'grateful', 'love'],
      weight: 15,
    },
    calm: {
      keywords: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'composed', 'zen', 'meditative'],
      weight: 15,
    },
  };

  // Calculate emotion scores
  const emotionScores = {};
  let primaryEmotion = 'neutral';
  let maxScore = 0;

  Object.entries(emotionKeywords).forEach(([emotion, data]) => {
    let score = 0;
    data.keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += data.weight;
      }
    });

    emotionScores[emotion] = Math.min(score, 100);

    if (score > maxScore) {
      maxScore = score;
      primaryEmotion = emotion;
    }
  });

  // If no dominant emotion found, check for neutral indicators
  if (maxScore === 0) {
    emotionScores.neutral = 50;
    primaryEmotion = 'neutral';
  }

  // Calculate stress level (0-100) with better detection
  const stressIndicators = {
    critical: [
      'suicide', 'kill myself', 'end it', 'no point', 'want to die', 'death wish',
      'harm myself', 'self harm', 'cut myself', 'die', 'gone', 'overdose', 'jump',
      'rope', 'pills', 'knife', 'escape', 'disappear', 'not here'
    ],
    severe: [
      'overwhelmed', 'panic', 'can\'t sleep', 'struggling', 'desperate', 'crisis',
      'breakdown', 'dark thoughts', 'hopeless', 'helpless', 'trapped', 'alone',
      'worthless', 'failure', 'terrible', 'awful', 'horrible', 'unbearable'
    ],
    high: [
      'stressed', 'anxious', 'worried', 'afraid', 'nervous', 'frustrated',
      'pressure', 'burden', 'exhausted', 'worn out', 'burnt out', 'irritated'
    ],
    moderate: [
      'difficulty', 'challenge', 'concern', 'issue', 'problem', 'struggle'
    ],
    positive: [
      'okay', 'fine', 'alright', 'managing', 'coping', 'handling', 'good',
      'happy', 'calm', 'peaceful', 'grateful', 'blessed'
    ],
  };

  let stressLevel = 0;

  // Critical keywords - IMMEDIATE DETECTION
  stressIndicators.critical.forEach((indicator) => {
    if (text.includes(indicator)) stressLevel += 50;
  });

  // Severe stress indicators
  stressIndicators.severe.forEach((indicator) => {
    if (text.includes(indicator)) stressLevel += 35;
  });

  // High stress indicators
  stressIndicators.high.forEach((indicator) => {
    if (text.includes(indicator)) stressLevel += 20;
  });

  // Moderate stress indicators
  stressIndicators.moderate.forEach((indicator) => {
    if (text.includes(indicator)) stressLevel += 10;
  });

  // Positive/calming indicators (reduce stress)
  stressIndicators.positive.forEach((indicator) => {
    if (text.includes(indicator)) stressLevel = Math.max(0, stressLevel - 5);
  });

  // Additional pattern detection for severe issues
  const severePatterns = [
    /can't\s+\w*\s*(sleep|eat|focus|think|function|cope)/,
    /lost\s+(all\s+)?hope/,
    /nothing\s+matters/,
    /nobody\s+cares/,
    /better\s+off\s+(dead|without\s+me)/,
    /everyone\s+(hates|would\s+be\s+better\s+without)/,
    /pain\s+is\s+unbearable/
  ];

  severePatterns.forEach((pattern) => {
    if (pattern.test(text)) stressLevel += 30;
  });

  // Sleep issues boost
  if (text.match(/not.*sleep|can't.*sleep|insomnia|sleep\s+deprivation/)) {
    stressLevel += 15;
  }

  // Appetite/appetite issues boost
  if (text.match(/can't.*eat|lost.*appetite|eating\s+disorder|no\s+appetite/)) {
    stressLevel += 15;
  }

  // Cap at 100 and ensure valid range
  stressLevel = Math.min(100, Math.max(0, stressLevel));

  // Generate empathetic summary based on emotion and stress
  const summaries = {
    stressed: [
      'I hear that you\'re feeling overwhelmed. That\'s completely valid, and I\'m here to listen and support you through this.',
      'It sounds like you\'re carrying a lot right now. Take a moment - you don\'t have to handle everything at once.',
      'I sense you\'re under a lot of pressure. Remember, it\'s okay to ask for help when you need it.',
    ],
    anxious: [
      'Your worries are real, and I acknowledge that. Let\'s work through what\'s on your mind together.',
      'Anxiety can feel overwhelming, but you\'re not alone. I\'m here to support you.',
      'It\'s clear something is weighing on you. Let\'s explore what might help ease these feelings.',
    ],
    sad: [
      'I hear sadness in what you\'re sharing. Your feelings matter, and I\'m here to listen without judgment.',
      'It\'s okay to feel down. These feelings are temporary, and support is available to you.',
      'You deserve compassion and care. Let\'s talk about what you\'re going through.',
    ],
    angry: [
      'I can sense your frustration, and that\'s valid. Let\'s channel these feelings into understanding what\'s bothering you.',
      'Your anger shows you care deeply. Let\'s explore what\'s underneath it.',
      'It\'s okay to feel angry. What\'s driving these feelings right now?',
    ],
    happy: [
      'That\'s wonderful! I can feel the positivity in your words. Tell me more about what\'s bringing you joy.',
      'Your happiness is contagious! What are you grateful for right now?',
      'It sounds like things are going well. What moments are bringing you the most joy?',
    ],
    calm: [
      'I can sense your peace. This is a great place to reflect on what\'s working well for you.',
      'You sound grounded and centered. What practices are helping you feel this way?',
      'There\'s a calm wisdom in your words. What insights can you share?',
    ],
    neutral: [
      'I\'m here to listen. Share whatever is on your mind.',
      'Thank you for opening up. What would you like to talk about?',
      'I\'m listening. What would help you feel better today?',
    ],
  };

  const summary =
    summaries[primaryEmotion][Math.floor(Math.random() * summaries[primaryEmotion].length)];

  // Generate 3 personalized suggestions based on emotion and stress level
  const suggestions = generateSuggestions(primaryEmotion, stressLevel, text);

  // Generate stress trend data (simulated for visualization)
  const stressTrend = generateStressTrend(stressLevel);

  // Determine if professional help is needed
  const needsProfessionalHelp = stressLevel > 70;

  return {
    emotion: primaryEmotion,
    stress_level: Math.round(stressLevel),
    summary,
    suggestions,
    needs_professional_help: needsProfessionalHelp,
    analysis: {
      stress_trend: stressTrend,
      emotion_score: {
        stressed: emotionScores.stressed || 0,
        anxious: emotionScores.anxious || 0,
        sad: emotionScores.sad || 0,
        happy: emotionScores.happy || 0,
        calm: emotionScores.calm || 0,
      },
    },
  };
};

const generateSuggestions = (emotion, stressLevel, text) => {
  const suggestions = {
    stressed: [
      'Take a 5-minute breathing break right now - in for 4, hold for 4, out for 6.',
      'Break your tasks into smaller, manageable steps. Tackle one thing at a time.',
      'Consider reaching out to someone you trust. Sharing your burden can lighten the load.',
    ],
    anxious: [
      'Ground yourself using the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
      'Try a guided meditation for 10 minutes. Your mind and body will thank you.',
      'Write down your worries. Often, naming them helps us manage them better.',
    ],
    sad: [
      'Reach out to someone who cares about you. Connection is healing.',
      'Engage in one small activity you enjoy today - something that brings you comfort.',
      'Be gentle with yourself. Sadness is part of being human, and it will pass.',
    ],
    angry: [
      'Channel this energy into physical movement - go for a walk, exercise, or dance.',
      'Journal your feelings without censoring. Let it all out on paper.',
      'Practice the pause - before reacting, take a moment to breathe and reflect.',
    ],
    happy: [
      'Celebrate this moment! Savor what\'s bringing you joy.',
      'Share your happiness with someone else - gratitude multiplies joy.',
      'Create a memory of this feeling to return to during challenging times.',
    ],
    calm: [
      'Maintain this peace by continuing practices that support your well-being.',
      'Reflect on what\'s helping you feel balanced right now.',
      'Use this clarity to make any decisions that have been on your mind.',
    ],
    neutral: [
      'Explore what you\'re really feeling beneath the surface.',
      'Try a calming activity like journaling, meditation, or a warm bath.',
      'Spend time in nature - even a short walk can help clarify your thoughts.',
    ],
  };

  // If high stress, always include professional help suggestion
  if (stressLevel > 70) {
    const baseSuggestions = suggestions[emotion] || suggestions.neutral;
    return [
      baseSuggestions[0],
      baseSuggestions[1],
      'Consider speaking with a mental health professional. They can provide personalized support.',
    ];
  }

  return suggestions[emotion] || suggestions.neutral;
};

const generateStressTrend = (stressLevel) => {
  // Create a realistic stress trend showing variation over time
  const trend = [];
  let current = Math.max(0, stressLevel - 20);

  for (let i = 0; i < 8; i++) {
    // Add some natural variation
    const variation = (Math.random() - 0.5) * 20;
    current = Math.max(0, Math.min(100, current + variation));
    trend.push(Math.round(current));
  }

  // End with the actual stress level
  trend[trend.length - 1] = stressLevel;
  return trend;
};
