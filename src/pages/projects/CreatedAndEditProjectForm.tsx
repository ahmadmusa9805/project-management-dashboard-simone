
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Select, DatePicker, InputNumber, Button, Space, Row, Col, Upload } from 'antd';

import { CloudUpload } from 'lucide-react';
import moment from 'moment';
import { projectSchema } from '../../types/projectAllTypes/projectSchema';

const { Option } = Select;
const { Dragger } = Upload;

type ProjectForm = z.infer<typeof projectSchema>;

interface CreateProjectFormProps {
  onSubmit: (data: ProjectForm) => void;
  defaultValues?: Partial<ProjectForm>;
  submitText?: string;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onSubmit,
  defaultValues,
  submitText = 'Create Project',
}) => {
  const {
    control,
    handleSubmit,
    
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      team: [],
      milestones: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestones',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#000E0F]">{submitText}</h2>

      <Controller
        control={control}
        name="projectName"
        render={({ field }) => (
          <Input {...field} placeholder="Project Name" status={errors.projectName ? 'error' : ''} />
        )}
      />

      <Controller
        control={control}
        name="clientName"
        render={({ field }) => (
          <Input {...field} placeholder="Client Name" status={errors.clientName ? 'error' : ''} />
        )}
      />

      <Controller
        control={control}
        name="projectType"
        render={({ field }) => (
          <Select {...field} placeholder="Select Project Type">
            <Option value="Renovation">Renovation</Option>
            <Option value="New Build">New Build</Option>
            <Option value="Extension">Extension</Option>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input.TextArea {...field} placeholder="Description" rows={4} />
        )}
      />

      <Row gutter={16}>
        <Col span={12}>
          <Controller
          
            control={control}
            name="startDate"
            
            render={({ field }) => (
              <DatePicker
              placeholder="Start Date"
                {...field}
                value={field.value ? moment(field.value) : null}
                onChange={(_, dateString) => field.onChange(dateString)}
                style={{ width: '100%' }}
              />
            )}
          />
        </Col>
        <Col span={12}>
          <Controller
            control={control}
            name="estimatedCompletionDate"
            render={({ field }) => (
              <DatePicker
                placeholder="Estimated Completion Date"
                {...field}
                value={field.value ? moment(field.value) : null}
                onChange={(_, dateString) => field.onChange(dateString)}
                style={{ width: '100%' }}
              />
            )}
          />
        </Col>
      </Row>

      <Row gutter={25}>
        <Col span={12}>
          <Controller
            control={control}
            name="contractDate"
            render={({ field }) => (
              <DatePicker
                placeholder="Contract Date"
                {...field}
                value={field.value ? moment(field.value) : null}
                onChange={(_, dateString) => field.onChange(dateString)}
                style={{ width: '100%' }}
              />
            )}
          />
        </Col>

        <Col span={12}>
          <Controller
            control={control}
            name="contractPdf"
            render={({ field }) => (
              <Dragger
                name="file"
                accept=".pdf"
                beforeUpload={(file) => {
                  field.onChange(file);
                  return false;
                }}
                multiple={false}
                fileList={field.value ? [field.value] : []}
                onRemove={() => field.onChange(undefined)}
              >
                <p className="text-center flex flex-col items-center">
                  <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
                </p>
                <p className="text-[10px]">Click or drag PDF to upload</p>
              </Dragger>
            )}
          />
        </Col>
      </Row>

      <Controller
        control={control}
        name="contractReference"
        render={({ field }) => (
          <Input {...field} placeholder="Contract Reference" />
        )}
      />

      <Controller
        control={control}
        name="contractValue"
        render={({ field }) => (
          <InputNumber {...field} style={{ width: '100%' }} placeholder="Contract Value" />
        )}
      />

      <Controller
        control={control}
        name="estimatedBudget"
        render={({ field }) => (
          <InputNumber {...field} style={{ width: '100%' }} placeholder="Estimated Budget" />
        )}
      />

      <Controller
        control={control}
        name="overheadCost"
        render={({ field }) => (
          <InputNumber {...field} style={{ width: '100%' }} placeholder="Overhead Cost" />
        )}
      />

      <Controller
        control={control}
        name="billingCurrency"
        render={({ field }) => (
          <Select {...field} placeholder="Billing Currency">
            <Option value="USD">USD</Option>
            <Option value="GBP">GBP</Option>
            <Option value="EUR">EUR</Option>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="projectAddress"
        render={({ field }) => (
          <Input {...field} placeholder="Project Address" />
        )}
      />

      <Controller
        control={control}
        name="primaryContact"
        render={({ field }) => (
          <Input {...field} placeholder="Primary Contact" />
        )}
      />

      <div className="flex flex-col gap-4">
        <label className="font-medium">Milestones</label>
        {fields.map((item, index) => (
          <Space key={item.id} style={{ marginBottom: 8 }} align="baseline" wrap>
            <Controller
              control={control}
              name={`milestones.${index}.name`}
              render={({ field }) => (
                <Input placeholder="Milestone Title" {...field} />
              )}
            />
            <Controller
              control={control}
              name={`milestones.${index}.date`}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                  onChange={(_, dateString) => field.onChange(dateString)}
                  style={{ width: 150 }}
                />
              )}
            />
            <Input placeholder="Note (optional)" />
            <Button danger onClick={() => remove(index)}>Remove</Button>
          </Space>
        ))}
        <Button
          type="dashed"
          onClick={() => append({ name: '', date: moment().format('YYYY-MM-DD') })}
        >
          + Add Milestone
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="primary" htmlType="submit" className="bg-[#001D01]">
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
