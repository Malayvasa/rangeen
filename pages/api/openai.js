import { OpenAIApi, Configuration } from 'openai';

const configuration = new Configuration({
  organization: 'org-mFqk40rcKT7h8R5gxEmWaVz9',
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  if (req.body.prompt !== undefined) {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${req.body.prompt}`,
      max_tokens: 500,
    });

    res.status(200).json({ text: `${completion.data.choices[0].text}` });
  } else {
    res.status(401).json({ text: 'No prompt provided.' });
  }
};
