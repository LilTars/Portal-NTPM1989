import { Head, Link, useForm } from '@inertiajs/react';

export default function RegisterSimple() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register.simple.post'));
    };

    return (
        <div className="min-h-screen bg-[#141414] px-4 py-12 text-white">
            <Head title="Create User" />
            <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6">
                <h1 className="mb-5 text-xl font-semibold">Create User</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-[#111] px-3 py-2 text-sm text-white outline-none"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-[#111] px-3 py-2 text-sm text-white outline-none"
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-[#111] px-3 py-2 text-sm text-white outline-none"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-[#E50914] px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-red-600 disabled:opacity-60"
                    >
                        Create
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-slate-400">
                    <Link href={route('home')} className="text-[#E50914] hover:underline">
                        Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
