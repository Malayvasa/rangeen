/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion"; // If you are using motion, keep this import
import ExportModal from "@/components/ExportModal"; // Ensure this import is correct

const ColorGrid = ({ data, loading }) => {
	return (
		<div className="flex flex-col items-center justify-center">
			{!loading ? (
				<>
					<div className="grid grid-cols-5">
						{data.map((color, index) => {
							return (
								<div
									key={index}
									className="group w-16 flex flex-col items-center gap-2">
									<div
										className="w-12 h-12 rounded-full"
										style={{ backgroundColor: color }}></div>
									<div className=" text-transparent group-hover:text-gray-300 transition-all duration-200">
										{color}
									</div>
								</div>
							);
						})}
					</div>
					<ExportModal hexList={data}>
						<button className="flex justify-center items-center gap-2 bg-slate-200 h-full w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="none"
								strokeWidth="1.5"
								color="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 20h12M12 4v12m0 0 3.5-3.5M12 16l-3.5-3.5"></path>
							</svg>
							<span className="text-sm">Export</span>
						</button>
					</ExportModal>
				</>
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
