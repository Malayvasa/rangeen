/* eslint-disable @next/next/no-img-element */
import { motion, AnimatePresence } from "framer-motion"; // If you are using motion, keep this import
import ExportModal from "@/components/ExportModal"; // Ensure this import is correct
import Color from "color"; // Import the Color library
import { useState, useEffect } from "react"; // Add this import

const ColorBlock = ({ colorInstance }) => {
	const [isHovered, setIsHovered] = useState(false); // Add state for hover
	const [isCopied, setIsCopied] = useState(false); // Add state for copy status
	const hue = colorInstance.hue(); // Get the hue of the background color
	const lightness = colorInstance.lightness(); // Get the lightness of the color
	const backgroundColor = colorInstance.hex(); // Get the background color

	// Simplified text color calculation
	const isDark = colorInstance.isDark();
	const textColor = isDark
		? colorInstance.lighten(lightness < 20 ? 5 : 1).hex() // Lighten for dark backgrounds
		: colorInstance.darken(0.7).hex(); // Darken for light backgrounds

	// Check contrast and adjust text color if necessary
	const contrastRatio = Color(backgroundColor).contrast(Color(textColor));
	const adjustedTextColor =
		contrastRatio < 2
			? isDark
				? colorInstance.lighten(10).hex()
				: colorInstance.darken(10).hex() // Adjust based on contrast
			: textColor; // Use original text color if contrast is sufficient

	// Function to copy hex color to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(backgroundColor).then(() => {
			setIsCopied(true); // Set copied status to true
			setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
		});
	};

	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className="w-full h-8 md:h-12 flex justify-between px-4 rounded-lg items-center"
			style={{ backgroundColor, color: adjustedTextColor }}
			onMouseEnter={() => setIsHovered(true)} // Set hover state
			onMouseLeave={() => setIsHovered(false)}
			onClick={copyToClipboard} // Add click handler to copy color
		>
			<AnimatePresence mode="wait">
				<motion.div
					className={`${
						isHovered ? "opacity-100" : "opacity-0"
					} transition-opacity duration-300 -translate-x-1`}>
					{isCopied ? (
						<motion.svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width={24}
							height={24}
							fill={"none"}
							initial={{ y: 30, opacity: 0, filter: "blur(5px)" }} // Initial state for entering
							animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} // Animate to visible
							exit={{ y: -30, opacity: 0, filter: "blur(5px)" }} // Animate out
							transition={{ duration: 0, ease: "easeIn" }} // Duration of the transition
						>
							<motion.path
								d="M15 2.5H12C7.52166 2.5 5.28249 2.5 3.89124 3.89124C2.5 5.28249 2.5 7.52166 2.5 12C2.5 16.4783 2.5 18.7175 3.89124 20.1088C5.28249 21.5 7.52166 21.5 12 21.5C16.4783 21.5 18.7175 21.5 20.1088 20.1088C21.5 18.7175 21.5 16.4783 21.5 12V10"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<motion.path
								d="M8.5 10L12 13.5L21.0002 3.5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeDasharray="100" // Set to the length of the path
								strokeDashoffset="100" // Start with the path hidden
								animate={{ strokeDashoffset: 0 }} // Animate to reveal the path
								transition={{ duration: 1, ease: "easeInOut" }} // Duration of the drawing effect
							/>
						</motion.svg>
					) : (
						<motion.svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width={24}
							height={24}
							fill={"none"}
							initial={{ y: 10, opacity: 0, filter: "blur(5px)" }} // Initial state for entering
							animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} // Animate to visible
							exit={{ y: -10, opacity: 0, filter: "blur(5px)" }} // Animate out
							transition={{ duration: 0 }} // Duration of the transition
						>
							<path
								d="M16.9637 8.98209C16.9613 6.03194 16.9167 4.50384 16.0578 3.45753C15.892 3.25546 15.7067 3.07019 15.5047 2.90436C14.4008 1.99854 12.7609 1.99854 9.48087 1.99854C6.20089 1.99854 4.5609 1.99854 3.45708 2.90436C3.255 3.07018 3.06971 3.25546 2.90387 3.45753C1.99799 4.56128 1.99799 6.20116 1.99799 9.48091C1.99799 12.7607 1.99799 14.4005 2.90387 15.5043C3.0697 15.7063 3.255 15.8916 3.45708 16.0574C4.50346 16.9162 6.03167 16.9608 8.98201 16.9632"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M14.0283 9.02455L16.994 8.98193M14.0143 22.0013L16.9799 21.9586M21.9716 14.0221L21.9436 16.9818M9.01033 14.0357L8.98236 16.9953M11.4873 9.02455C10.6545 9.17371 9.31781 9.32713 9.01033 11.0488M19.4946 21.9586C20.3296 21.8223 21.6685 21.6894 22.0025 19.9726M19.4946 9.02455C20.3274 9.17371 21.6641 9.32713 21.9716 11.0488M11.5 21.9573C10.6672 21.8086 9.33039 21.6559 9.02197 19.9344"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</motion.svg>
					)}
				</motion.div>
			</AnimatePresence>
			<span className="font-bold text-sm select-none">
				{backgroundColor.toUpperCase()}
			</span>
		</motion.div>
	);
};

const ColorGrid = ({ data, loading }) => {
	return (
		<div className="flex flex-col w-full bg-white p-2 md:p-4 h-fit rounded-2xl md:flex-row items-center justify-center">
			{!loading ? (
				<motion.div
					className="flex w-full flex-col gap-2"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
					}}>
					{data
						.map((color) => Color(color))
						.sort((a, b) => a.hue() - b.hue() || a.lightness() - b.lightness())
						.map((colorInstance, index) => (
							<motion.div
								key={index}
								variants={{
									hidden: { opacity: 0, y: 10 },
									visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
								}}>
								<ColorBlock colorInstance={colorInstance} />
							</motion.div>
						))}
				</motion.div>
			) : (
				<div className="">
					<svg
						className="animate-spin opacity-40"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width={32}
						height={32}
						color={"#000000"}
						fill={"none"}>
						<path
							d="M12 3V6"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M12 18V21"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M21 12L18 12"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M6 12L3 12"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M18.3635 5.63672L16.2422 7.75804"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M7.75804 16.2422L5.63672 18.3635"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M18.3635 18.3635L16.2422 16.2422"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path
							d="M7.75804 7.75804L5.63672 5.63672"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			)}
		</div>
	);
};

export default ColorGrid;
