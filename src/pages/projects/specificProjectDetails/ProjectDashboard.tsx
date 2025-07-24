import { Card, Col, Row, Statistic, Typography, Progress, Badge } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const mockData = {
  projectName: 'Green Office Tower',
  budget: 75000,
  approvedBudget: 72000,
  materialCost: 22000,
  labourCost: 18000,
  subcontractorCost: 16000,
  profit: 16000,
  utilization: 85,
  progress: 70,
  daysRemaining: 25,
  snaggingFound: 12,
  snaggingResolved: 9,
  siteImages: 48,
  reports: 10,
  documents: 22,
  certificates: 3,
  notes: 5,
  assignedAdmin: 'John Doe',
  assignedDate: '2025-07-01',
  clientName: 'GreenTech Ltd.',
  projectStatus: 'On Going'
};

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Helper function to redirect on click
  const handleNavigate = (path: string) => {
    if (projectId) {
      navigate(`/projects/${projectId}/${path}`);
    }
  };

  return (
    <div className="p-6">
      <Title level={3}>{mockData.projectName} - Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}><Card><Statistic title="Total Budget" prefix="$" value={mockData.budget} /></Card></Col>
        <Col span={6}><Card><Statistic title="Approved Budget" prefix="$" value={mockData.approvedBudget} /></Card></Col>
        <Col span={6}><Card><Statistic title="Profit" prefix="$" value={mockData.profit} /></Card></Col>
        <Col span={6}><Card><Statistic title="Utilization" suffix="%" value={mockData.utilization} /></Card></Col>

        <Col span={6}><Card><Statistic title="Material Cost" prefix="$" value={mockData.materialCost} /></Card></Col>
        <Col span={6}><Card><Statistic title="Labour Cost" prefix="$" value={mockData.labourCost} /></Card></Col>
        <Col span={6}><Card><Statistic title="Subcontractor Cost" prefix="$" value={mockData.subcontractorCost} /></Card></Col>
        <Col span={6}><Card><Statistic title="Days Remaining" value={mockData.daysRemaining} /></Card></Col>

        <Col span={12}><Card><Statistic title="Project Completion" valueRender={() => <Progress percent={mockData.progress} />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Snagging Found" value={mockData.snaggingFound} /></Card></Col>
        <Col span={6}><Card><Statistic title="Snagging Resolved" value={mockData.snaggingResolved} /></Card></Col>

        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate('site-pictures-reports')}>
            <Statistic title="Site Images" value={mockData.siteImages} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate('reports')}>
            <Statistic title="Reports Submitted" value={mockData.reports} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate('documents')}>
            <Statistic title="Documents Uploaded" value={mockData.documents} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate('certificates')}>
            <Statistic title="Certificates Issued" value={mockData.certificates} />
          </Card>
        </Col>

        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate('notes')}>
            <Statistic title="Notes" value={mockData.notes} />
          </Card>
        </Col>
        <Col span={6}><Card><Statistic title="Assigned Admin" value={mockData.assignedAdmin} /></Card></Col>
        <Col span={6}><Card><Statistic title="Client Name" value={mockData.clientName} /></Card></Col>
        <Col span={6}><Card><Statistic title="Project Status" valueRender={() => <Badge status="success" text={mockData.projectStatus} />} /></Card></Col>
      </Row>
    </div>
  );
};

export default ProjectDashboard;
