const { GoogleGenerativeAI } = require('@google/generative-ai');

// Need to lazy-init or init checking for key so it doesn't crash if omitted
let genAI;
try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');
} catch (e) {
    console.warn("Could not initialize Gemini - is GEMINI_API_KEY set?");
}

const getRepairSuggestion = async (description, equipmentType) => {
    try {
        if (!genAI) return 'AI service is unconfigured. Please add GEMINI_API_KEY.';
        // using latest model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `You are an oil field maintenance expert.
A work order has been raised for ${equipmentType}.
Issue: ${description}.
Suggest: root cause, repair steps, safety precautions, estimated time.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error with Gemini API:', error);
        return 'Error fetching suggestion from AI.';
    }
};

module.exports = { getRepairSuggestion };
