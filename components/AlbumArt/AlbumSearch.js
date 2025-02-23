/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";

const AlbumSearch = ({
	loadingAlbums,
	searchString,
	setSearchString,
	albums,
	handleAlbumSelect,
}) => {
	return (
		<div className="flex flex-col rounded-3xl border-2 border-black border-opacity-10">
			<div className="flex flex-row gap-2 w-full text-black/40 placeholder-black placeholder-opacity-40 rounded-t-3xl outline-none p-2 md:p-2">
				{loadingAlbums ? (
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
				) : (
					<div className="">
						<svg
							className="opacity-40"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="none"
							strokeWidth="1.5"
							color="#000"
							viewBox="0 0 24 24">
							<path
								stroke="#000"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.5 15.5 19 19M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0"></path>
						</svg>
					</div>
				)}
				<input
					className="bg-transparent outline-none w-full text-black placeholder-black placeholder-opacity-80"
					placeholder={`Search for an album`}
					autoComplete="off"
					id="search"
					value={searchString}
					onChange={(e) => {
						setSearchString(e.target.value);
					}}
				/>
			</div>
			<div className=" max-w-[300px] w-96 ">
				{albums.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: "auto" }}
						animate={{ opacity: 1, height: "auto" }}
						key={albums}
						className="border-t-2 border-black border-opacity-10 flex flex-col w-full max-h-36 md:max-h-64 overflow-y-scroll">
						{albums.map((album, key) => (
							<div
								key={key}
								onClick={() => {
									handleAlbumSelect(album);
								}}
								className="cursor-pointer group py-2 px-4 flex flex-row max-w-[300px] w-96 items-center hover:bg-opacity-5">
								<img
									src={album.images[2].url}
									width={50}
									height={50}
									alt="album cover"
									className=" opacity-60 group-hover:opacity-100"
								/>
								<div className="ml-4 text-sm text-black text-opacity-40 group-hover:text-opacity-80">
									{album.name}
								</div>
							</div>
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default AlbumSearch;
