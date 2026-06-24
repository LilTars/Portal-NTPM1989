import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, useForm } from '@inertiajs/react';

export default function Welcome({ portals, showLoginModal = false }) {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login.post'));
    };

    const pageClass = isDarkMode ? 'min-h-screen bg-[#141414] text-white' : 'min-h-screen bg-[#f8f5ef] text-[#1f2937]';
    const headerClass = isDarkMode ? 'border-b border-white/10' : 'border-b border-black/10 bg-white/70';
    const loginClass = isDarkMode
        ? 'rounded-full bg-[#E50914] px-5 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-red-600'
        : 'rounded-full bg-[#E50914] px-5 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-red-600';
    const modeButtonClass = isDarkMode
        ? 'rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/10'
        : 'rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-700 transition hover:bg-gray-50';
    const cardClass = isDarkMode
        ? 'group overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b1b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]'
        : 'group overflow-hidden rounded-3xl border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]';
    const imageWrapClass = isDarkMode ? 'relative h-44 overflow-hidden bg-slate-900 p-4' : 'relative h-44 overflow-hidden bg-[#f3f4f6] p-4';
    const emptyImageClass = isDarkMode
        ? 'flex h-full items-center justify-center bg-[#222] text-sm uppercase tracking-[0.2em] text-slate-400'
        : 'flex h-full items-center justify-center bg-[#e5e7eb] text-sm uppercase tracking-[0.2em] text-slate-500';
    const titleClass = isDarkMode ? 'text-xl font-semibold text-white' : 'text-xl font-semibold text-gray-900';
    const descClass = isDarkMode ? 'text-sm leading-6 text-slate-300' : 'text-sm leading-6 text-gray-600';
    const offlineClass = isDarkMode
        ? 'rounded-full bg-slate-600 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200'
        : 'rounded-full bg-gray-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gray-700';
    const modalOverlayClass = isDarkMode ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4';
    const modalClass = isDarkMode
        ? 'w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6'
        : 'w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 text-gray-900 shadow-xl';
    const inputClass = isDarkMode
        ? 'w-full rounded-lg border border-white/20 bg-[#111] px-3 py-2 text-sm text-white outline-none'
        : 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none';
    const closeClass = isDarkMode ? 'rounded-md px-2 py-1 text-slate-300 hover:bg-white/10' : 'rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100';
    const helperClass = isDarkMode ? 'text-center text-xs text-slate-400' : 'text-center text-xs text-gray-500';

    return (
        <div className={pageClass}>
            {/* Header */}
            <header className={headerClass}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="h-14 w-auto" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDarkMode((value) => !value)}
                            className={modeButtonClass}
                        >
                            {isDarkMode ? 'Dark' : 'Light'} Mode
                        </button>
                        <Link
                            href={route('login')}
                            className={loginClass}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-12">
                <section className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#E50914]">
                        Web Portal NTPM1989
                    </p>
                </section>

                {/* Portal Grid */}
                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portals.map((portal) => (
                        <a
                            key={portal.id}
                            href={portal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cardClass}
                        >
                            {/* Image Container */}
                            <div className={imageWrapClass}>
                                {portal.image_path ? (
                                    <img
                                        src={`/storage/${portal.image_path}`}
                                        alt={portal.name}
                                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className={emptyImageClass}>
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-3 p-5">
                                <div className="flex items-center justify-between">
                                    <h2 className={titleClass}>
                                        {portal.name}
                                    </h2>
                                    {!portal.is_active && (
                                        <span className={offlineClass}>
                                            Offline
                                        </span>
                                    )}
                                </div>
                                <p className={descClass}>
                                    {portal.description.substring(0, 140)}
                                    {portal.description.length > 140 ? '...' : ''}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#E50914]">
                                    <span>Visit portal</span>
                                    <i className="fa-solid fa-arrow-right-long"></i>
                                </div>
                            </div>
                        </a>
                    ))}
                </section>
            </main>

            {showLoginModal && (
                <div className={modalOverlayClass}>
                    <div className={modalClass}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Login</h2>
                            <Link
                                href={route('home')}
                                className={closeClass}
                            >
                                x
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Username or Email"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.login && <p className="mt-1 text-xs text-red-400">{errors.login}</p>}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-[#E50914] px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-red-600 disabled:opacity-60"
                            >
                                Sign In
                            </button>

                            <div className={helperClass}>
                                No account?{' '}
                                <Link href={route('register.simple')} className="text-[#E50914] hover:underline">
                                    Create user
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
