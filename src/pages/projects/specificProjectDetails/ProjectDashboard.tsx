/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Statistic, Typography, Badge, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleProjectQuery } from "../../../Redux/features/projects/projectsApi";
import { useGetAllExpensesQuery } from "../../../Redux/features/projects/project/costManagenent/costManagementApi";
import { useGetAllPaymentTrackerElementsQuery } from "../../../Redux/features/projects/project/paymentTracker/paymentTrackerApi";
import { useGetUserByIdQuery } from "../../../Redux/features/users/usersApi";
import { useGetSingleProjectAnalyticsQuery } from "../../../Redux/features/analytics/analyticsApi";
// import { useGetAllSnaggingsQuery } from "../../../Redux/features/projects/project/snaggingList/snaggingListApi";

// import { useGetAllNotesQuery } from "../../../Redux/features/projects/project/notes/noteApi";
// import { useGetAllDocumentFilesQuery } from "../../../Redux/features/projects/project/document/documentSubFolderFileApi";
// import { useGetAllSecondFixFilesQuery } from "../../../Redux/features/projects/project/SecondFixedList/SecondFixFileApi";
// import { useGetAllCertificatesQuery } from "../../../Redux/features/projects/project/certificate/certificateApi";
// import { useGetSiteReportsQuery } from "../../../Redux/features/projects/project/siteReportPictures/reportApi";
// import { useGetAllSitePictureImagesQuery } from "../../../Redux/features/projects/project/siteReportPictures/sitePicturesApi";
// import { useGetAllSecondFixFilesQuery } from "../../../Redux/features/projects/project/SecondFixedList/SecondFixFileApi";

//TODO: All comments will be have for next release

const { Title } = Typography;

