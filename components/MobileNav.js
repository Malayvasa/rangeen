import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function MobileNav() {
    const [currentPage, setCurrentPage] = useState('');
    const router = useRouter();

    useEffect(() => {
        setCurrentPage(router.pathname);
    }, [router.pathname]);

    const pages = [
        {
            name: 'Menu',
            href: '',
        },
        {
            name: 'Library',
            href: '/library',
        },
        {
            name: 'Randomizer',
            href: '/randomizer',
        },
        {
            name: 'ColorGPT',
            href: '/colorgpt',
        },
        {
            name: 'Album Art',
            href: '/album_art',
        }
    ]

    return (
        <Menu
            as={'div'}
            className="relative inline-block text-left mt-[4px]"
        >
            <Menu.Button
                className="inline-flex justify-center items-center h-full bg-gray-950/5 rounded-md hover:bg-gray-950/10 px-2 py-1 mr-2"
            >

                <svg width="24px" height="24px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6 9l6 6 6-6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </Menu.Button>
            <Menu.Items
                className="absolute flex flex-col right-0 mt-4 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg  focus:outline-none"
            >
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="/randomizer"
                        >
                            Randomizer
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="/colorgpt"
                        >
                            ColorGPT
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="/album_art"
                        >
                            Album Art
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="/library"
                        >
                            Library
                        </Link>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Menu>
    )
}