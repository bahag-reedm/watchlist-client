import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Disclosure
            as="nav"
            className="relative bg-gray-800 dark:bg-gray-800/50 dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center px-2 lg:px-0">
                        <div className="shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                            <img
                                alt="Movie Watchlist"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden lg:ml-6 lg:block">
                            <div className="flex space-x-4">
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/search"
                                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                                        >
                                            Search Movies
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden lg:flex items-center gap-4">
                                <span className="text-sm text-gray-300">Welcome!</span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        <div className="flex lg:hidden">
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-indigo-500">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {user ? (
                        <>
                            <DisclosureButton as={Link} to="/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                Dashboard
                            </DisclosureButton>
                            <DisclosureButton as={Link} to="/search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                Search Movies
                            </DisclosureButton>
                            <DisclosureButton
                                as="button"
                                onClick={handleLogout}
                                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                            >
                                Logout
                            </DisclosureButton>
                        </>
                    ) : (
                        <>
                            <DisclosureButton as={Link} to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                Login
                            </DisclosureButton>
                            <DisclosureButton as={Link} to="/register" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                Register
                            </DisclosureButton>
                        </>
                    )}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}
