import OpenAI from "openai";

const openai = new OpenAI({
	organization: "org-VAlHuoxZAyKfhGqnprj66Dez",
	apiKey: process.env.OPEN_API_KEY,
});
// Assign the function to a variable
const handleRequest = async (req, res) => {
	if (req.body.prompt !== undefined) {
		try {
			const response = await openai.chat.completions.create({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "user",
						content: req.body.prompt,
					},
				],
				response_format: { type: "json_object" },
			});
			console.log("OpenAI API response:", response.choices[0].message.content);

			// Parse the response content as JSON
			const jsonResponse = JSON.parse(response.choices[0].message.content);

			// Return the JSON response
			res.status(200).json(jsonResponse);
		} catch (error) {
			console.error("Error calling OpenAI API:", error.message);
			res
				.status(500)
				.json({ text: "Internal server error.", error: error.message });
		}
	} else {
		res.status(401).json({ text: "No prompt provided." });
	}
};

// Export the variable
export default handleRequest;
