import { motion } from "framer-motion";

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

export default AlbumPreview;
