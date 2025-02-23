/* eslint-disable @next/next/no-img-element */
import { usePalette } from "color-thief-react";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import ExportModal from "@/components/ExportModal";
import toast from "react-hot-toast";

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

const AlbumPreview = ({ album }) => {
	return (
		<div className="bg-gray-100 flex flex-row md:flex-col items-center p-4 rounded-md">
			<motion.div
				initial={{
					y: 20,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				exit={{
					y: -20,
					opacity: 0,
				}}
				transition={{ duration: 0.3 }}
				key={album.name}
				id="albumPreview"
				className="z-10 shadow-sm albumImage rounded-md w-[50px] md:min-w-[250px] aspect-square"></motion.div>
			<div className="flex flex-col text-center mt-2 h-8 justify-center items-center">
				<div className="text-black w-24 text-sm truncate">{album.name}</div>
				<div className="text-black text-opacity-40 w-24 text-sm truncate">
					{album.artists[0].name}
				</div>
			</div>
		</div>
	);
};

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

const AlbumArt = () => {
	const [loadingAlbums, setLoadingAlbums] = useState(false);
	const [albums, setAlbums] = useState([]);
	const [selectedAlbum, setSelectedAlbum] = useState({
		artists: [
			{
				external_urls: {
					spotify: "https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of",
				},
				href: "https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of",
				id: "0LyfQWJT6nXafLPZqxe9Of",
				name: "Joji",
				type: "artist",
				uri: "spotify:artist:0LyfQWJT6nXafLPZqxe9Of",
			},
		],
		name: "Afterthought",
		id: "3MZsBdqDrRTJihTHQrO6Dq",
		images: [
			{
				url: "https://i.scdn.co/image/ab67616d0000b27353f6fa0d2589c6a7174f4b81",
			},
			{
				url: "https://i.scdn.co/image/ab67616d0000b27353f6fa0d2589c6a7174f4b81",
			},
		],
	});
	const [searchString, setSearchString] = useState("");
	const { data, loading: colorThiefLoading } = usePalette(
		selectedAlbum.images[0].url,
		10,
		"hex",
		{
			crossOrigin: "anonymous",
			quality: 10,
		}
	);

	const GetData = useCallback(async () => {
		// if search string is empty, return
		if (searchString === "") {
			setAlbums([]);
			return;
		}

		setLoadingAlbums(true); // Set loading state to true before fetching

		try {
			const response = await fetch("/api/album?search=true", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					searchString: searchString,
				}),
			});

			if (!response.ok) {
				toast.error("Failed to fetch albums. Please try again.");
				setAlbums([]);
				setLoadingAlbums(false); // Ensure loading state is reset
				return;
			}

			let albumsData = await response.json();
			setAlbums(albumsData);
		} catch (error) {
			toast.error("Network error. Please try again.");
		} finally {
			setLoadingAlbums(false); // Ensure loading state is reset
		}
	}, [searchString]);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			GetData();
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [GetData]);

	const handleAlbumSelect = (album) => {
		console.log(album);
		setSelectedAlbum(album);
	};

	useEffect(() => {
		if (data) {
			document.documentElement.style.setProperty(
				"--image",
				`url('${selectedAlbum.images[0].url}')`
			);
		}
	}, [selectedAlbum, data]);

	return (
		<div className=" h-screen w-screen relative flex justify-center bg-gray-100 items-center p-4 md:py-32 md:px-32">
			<div className="w-full relative h-full overflow-y-scroll bg-white flex flex-col gap-4 md:flex-row justify-center items-center rounded-3xl py-8 md:mt-0">
				<div className="flex flex-col mt-14 md:mt-0 md:flex-row gap-4 justify-center items-center">
					<AlbumSearch
						loadingAlbums={loadingAlbums}
						searchString={searchString}
						setSearchString={setSearchString}
						albums={albums}
						handleAlbumSelect={handleAlbumSelect}
					/>
					<div>
						{selectedAlbum && (
							<AlbumPreview album={selectedAlbum} /> // Use the new component
						)}
					</div>
				</div>
				<div className="min-w-[320px]  h-full min-h-[200px] flex justify-center items-center">
					<ColorGrid
						data={data}
						loading={colorThiefLoading}
					/>
				</div>
			</div>
		</div>
	);
};

export default AlbumArt;
