
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Upload,
  Typography,
} from 'antd';
import { CloudUpload } from 'lucide-react';
import moment from 'moment';
import { projectSchema } from '../../types/projectAllTypes/projectSchema';

const { Option } = Select;
const { Dragger } = Upload;
const { Text } = Typography;

type ProjectForm = z.infer<typeof projectSchema>;

interface CreateProjectFormProps {
  onSubmit: (data: ProjectForm) => void;
  defaultValues?: Partial<ProjectForm>;
  submitText?: string;
  isEdit?: boolean;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onSubmit,
  defaultValues,
  submitText = 'Create Project',
  isEdit = false,
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

  const renderError = (name: keyof ProjectForm) =>
    errors[name] && <Text type="danger">{(errors[name]?.message as string) || 'Required'}</Text>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#000E0F]">{submitText}</h2>

      <div className="flex flex-col gap-3">
        {[
          ['projectName', 'Project Name'],
          ['clientName', 'Client Name'],
          ['description', 'Description'],
          ['contractReference', 'Contract Reference'],
          ['projectAddress', 'Project Address'],
          ['primaryContact', 'Primary Contact'],
        ].map(([name, label]) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="font-medium">{label}</label>
            <Controller
              control={control}
              name={name as keyof ProjectForm}
              render={({ field }) =>
                name === 'description' ? (
                  <Input.TextArea {...field} id={name} rows={4} />
                ) : (
                  <Input {...field} id={name} />
                )
              }
            />
            {renderError(name as keyof ProjectForm)}
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label htmlFor="projectType" className="font-medium">Project Type</label>
          <Controller
            control={control}
            name="projectType"
            render={({ field }) => (
              <Select {...field} id="projectType" placeholder="Select Project Type">
                <Option value="Renovation">Renovation</Option>
                <Option value="New Build">New Build</Option>
                <Option value="Extension">Extension</Option>
              </Select>
            )}
          />
          {renderError('projectType')}
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Start Date</label>
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
              {renderError('startDate')}
            </div>
          </Col>

          <Col span={12}>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Estimated Completion Date</label>
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
              {renderError('estimatedCompletionDate')}
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Contract Date</label>
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
              {renderError('contractDate')}
            </div>
          </Col>

          <Col span={12}>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Contract PDF</label>
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
                    style={{ padding: '8px' }}
                  >
                    <p className="text-center flex flex-col items-center">
                      <CloudUpload size={24} color="#83ac72" strokeWidth={2.5} />
                    </p>
                    <p className="text-[10px]">Click or drag PDF to upload</p>
                  </Dragger>
                )}
              />
              {renderError('contractPdf')}
            </div>
          </Col>
        </Row>

        {[['contractValue', 'Contract Value'], ['estimatedBudget', 'Estimated Budget'], ['overheadCost', 'Overhead Cost']].map(
          ([name, label]) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="font-medium">{label}</label>
              <Controller
                control={control}
                name={name as keyof ProjectForm}
                render={({ field }) => (
                  <InputNumber {...field} style={{ width: '100%' }} id={name} />
                )}
              />
              {renderError(name as keyof ProjectForm)}
            </div>
          )
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="billingCurrency" className="font-medium">Billing Currency</label>
          <Controller
            control={control}
            name="billingCurrency"
            render={({ field }) => (
              <Select {...field} id="billingCurrency" placeholder="Billing Currency">
                <Option value="USD">USD</Option>
                <Option value="GBP">GBP</Option>
                <Option value="EUR">EUR</Option>
              </Select>
            )}
          />
          {renderError('billingCurrency')}
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-medium">Milestones</label>
          {fields.map((item, index) => (
            <Space key={item.id} style={{ marginBottom: 8 }} align="baseline" wrap>
              <Controller
                control={control}
                name={`milestones.${index}.name` as const}
                render={({ field }) => (
                  <Input placeholder="Milestone Title" {...field} />
                )}
              />
              <Controller
                control={control}
                name={`milestones.${index}.date` as const}
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
      </div>

      {isEdit && (
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="font-medium">Project Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select {...field} id="status" placeholder="Select Project Status">
                <Option value="ongoing">Ongoing</Option>
                <Option value="completed">Completed</Option>
                <Option value="pending">Pending</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            )}
          />
          {renderError('status')}
        </div>
      )}

      <div className="flex justify-end">
        <Button htmlType="submit" className="!bg-[#0d542b] !text-white">
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
