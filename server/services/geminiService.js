import { GoogleGenAI } from '@google/genai';
import { StoryResponseSchema, QuizQuestionSchema } from '../../shared/schemas.js';

const MASTER_SYSTEM_INSTRUCTION = `You are the Master Storyteller and Educational Architect for "Katha Yatra", a platform dedicated to teaching children world history, ancient civilizations, religions, and cultural heritage through captivating adventures.
Rules:
1. Tone must be warm, enthusiastic, highly engaging, respectful of all cultures and traditions, and completely child-safe.
2. Avoid graphic violence or complex adult themes; focus on moral lessons, heroism, discovery, history, and wonder.
3. Every story output must conclude with an irresistible cliffhanger that motivates the child to complete the next two game levels.
4. Output must strictly adhere to the requested JSON structure.`;

const storyGeminiSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    narrative: { type: "STRING" },
    cliffhanger: { type: "STRING" },
    moralLesson: { type: "STRING" }
  },
  required: ["title", "narrative", "cliffhanger", "moralLesson"]
};

const quizGeminiSchema = {
  type: "OBJECT",
  properties: {
    question: { type: "STRING" },
    options: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "4 possible options"
    },
    correctAnswerIndex: { type: "INTEGER" },
    explanation: { type: "STRING" }
  },
  required: ["question", "options", "correctAnswerIndex", "explanation"]
};

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateStoryChapter(trackTitle, chapterNumber = 1, previousCliffhanger = null, ageGroup = "9-12") {
  const ai = getAiClient();
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (ai) {
    try {
      const prompt = `Generate chapter ${chapterNumber} for the cultural journey track "${trackTitle}".
Target Age Group: ${ageGroup} years old.
Previous cliffhanger context: "${previousCliffhanger || 'Beginning of the adventure'}".
Provide an engaging, child-friendly educational narrative that concludes with an exciting cliffhanger that will make the child eager to play the next two game levels. Highlight a noble moral lesson.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: MASTER_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: storyGeminiSchema,
          temperature: 0.7
        }
      });

      const parsed = JSON.parse(response.text);
      const validated = StoryResponseSchema.parse(parsed);
      return {
        ...validated,
        source: "gemini-ai",
        model: modelName
      };
    } catch (err) {
      console.warn("⚠️ Gemini AI generation error, using fallback narrative:", err.message);
    }
  }

  // High quality dynamic fallback when API key is missing or offline
  return generateFallbackStory(trackTitle, chapterNumber, previousCliffhanger, ageGroup);
}

export async function generateDynamicQuiz(trackTitle, levelNumber = 1, topic = null, ageGroup = "9-12") {
  const ai = getAiClient();
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (ai) {
    try {
      const prompt = `Create an interactive, child-safe educational quiz question for Level ${levelNumber} of the track "${trackTitle}".
Specific topic focus: ${topic || 'Key historical insight, ancient wisdom, cultural achievement, or legendary heroism'}.
Target Audience: Children age ${ageGroup}.
Provide exactly 4 clear options, specify the zero-indexed correctAnswerIndex (0, 1, 2, or 3), and provide an inspiring educational explanation.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: MASTER_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: quizGeminiSchema,
          temperature: 0.6
        }
      });

      const parsed = JSON.parse(response.text);
      const validated = QuizQuestionSchema.parse(parsed);
      return {
        ...validated,
        source: "gemini-ai"
      };
    } catch (err) {
      console.warn("⚠️ Gemini AI quiz generation error, using fallback quiz:", err.message);
    }
  }

  return generateFallbackQuiz(trackTitle, levelNumber, topic);
}

// Built-in intelligent fallback storyteller
function generateFallbackStory(trackTitle, chapterNumber, previousCliffhanger, ageGroup) {
  const templates = [
    {
      title: `The Secret of the Sun Chariot (Chapter ${chapterNumber})`,
      narrative: `As dawn broke across the golden horizons of ${trackTitle}, the ancient city awoke to the chime of temple bells and songs of birds. Our young traveler discovered an intricately carved bronze dial buried beneath moss and fallen blossoms. By aligning the bronze pointer with the morning sun, a secret stone door in the ancient library wall clicked open. Inside were scrolls inscribed with knowledge of astronomy, ancient kindness, and righteous leadership. Every passage revealed that true strength lies not in force, but in patience and courage.`,
      cliffhanger: `Just as the young seeker read the final line of the royal decree, the floor trembled gently, and a pair of carved stone eyes on the wall began to glow with sapphire light... What will be revealed when the next level is conquered?`,
      moralLesson: "Knowledge guided by compassion and humility illuminates the darkest paths."
    },
    {
      title: `The Whispering Winds of Heritage (Chapter ${chapterNumber})`,
      narrative: `High upon the windswept hills overlooking ${trackTitle}, a mysterious elder greeted the travelers with a warm smile. 'You have proven your courage through noble challenges,' the elder spoke, presenting a handcrafted compass carved with ancient motifs. 'This compass does not point north; it points towards deeds of honor and loyalty.' Together, they journeyed through fragrant groves, discovering how ancient ancestors built monuments and lived in harmony with nature and each other.`,
      cliffhanger: `Suddenly, the needle on the compass spun wildly and pointed directly toward an ancient waterfall that hid a sparkling cavern behind its veil of mist... Who or what is waiting inside?`,
      moralLesson: "True leadership means protecting those who cannot protect themselves."
    }
  ];

  const selected = templates[(chapterNumber - 1) % templates.length];
  return {
    ...selected,
    source: "narrative-architect"
  };
}

function generateFallbackQuiz(trackTitle, levelNumber, topic) {
  return {
    question: `In the legendary stories of ${trackTitle}, what virtue was valued above all wealth and power?`,
    options: [
      "Righteous conduct (Dharma / Virtue)",
      "Vast piles of gold coins",
      "Having the largest chariot fleet",
      "Building the tallest stone walls"
    ],
    correctAnswerIndex: 0,
    explanation: "Throughout world heritage and ancient traditions, moral integrity, truthfulness, and kindness were honored as the highest treasures.",
    source: "curriculum-bank"
  };
}
