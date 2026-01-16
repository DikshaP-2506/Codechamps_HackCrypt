// AI Integration Module - Handles LangChain and Groq AI setup

const { ChatGroq } = require('@langchain/groq');
const { BufferMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');

// Mental Health System Prompt
const SYSTEM_PROMPT = `You are Dr. Mindwell, a compassionate and professional mental health assistant for the HackCrypt Health Platform.

Your role:
- Provide empathetic, non-judgmental support
- Help users track their mental health
- Suggest coping strategies and self-care tips
- Recognize crisis situations and recommend professional help
- NEVER diagnose or prescribe medication
- Always encourage users to consult licensed therapists for serious concerns

Guidelines:
- Be warm, friendly, and supportive
- Use simple, clear language
- Ask follow-up questions to understand their feelings
- Validate their emotions
- Suggest practical coping techniques (breathing exercises, journaling, mindfulness)
- If detecting crisis keywords (suicide, self-harm, severe depression), provide crisis hotline numbers

Crisis Response:
If user mentions: suicide, self-harm, wanting to die, feeling hopeless
Respond: "I'm really concerned about what you're sharing. Please reach out to a crisis hotline immediately: National Suicide Prevention Lifeline: 988 or 1-800-273-8255. You can also text HOME to 741741. Your life matters and help is available."

When patient data is provided:
- Reference their health conditions if relevant to mental health
- Consider how physical health (vitals, medications) may affect mood
- Acknowledge their ongoing treatments and appointments
- Be personalized but maintain professional boundaries`;

/**
 * Initialize Groq Chat Model
 * @param {string} apiKey - Groq API key
 * @returns {ChatGroq} Groq model instance
 */
function initializeModel(apiKey) {
  return new ChatGroq({
    apiKey: apiKey,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    maxTokens: 1024,
  });
}

/**
 * Create a new conversation chain with memory
 * @param {ChatGroq} model - Groq model instance
 * @returns {Object} Chain and memory objects
 */
function createConversationChain(model) {
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: 'history',
  });
  
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
  });
  
  return { chain, memory };
}

/**
 * Initialize conversation with system prompt and patient data
 * @param {ConversationChain} chain - Conversation chain
 * @param {string} formattedPatientData - Formatted patient data string
 * @returns {Promise<Object>} AI response
 */
async function initializeConversation(chain, formattedPatientData) {
  const initMessage = SYSTEM_PROMPT + formattedPatientData + '\n\nGreet the patient and let them know you have their health data loaded and ready to discuss.';
  return await chain.call({ input: initMessage });
}

/**
 * Get AI response for a message with optional context
 * @param {ConversationChain} chain - Conversation chain
 * @param {string} message - User message
 * @param {boolean} hasPatientData - Whether patient data is available
 * @returns {Promise<Object>} AI response
 */
async function getAIResponse(chain, message, hasPatientData = false) {
  let fullMessage = message;
  
  if (hasPatientData) {
    const contextPrefix = `\n[CONTEXT: You have access to the patient's health data. Reference it when relevant.]\n`;
    fullMessage = contextPrefix + message;
  }
  
  return await chain.call({ input: fullMessage });
}

module.exports = {
  SYSTEM_PROMPT,
  initializeModel,
  createConversationChain,
  initializeConversation,
  getAIResponse
};
