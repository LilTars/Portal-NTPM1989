import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { usePage } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function Index({ portals, filters, groups }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [search, setSearch] = React.useState(filters?.search ?? '');
    const [groupId, setGroupId] = React.useState(filters?.group_id ?? '');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingPortal, setEditingPortal] = React.useState(null);
    const isFirstFilterRun = React.useRef(true);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        group_id: '',
        name: '',
        description: '',
        url: '',
        image: null,
        is_active: true,
        _method: 'POST',
    });
    const [previewUrl, setPreviewUrl] = React.useState(null);

    React.useEffect(() => {
        if (isFirstFilterRun.current) {
            isFirstFilterRun.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(route('admin.portals.index'), {
                search,
                group_id: groupId,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [search, groupId]);

    React.useEffect(() => {
        if (!data.image) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image]);

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPortal(null);
        reset();
        clearErrors();
    };

    const openCreateModal = () => {
        setEditingPortal(null);
        setData({
            group_id: '',
            name: '',
            description: '',
            url: '',
            image: null,
            is_active: true,
            _method: 'POST',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (portal) => {
        setEditingPortal(portal);
        setData({
            group_id: portal.group_id ? String(portal.group_id) : '',
            name: portal.name ?? '',
            description: portal.description ?? '',
            url: portal.url ?? '',
            image: null,
            is_active: !!portal.is_active,
            _method: 'PUT',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submitPortal = (e) => {
        e.preventDefault();

        if (editingPortal) {
            post(route('admin.portals.update', editingPortal.id), {
                forceFormData: true,
                onSuccess: closeModal,
            });
            return;
        }

        post(route('admin.portals.store'), {
            forceFormData: true,
            onSuccess: closeModal,
        });
    };

    const clearSearch = () => {
        setSearch('');
        setGroupId('');
        router.get(route('admin.portals.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this portal?')) {
            router.delete(route('admin.portals.destroy', id));
        }
    };

    const handleToggleStatus = (portal) => {
        router.put(route('admin.portals.status', portal.id), {
            is_active: !portal.is_active,
        });
    };

    const getPreviewElement = () => {
        if (previewUrl) {
            return (
                <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="h-40 w-full object-cover"
                />
            );
        }
        if (editingPortal?.image_path) {
            return (
                <img
                    src={`/storage/${editingPortal.image_path}`}
                    alt={editingPortal.name}
                    className="h-40 w-full object-cover"
                />
            );
        }
        return (
            <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                Image preview will appear here
            </div>
        );
    };

    const getPreviewFileName = () => {
        if (data.image) {
            return data.image.name;
        }
        if (editingPortal?.image_path) {
            return 'Current image is being used';
        }
        return 'No file selected';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Portals Management
                </h2>
            }
        >
            <Head title="Portals" />

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
                        <PrimaryButton onClick={openCreateModal}>Add New Portal</PrimaryButton>
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or URL"
                            className="w-72 rounded-md border-gray-300 text-sm shadow-sm"
                        />
                        <select
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="rounded-md border-gray-300 text-sm shadow-sm"
                        >
                            <option value="">All groups</option>
                            {groups.map((group) => (
                                <option key={group.id} value={String(group.id)}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                        <span className="ml-auto text-xs text-gray-500">
                            {portals.total} results
                        </span>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Group</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {portals.data.map((portal) => (
                                    <tr key={portal.id}>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {portal.image_path ? (
                                                <img
                                                    src={`/storage/${portal.image_path}`}
                                                    alt={portal.name}
                                                    className="h-12 w-12 rounded-md border border-gray-200 object-contain bg-gray-50 p-1"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">No image</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{portal.group?.name ?? '-'}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{portal.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{portal.url}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleToggleStatus(portal)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    portal.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {portal.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(portal)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(portal.id)}
                                                className="ml-4 text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {portals.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-500">
                                            No portals found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-6 py-4">
                            {portals.links.map((link, index) => (
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

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="flex max-h-[85vh] flex-col">
                    <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {editingPortal ? 'Edit Portal' : 'Create Portal'}
                        </h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form id="portal-form" onSubmit={submitPortal} className="space-y-6 overflow-y-auto p-6">
                        <div>
                            <InputLabel htmlFor="group_id" value="Group" />
                            <select
                                id="group_id"
                                name="group_id"
                                value={data.group_id}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                onChange={(e) => setData('group_id', e.target.value)}
                            >
                                <option value="">Select a group</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.group_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="url" value="URL" />
                            <TextInput
                                id="url"
                                type="url"
                                name="url"
                                value={data.url}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('url', e.target.value)}
                            />
                            <InputError message={errors.url} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="image" value="Image" />
                            <div className="relative mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                <label
                                    htmlFor="image"
                                    className="absolute right-3 top-3 z-10 inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Choose image
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('image', e.target.files[0] || null)}
                                />
                                {getPreviewElement()}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <p className="truncate text-xs text-white">
                                        {getPreviewFileName()}
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <Checkbox
                                name="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <InputLabel htmlFor="is_active" value="Active" className="ml-2" />
                        </div>
                    </form>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <button
                            type="submit"
                            form="portal-form"
                            disabled={processing}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                        >
                            {editingPortal ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
