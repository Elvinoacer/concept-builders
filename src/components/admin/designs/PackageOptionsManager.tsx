
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiPlus, FiSave, FiTrash, FiEdit, FiX, FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';
import FileUpload from './FileUpload';

interface PackageOption {
  id: string;
  name: string;
  price: number;
  file?: any;
}

interface PackageOptionsManagerProps {
  designId: string;
  initialOptions: PackageOption[];
}

const PackageOptionsManager = ({ designId, initialOptions }: PackageOptionsManagerProps) => {
  const [options, setOptions] = useState<PackageOption[]>(initialOptions);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedOption, setEditedOption] = useState<PackageOption | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newOption, setNewOption] = useState<{ name: string; price: string; file: any[] }>({ name: '', price: '', file: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/designs/${designId}/package-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newOption.name,
          price: parseFloat(newOption.price),
          file: newOption.file?.[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create package option');
      }

      const createdOption = await response.json();
      setOptions([...options, createdOption]);
      setNewOption({ name: '', price: '', file: [] });
      setIsCreating(false);
      toast.success('Package option created successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedOption) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/package-options/${editedOption.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedOption.name,
          price: parseFloat(editedOption.price.toString()),
          file: editedOption.file?.[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update package option');
      }

      const updatedOption = await response.json();
      setOptions(options.map(opt => opt.id === updatedOption.id ? updatedOption : opt));
      setIsEditing(null);
      setEditedOption(null);
      toast.success('Package option updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (optionId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/package-options/${optionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete package option');
      }

      setOptions(options.filter(opt => opt.id !== optionId));
      toast.success('Package option deleted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (option: PackageOption) => {
    setIsEditing(option.id);
    setEditedOption({ ...option });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditedOption(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mt-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Package Options</h3>
      <div className="space-y-4">
        {options.map(option => (
          <div key={option.id} className="p-4 border rounded-md space-y-2">
            {isEditing === option.id && editedOption ? (
              <div className="space-y-4">
                <Input
                  placeholder="Option Name"
                  value={editedOption.name}
                  onChange={(e) => setEditedOption({ ...editedOption, name: e.target.value })}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={editedOption.price}
                  onChange={(e) => setEditedOption({ ...editedOption, price: parseFloat(e.target.value) })}
                />
                <FileUpload
                  onUploadSuccess={(files) => setEditedOption({ ...editedOption, file: files })}
                  onFileRemove={() => setEditedOption({ ...editedOption, file: [] })}
                  initialFiles={editedOption.file ? [editedOption.file] : []}
                  fileTypeCategory="FILE"
                  multiple={false}
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} disabled={isLoading}>{isLoading ? <FiLoader className="animate-spin" /> : <FiSave />} Save</Button>
                  <Button variant="ghost" onClick={cancelEdit}><FiX /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{option.name}</p>
                  <p className="text-sm text-gray-500">${option.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => startEdit(option)}><FiEdit /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(option.id)} disabled={isLoading}>{isLoading ? <FiLoader className="animate-spin" /> : <FiTrash />}</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isCreating ? (
        <div className="mt-4 p-4 border rounded-md space-y-4">
          <h4 className="text-lg font-semibold">New Package Option</h4>
          <Input
            placeholder="Option Name"
            value={newOption.name}
            onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
          />
          <Input
            placeholder="Price"
            type="number"
            value={newOption.price}
            onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
          />
          <FileUpload
            onUploadSuccess={(files) => setNewOption({ ...newOption, file: files })}
            onFileRemove={() => setNewOption({ ...newOption, file: [] })}
            initialFiles={[]}
            fileTypeCategory="FILE"
            multiple={false}
          />
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={isLoading}>{isLoading ? <FiLoader className="animate-spin" /> : <FiSave />} Create</Button>
            <Button variant="ghost" onClick={() => setIsCreating(false)}><FiX /> Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsCreating(true)} className="mt-4"><FiPlus className="mr-2" /> Add Package Option</Button>
      )}
    </div>
  );
};

export default PackageOptionsManager;
