import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { usePage } from '@inertiajs/react';

export default function Index({ groups, filters }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [search, setSearch] = React.useState(filters?.search ?? '');
    const isFirstSearchRun = React.useRef(true);

    React.useEffect(() => {
        if (isFirstSearchRun.current) {
            isFirstSearchRun.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(route('admin.groups.index'), {
                search,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.groups.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this group?')) {
            router.delete(route('admin.groups.destroy', id));
        }
    };

    const handleToggleStatus = (group) => {
        router.put(route('admin.groups.status', group.id), {
            is_active: !group.is_active,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Groups Management
                </h2>
            }
        >
            <Head title="Groups" />

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
                        <Link href={route('admin.groups.create')}>
                            <PrimaryButton>Add New Group</PrimaryButton>
                        </Link>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search group name"
                            className="w-80 rounded-md border-gray-300 text-sm shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {groups.data.map((group) => (
                                    <tr key={group.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{group.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleToggleStatus(group)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    group.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {group.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            <Link href={route('admin.groups.edit', group.id)} className="text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(group.id)}
                                                className="ml-4 text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {groups.data.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-6 text-center text-sm text-gray-500">
                                            No groups found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-6 py-4">
                            {groups.links.map((link, index) => (
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
