import { useState } from 'react';

const TestGPT = () => {
  const [colorPrompt, setColorPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const prompt = `You are colorGPT an expert in color theory and color science, generate a color palette with 10 hex codes based on the prompt: ${colorPrompt}. Generate the color palette to follow one of the following color scheme styles that works for the given prompt : 1. Analogous, 2. Monochromatic, 3. Complementary, 4. Triadic, 5. Split-Complementary, 6. Tetradic, 7. Neutral, 8. Warm/Cool, 9. Pastel, 10. Retro/Vintage. Uniquely name each color accordingly, format the response as a JSON and only return the JSON, the JSON should have two parameters, name and hex and the entire list should be inside colorPalette. Response :`;

  const generateBio = async () => {
    setResponse('');
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col gap-8  justify-center items-center">
      <textarea
        value={colorPrompt}
        onChange={(e) => setColorPrompt(e.target.value)}
        rows={4}
        className="border-2 rounded-xl w-[600px] p-8"
        placeholder={
          'Enter a prompt for the AI to generate a color palette for..'
        }
      />
      <button
        className="bg-slate-700 text-white rounded-lg px-4 py-2"
        onClick={(e) => {
          generateBio(e);
        }}
      >
        Generate
      </button>
      <div>{response}</div>
    </div>
  );
};

export default TestGPT;
