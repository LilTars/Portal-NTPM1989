import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { usePage } from '@inertiajs/react';

export default function Index({ users, filters }) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const flash = props.flash || {};
    const [search, setSearch] = React.useState(filters?.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.users.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (authUser?.id === id) {
            alert('You cannot delete your own account.');
            return;
        }

        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const handleToggleStatus = (user) => {
        router.put(route('admin.users.status', user.id), {
            is_active: !user.is_active,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users Management
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-4">
                        <Link href={route('admin.users.create')}>
                            <PrimaryButton>Add New User</PrimaryButton>
                        </Link>
                    </div>

                    <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, username, email"
                            className="w-80 rounded-md border-gray-300 text-sm shadow-sm"
                        />
                        <PrimaryButton type="submit">Search</PrimaryButton>
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </form>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.username || '-'}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="ml-4 text-red-600 hover:text-red-900"
                                                disabled={user.id === authUser?.id}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-6 text-center text-sm text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-6 py-4">
                            {users.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded border px-3 py-1 text-sm ${link.active ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
