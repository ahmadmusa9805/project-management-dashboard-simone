import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Select, Button, Upload } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useCreateBasicAdminMutation, useCreateClientMutation, useCreatePrimeAdminMutation } from '../../Redux/features/users/usersApi';
import { errorAlert, successAlert } from '../../utils/alerts';


const { Option } = Select;

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  contact: z.string().min(6, 'Contact number required'),
  address: z.string().min(3, 'Address is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  estimateNumber: z.string().optional(),
  projectType: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['prime-admin', 'basic-admin', 'client'], 'User type is required'),
  photo: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormData>;
  onSubmitSuccess?: () => void;
  onCancel: () => void;
}

const UserCreateEditPage = ({ mode, defaultValues, onSubmitSuccess, onCancel }: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const [projectTypes, setProjectTypes] = useState(['Construction', 'Repair']);
  const [newProjectType, setNewProjectType] = useState('');
  const location = useLocation();
  const path = location.pathname;

  const [createClient, ] = useCreateClientMutation();
  const [createPrimeAdmin, ] = useCreatePrimeAdminMutation();
  const [createBasicAdmin, ] = useCreateBasicAdminMutation();

  
const allowedRoles = useMemo<FormData['role'][]>(() => {
  if (path.includes('prime-admins')) {
    return mode === 'edit' ? ['prime-admin', 'basic-admin'] : ['prime-admin'];
  } else if (path.includes('basic-admins')) {
    return ['basic-admin'];
  } else if (path.includes('clients')) {
    return ['client'];
  } else {
    return [];
  }
}, [path, mode]);

const showClientFields = useMemo(() => {
  return path.includes('clients');
}, [path]);


  useEffect(() => {
    if (mode === 'create' && allowedRoles.length === 1) {
      setValue('role', allowedRoles[0]);
    }
  }, [mode, allowedRoles, setValue]);

  const role = watch('role');

  const handleAddProjectType = () => {
    if (newProjectType && !projectTypes.includes(newProjectType)) {
      setProjectTypes((prev) => [...prev, newProjectType]);
      setValue('projectType', newProjectType);
      setNewProjectType('');
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (mode === 'edit') {
        // Edit logic here (if implemented)
        return;
      }

      let response;
      if (data.role === 'client') {
        response = await createClient(data).unwrap();
      } else if (data.role === 'prime-admin') {
        response = await createPrimeAdmin(data).unwrap();
      } else if (data.role === 'basic-admin') {
        response = await createBasicAdmin(data).unwrap();
      }
      onSubmitSuccess?.();
      console.log('User created successfully:', response);
      if(response.success) {
        successAlert('success',response.message);
      }   
    } catch (err: any) {
errorAlert('Error', err?.data?.message);
    }
  };


  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full bg-white rounded shadow-lg p-6 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-[#000E0F]">
        {mode === 'edit' ? 'Edit User' : 'Create a New User'}
      </h2>

      {/* Personal Details */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Personal Details</h3>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input {...field} placeholder="Name" status={errors.name ? 'error' : ''} />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input {...field} placeholder="Email" status={errors.email ? 'error' : ''} />
          )}
        />
        <Controller
          control={control}
          name="contact"
          render={({ field }) => (
            <Input {...field} placeholder="Contact Number" status={errors.contact ? 'error' : ''} />
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input {...field} placeholder="Address" status={errors.address ? 'error' : ''} />
          )}
        />
        <Controller
          control={control}
          name="postalCode"
          render={({ field }) => (
            <Input {...field} placeholder="Postal Code" status={errors.postalCode ? 'error' : ''} />
          )}
        />
      </div>

      {/* Upload */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Upload Photo</h3>
        <Controller
          control={control}
          name="photo"
          render={({ field }) => (
            <Upload beforeUpload={() => false} onChange={({ file }) => field.onChange(file)}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          )}
        />
      </div>

      {/* Role */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">User Type</h3>
      
 <Controller
  control={control}
  name="role"
  render={({ field }) => {
    if (allowedRoles.length === 1) {
      return <Input value={allowedRoles[0]} disabled />;
    }

    return (
      <Select {...field} placeholder="Select user type">
        {allowedRoles.map((r) => (
          <Option key={r} value={r}>
            {r === 'prime-admin'
              ? 'Prime Admin'
              : r === 'basic-admin'
              ? 'Basic Admin'
              : 'Client'}
          </Option>
        ))}
      </Select>
    );
  }}
/>


      </div>

      {/* Client specific */}
      {showClientFields && role === 'client' &&  (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Account Details</h3>
          <Controller
            control={control}
            name="estimateNumber"
            render={({ field }) => (
              <Input {...field} placeholder="Estimate Number" />
            )}
          />
          <Controller
  control={control}
  name="projectType"
  render={({ field }) => (
    <>
      <Select
        {...field}
        placeholder="Select project type"
        dropdownRender={(menu) => (
          <div>
            {menu}
            <div className="flex items-center p-2 gap-2">
              <Input
                placeholder="Add new type"
                value={newProjectType}
                onChange={(e) => setNewProjectType(e.target.value)}
              />
              <Button
                icon={<PlusOutlined />}
                type="dashed"
                onClick={handleAddProjectType}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      >
        {projectTypes.map((type) => (
          <Option key={type} value={type}>
            {type}
          </Option>
        ))}
      </Select>

      {/* Show current projectTypes with delete buttons */}
      <div className="flex gap-2 flex-wrap mt-2">
        {projectTypes.map((type) => (
          <div key={type} className="flex items-center gap-1 border px-2 py-1 rounded bg-gray-100">
            <span>{type}</span>
            <Button
              size="small"
              type="text"
              danger
              onClick={() => {
                // If the removed type is selected, reset form field
                if (field.value === type) {
                  setValue('projectType', '');
                }
                setProjectTypes(projectTypes.filter((t) => t !== type));
              }}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>
    </>
  )}
/>

        </div>
      )}

      {/* Password */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Set Default Password</h3>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input.Password {...field} placeholder="Password" status={errors.password ? 'error' : ''} />
          )}
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button htmlType="submit" type="primary" className="bg-[#001D01]">
          {mode === 'edit' ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default UserCreateEditPage;
