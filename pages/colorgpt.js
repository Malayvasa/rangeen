import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import ExportModal from "@/components/ExportModal";

const ColorGPT = () => {
	const [response, setResponse] = useState([]);
	const [mood, setMood] = useState("dreamy vibes");
	const [isLoading, setIsLoading] = useState(false);
	const posthog = usePostHog();

	const getResponseFromOpenAI = async () => {
		setResponse([]);
		setIsLoading(true);

		const prompt = `
    You are "colorGPT," an expert in color theory and color science.
    
    Task: Generate a color palette tailored for a specific application.
    
    Application Description: "{{mood}}"
    
    Requirements:
    1. Analyze the application's description to determine the most suitable color scheme. Choose from:
       - Analogous
       - Monochromatic
       - Complementary
       - Triadic
       - Split-Complementary
       - Tetradic
       - Neutral
       - Warm/Cool
       - Pastel
       - Retro/Vintage
    2. Generate a palette of 10 colors (hex codes) that align with the chosen color scheme and effectively represent the application's purpose and appeal to its target audience.
    3. Provide a "justification" explaining why this palette and color scheme are appropriate for the specified application.
    
    Output:
    - Format the response as a JSON object structured as follows:
      {
        "colors": ["#HexCode1", "#HexCode2", ..., "#HexCode10"],
        "justification": "Your explanation here."
      }
    - Ensure the response does not contain any newline or breakline characters.
    
    Response:
    `;
		const response = await fetch("/api/openai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt: prompt }),
		});

		if (!response.ok) {
			setIsLoading(false);
			const errorMessage = await response.json();

			toast.error(errorMessage.error);
			return;
		}

		const data = await response.json();
		console.log(data);
		setIsLoading(false);
		setResponse(data.colors || []);
	};

	return (
		<div className="h-screen w-screen flex justify-center bg-gray-100 items-center p-4  md:py-32 md:px-32">
			<div className="w-full h-full bg-white flex-grow flex justify-center rounded-3xl pt-24 py-8 md:mt-0 md:py-12">
				<div className=" flex flex-col items-center justify-between ">
					<div className="flex gap-x-4 items-center border-[2px] rounded-full">
						<input
							onChange={(e) => {
								setMood(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									getResponseFromOpenAI();
								}
							}}
							placeholder="What's your mood?"
							className="p-4 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50"></input>
						<button
							onClick={() => {
								getResponseFromOpenAI();
								posthog.capture("Color GPT", {
									property: mood,
								});
							}}
							className="text-blue-500 p-2 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50">
							<svg
								width="32px"
								height="32px"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								color="currentColor">
								<path
									d="M3 21l10-10m5-5l-2.5 2.5"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"></path>
								<path
									d="M9.5 2l.945 2.555L13 5.5l-2.555.945L9.5 9l-.945-2.555L6 5.5l2.555-.945L9.5 2zM19 10l.54 1.46L21 12l-1.46.54L19 14l-.54-1.46L17 12l1.46-.54L19 10z"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinejoin="round"></path>
							</svg>
						</button>
					</div>

					<div className="flex-grow h-full flex items-center justify-center">
						{isLoading ? (
							<>
								<div className="blur-[15px] saturate-[200%] mt-8">
									<div className="loader1 left-1/2 top-1/2 z-10 "></div>
									<div className="loader2 left-1/2 top-1/2 z-10 "></div>
									<div className="loader3 left-1/2 top-1/2 z-10 "></div>
								</div>
							</>
						) : (
							response.length > 0 && (
								<div className="flex flex-col justify-center items-center">
									<div className="grid grid-cols-2 md:flex gap-2 rounded-md p-4">
										{response.map((color, index) => {
											return (
												<div
													key={index}
													className="group flex flex-col items-center ">
													<div
														className="w-12 h-12 rounded-full border-[2px] border-gray-200"
														style={{ backgroundColor: color }}></div>
												</div>
											);
										})}
									</div>
									<ExportModal hexList={response}>
										<button className="flex justify-center items-center gap-2 bg-slate-200/20 h-full w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
											<svg
												width="18px"
												height="18px"
												stroke-width="1.5"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												color="currentColor">
												<path
													d="M6 20h12M12 4v12m0 0l3.5-3.5M12 16l-3.5-3.5"
													stroke="currentColor"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"></path>
											</svg>
											<span className="text-xs">Export</span>
										</button>
									</ExportModal>

									{/* <div className="flex flex-col mt-16 m-8 w-96 bg-gray-200 rounded-md">
										<div className="text-sm py-2 text-center font-semibold   text-gray-700">
											Why this palette?
										</div>
										<div className=" text-left p-[12px] text-sm w-96 rounded-md bg-gray-100 text-gray-500">
											{justification}
										</div>
									</div> */}
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ColorGPT;
