/* eslint-disable @next/next/no-img-element */
import { usePalette } from "color-thief-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import AlbumSearch from "@/components/AlbumArt/AlbumSearch";
import AlbumPreview from "@/components/AlbumArt/AlbumPreview";
import ColorGrid from "@/components/AlbumArt/ColorGrid";

const defaultSelectedAlbum = {
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
};

const AlbumArt = () => {
	const [loadingAlbums, setLoadingAlbums] = useState(false);
	const [albums, setAlbums] = useState([]);
	const [selectedAlbum, setSelectedAlbum] = useState(defaultSelectedAlbum);
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
					<div>{selectedAlbum && <AlbumPreview album={selectedAlbum} />}</div>
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
