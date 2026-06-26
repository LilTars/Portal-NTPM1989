import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ groups }) {
    const { data, setData, post, processing, errors } = useForm({
        group_id: '',
        name: '',
        description: '',
        url: '',
        image: null,
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('group_id', data.group_id);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('url', data.url);
        if (data.image) formData.append('image', data.image);
        formData.append('is_active', data.is_active);

        post(route('admin.portals.store'), {
            data: formData,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Portal
                </h2>
            }
        >
            <Head title="Create Portal" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6 p-6">
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
                                <input
                                    id="image"
                                    type="file"
                                    name="image"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                />
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

                            <div className="flex items-center justify-end gap-4">
                                <PrimaryButton disabled={processing}>
                                    Create
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
