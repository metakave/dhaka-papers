'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from '@/types';
import { Plus, Key, ShieldCheck, Edit2, Upload, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUser } from '@/app/(dashboard)/users/actions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser, changePassword } from '@/app/(dashboard)/users/actions';
import { toast } from 'sonner';

interface UserTableProps {
    users: User[];
}

export function UserTable({ users }: UserTableProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        name_en: '',
        email: '',
        password: ''
    });

    const [editFormData, setEditFormData] = useState({
        name: '',
        name_en: '',
        email: '',
        password: '',
        hide_profile_image: false,
        profile_image: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await createUser(formData);
        setIsLoading(false);
        if (result.success) {
            toast.success("User created successfully");
            setIsCreateOpen(false);
            setFormData({ name: '', name_en: '', email: '', password: '' });
        } else {
            toast.error(result.error || "Failed to create user");
        }
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditFormData({
            name: user.name,
            name_en: user.name_en || '',
            email: user.email,
            password: '',
            hide_profile_image: user.hide_profile_image || false,
            profile_image: user.profile_image || ''
        });
        setSelectedFile(null);
        setIsEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setIsLoading(true);
        const submitData = new FormData();
        submitData.append('name', editFormData.name);
        submitData.append('name_en', editFormData.name_en);
        submitData.append('email', editFormData.email);
        submitData.append('password', editFormData.password);
        submitData.append('hide_profile_image', editFormData.hide_profile_image.toString());
        submitData.append('profile_image', editFormData.profile_image);

        if (selectedFile) {
            submitData.append('profile_image_file', selectedFile);
        }

        const result = await updateUser(selectedUser.id, submitData);
        setIsLoading(false);
        if (result.success) {
            toast.success("User updated successfully");
            setIsEditOpen(false);
            window.location.reload();
        } else {
            toast.error(result.error || "Failed to update user");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await changePassword(oldPassword, newPassword);
        setIsLoading(false);
        if (result.success) {
            toast.success("Password updated successfully");
            setIsPasswordOpen(false);
            setNewPassword('');
            setOldPassword('');
        } else {
            toast.error(result.error || "Failed to update password");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsPasswordOpen(true)}>
                        <Key className="h-4 w-4 mr-2" /> Change My Password
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Admin
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Profile Visibility</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={user.profile_image} />
                                            <AvatarFallback>
                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>
                                            <div>{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.name_en}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-primary">
                                            <ShieldCheck className="h-4 w-4" />
                                            {user.role}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${user.hide_profile_image ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.hide_profile_image ? 'Hidden' : 'Visible'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create User Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Administrator</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name (Bangla)</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name_en">Full Name (English)</Label>
                            <Input
                                id="name_en"
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Initial Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Administrator Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 py-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-2">
                                    <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : editFormData.profile_image} />
                                    <AvatarFallback>
                                        <UserIcon className="h-10 w-10 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <Upload className="h-6 w-6" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name (Bangla)</Label>
                                <Input
                                    id="edit-name"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-name-en">Name (English)</Label>
                                <Input
                                    id="edit-name-en"
                                    value={editFormData.name_en}
                                    onChange={(e) => setEditFormData({ ...editFormData, name_en: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-password">New Password (Leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editFormData.password}
                                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                id="hide-profile"
                                type="checkbox"
                                checked={editFormData.hide_profile_image}
                                onChange={(e) => setEditFormData({ ...editFormData, hide_profile_image: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="hide-profile" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Hide profile photo on frontend
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change My Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="old-password">Old Password</Label>
                            <Input
                                id="old-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
