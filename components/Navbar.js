import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
import HeaderLogo from "./Header_Logo";
import MobileNav from "./MobileNav";
import { Toaster } from "react-hot-toast";

export default function NavBar() {
	const [currentPage, setCurrentPage] = useState("/");
	const router = useRouter();

	const pages = [
		{
			name: "ColorGPT",
			url: "/colorgpt",
		},
		{
			name: "Album Art",
			url: "/album_art",
		},
		{
			name: "Randomizer",
			url: "/randomizer",
		},
	];

	useEffect(() => {
		setCurrentPage(router.pathname);
	}, [router.pathname]);

	return (
		<div className="fixed z-[30] top-0 w-screen flex h-max px-4 pt-10">
			<Toaster position="bottom_right" />
			<div className="w-full md:w-3/5 items-center relative font-semibold justify-between rounded-full shadow-lg mx-auto top-0 h-12 pl-4 pr-2 md:pr-0  bg-white flex z-[20]">
				<div className="font-bold text-lg h-full">
					<Link href={"/"}>
						<HeaderLogo />
					</Link>
				</div>

				<div className=" h-full py-[4px] hidden md:flex ">
					{pages.map((page) => (
						<div
							key={page.name}
							className="flex h-full gap-4">
							<div className="h-full hidden md:block">
								<Link
									className={`mx-1 group  relative flex items-center px-2 h-full`}
									href={page.url}>
									{currentPage === page.url && (
										<motion.div
											layoutId="pill"
											className="absolute z-[6] cursor-none  inset-0 border-[2px] border-blue-500/10 bg-blue-400/30"
											style={{
												borderRadius: "9999px",
											}}
											transition={{
												duration: 0.5,
												type: "spring",
											}}></motion.div>
									)}
									<span
										className={`flex items-center bg-blend-exclusion text-black px-2 h-full z-10 transition-colors
                    ${currentPage === page.url ? "text-blue-500" : "text-black"}
                    `}>
										{page.name}
									</span>
								</Link>
							</div>
						</div>
					))}
				</div>
				<div className="flex md:hidden">
					<MobileNav />
				</div>
			</div>
		</div>
	);
}