// Mock data (replace with API responses later)
// const mappedData = {
//   projectName: "Green Office Tower",
//   budget: 75000,
//   approvedBudget: 72000,
//   materialCost: 22000,
//   labourCost: 18000,
//   subcontractorCost: 16000,
//   profit: 16000,
//   utilization: 85,
//   progress: 0,
//   daysRemaining: 25,
//   snaggingFound: 12,
//   snaggingResolved: 9,
//   siteImages: 48,
//   reports: 10,
//   documents: 22,
//   certificates: 3,
//   notes: 5,
//   assignedAdmin: "John Doe",
//   assignedDate: "2025-07-01",
//   clientName: "GreenTech Ltd.",
//   projectStatus: "On Going",
// };

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: projectAnalticsData, isLoading: isAnalyticsLoading } =
    useGetSingleProjectAnalyticsQuery(projectId!, {
      skip: !projectId,
    });
  // Queries
  const { data: singleProject, isLoading: projectLoading } =
    useGetSingleProjectQuery(
      {
        id: projectId as string,
      },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    );
  const { data: expensesData, isLoading: expenseLoading } =
    useGetAllExpensesQuery(
      { projectId },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    );

  // console.log("projectAnalticsData", projectAnalticsData.data.totalQuoteeValue);

  //  // Get single project
  //   const { data: singleProject, isLoading: projectLoading } =
  //     useGetSingleProjectQuery({ id: projectId! }, { skip: !projectId });

  // Get clientId from sharedWith (role === client)
  const clientId = singleProject?.sharedWith?.find(
    (sw: any) => sw.role === "client"
  )?.userId?._id;

  // Fetch client data
  const { data: clientData, isLoading: clientLoading } = useGetUserByIdQuery(
    clientId!,
    {
      skip: !clientId,
    }
  );

  const { data: paymentData, isLoading: paymentLoading } =
    useGetAllPaymentTrackerElementsQuery(
      {
        projectId: projectId!,
        status: "paid",
      },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    );
  // const { data: snaggingsData } = useGetAllSnaggingsQuery({ projectId });
  // const { data: imagesData } = useGetAllSitePictureImagesQuery({
  //   projectId: projectId as string,
  // });
  // const { data: notesData } = useGetAllNotesQuery({ projectId });
  // const { data: documentsData } = useGetAllDocumentFilesQuery({ projectId });
  // const { data: secondFixData } = useGetAllSecondFixFilesQuery({ projectId });
  // const { data: certificatesData } = useGetAllCertificatesQuery(
  //   { projectId },
  //   {
  //     refetchOnFocus: true,
  //     refetchOnReconnect: true,
  //   }
  // );
  // const { data: reportsData } = useGetSiteReportsQuery(projectId as string);

  // Helper to navigate
  const handleNavigate = (path: string) => {
    if (projectId) navigate(`/projects/${projectId}/${path}`);
  };

  const projectData = singleProject || {}; // API response
  // const totalImages = imagesData?.data
  //   ? imagesData?.data?.reduce((sum: number, item: any) => {
  //       return sum + (item.file?.length || 0);
  //     }, 0)
  //   : 0;

  const getAmountByName = (name: string) => {
    const item = expensesData?.find(
      (exp: { name: string }) => exp.name.toLowerCase() === name.toLowerCase()
    );
    return item ? item.amount : 0;
  };
  const isLoading =
    projectLoading ||
    expenseLoading ||
    paymentLoading ||
    clientLoading ||
    isAnalyticsLoading;
  const labourCost = getAmountByName("Labour");
  const materialCost = getAmountByName("Material");
  const subcontractorCost = getAmountByName("SubContractor");
  const totalCost = getAmountByName("Total");

  // Profit from paymentData
  const profit = paymentData?.profit || 0;
  // const projectValue= paymentData?.

  const mappedData = {
    projectName: projectData.projectName || "N/A",
    projectStatus: projectData.status || "N/A",
    clientName: clientData?.name || "N/A",
    // assignedAdmin: projectData.assignedAdmin || "N/A", // if you add later
    budget: projectAnalticsData?.data?.totalQuoteeValue || 0,
    // approvedBudget: projectData.approvedBudget || 0,
    materialCost: materialCost || 0,
    labourCost: labourCost || 0,
    subcontractorCost: subcontractorCost || 0,
    profit: profit || 0,
    totalCost: totalCost || 0,
    // utilization: projectData.utilization || 0,
    // progress: projectData.progress || 0,
    daysRemaining: projectData.endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(projectData.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0,
    // snaggingFound: snaggingsData?.length || 0,
    // snaggingResolved: 0,
    // siteImages: totalImages || 0,
    // reports: reportsData?.length || 0,
    // documents: documentsData?.length || 0,
    // certificates: certificatesData?.data?.length || 0,
    // notes: notesData?.length || 0,
  };

  return (
    <div className="w-full  gap-4 bg-white min-h-screen p-6">
      <Title level={3}>{mappedData.projectName}</Title>

      {/* Loader or Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card style={{ backgroundColor: "#f1f1f1" }}>
              <Statistic
                title="Total Budget"
                prefix="$"
                value={mappedData.budget}
              />
            </Card>
          </Col>
          {/* <Col span={6}>
          <Card>
            <Statistic
              title="Approved Budget"
              prefix="$"
              value={mappedData.approvedBudget}
            />
          </Card>
        </Col> */}

          <Col span={6}>
            <Card
              hoverable
              style={{ backgroundColor: "#f1f1f1" }}
              onClick={() => handleNavigate("payments-track")}
            >
              <Statistic title="Profit" prefix="$" value={mappedData.profit} />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ backgroundColor: "#f1f1f1" }}
              onClick={() => handleNavigate("live-project-costs")}
            >
              <Statistic
                title="Total Cost"
                prefix="$"
                value={mappedData.totalCost}
              />
            </Card>
          </Col>

          {/* <Col span={6}>
          <Card>
            <Statistic
              title="Utilization"
              suffix="%"
              value={mappedData.utilization}
            />
          </Card>
        </Col> */}

          <Col span={6}>
            <Card
              hoverable
              style={{ backgroundColor: "#f1f1f1" }}
              onClick={() => handleNavigate("live-project-costs")}
            >
              <Statistic
                title="Material Cost"
                prefix="$"
                value={mappedData.materialCost}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ backgroundColor: "#f1f1f1" }}
              onClick={() => handleNavigate("live-project-costs")}
            >
              <Statistic
                title="Labour Cost"
                prefix="$"
                value={mappedData.labourCost}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ backgroundColor: "#f1f1f1" }}
              onClick={() => handleNavigate("live-project-costs")}
            >
              <Statistic
                title="Subcontractor Cost"
                prefix="$"
                value={mappedData.subcontractorCost}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ backgroundColor: "#f1f1f1" }}
              onClick={() => handleNavigate("client-details")}
            >
              <Statistic title="Client Name" value={mappedData.clientName} />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: "#f1f1f1" }}>
              <Statistic
                title="Days Remaining"
                value={mappedData.daysRemaining}
              />
            </Card>
          </Col>

          {/* <Col span={12}>
          <Card>
            <Statistic
              title="Project Completion"
              valueRender={() => <Progress percent={mappedData.progress} />}
            />
          </Card>
        </Col> */}
          {/* <Col span={6}>
          <Card>
            <Statistic
              title="Snagging Found"
              value={mappedData.snaggingFound}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Snagging Resolved"
              value={mappedData.snaggingResolved}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            hoverable
            onClick={() => handleNavigate("site-pictures-reports")}
          >
            <Statistic title="Site Images" value={mappedData.siteImages} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate("reports")}>
            <Statistic title="Reports Submitted" value={mappedData.reports} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate("documents")}>
            <Statistic
              title="Documents Uploaded"
              value={mappedData.documents}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate("certificates")}>
            <Statistic
              title="Certificates Issued"
              value={mappedData.certificates}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card hoverable onClick={() => handleNavigate("notes")}>
            <Statistic title="Notes" value={mappedData.notes} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Assigned Admin"
              value={mappedData.assignedAdmin}
            />
          </Card>
        </Col> */}

          <Col span={6}>
            <Card style={{ backgroundColor: "#f1f1f1" }}>
              <Statistic
                title="Project Status"
                valueRender={() => (
                  <Badge status="success" text={mappedData.projectStatus} />
                )}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProjectDashboard;
