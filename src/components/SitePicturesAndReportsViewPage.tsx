/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Drawer, message, Modal } from "antd";
// import CustomCreateButton from "./CustomCreateButton";
// import ReportForm from "./ReportForm";
// import ImageUploader from "./ImageUploader";
// import ImageGallery from "./ImageGallery";

// // ✅ Import hooks from BOTH API slices
// import { useGetSingleSitePictureFolderQuery } from "../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi"; // For folder title
// import {
//   useCreateSitePictureImageMutation,
//   useDeleteSitePictureImageMutation,
//   useGetAllSitePictureImagesQuery,
// } from "../Redux/features/projects/project/siteReportPictures/sitePicturesApi";
// // Adjust import path

// const SitePicturesAndReportsViewPage: React.FC = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const { projectId } = useParams<{ projectId: string }>();
//   const { folderId } = useParams<{ folderId: string }>();
//   const isReport = folderId === "report";
//   const [createSitePictureImage, { isLoading: isUploading }] =
//     useCreateSitePictureImageMutation();
//   // ✅ Hook to get the FOLDER'S details (like the title)
//   const { data: folderData } = useGetSingleSitePictureFolderQuery(
//     folderId as string,
//     { skip: isReport }
//   );

//   // ✅ Fixed: Properly pass parameters to the query
//   const { data: imagesData, isLoading: isLoadingImages } =
//     useGetAllSitePictureImagesQuery(
//       {
//         projectId: projectId as string,
//         sitePictureFolderId: folderId as string,
//       },
//       { skip: isReport }
//     );

//   // ✅ Use the new, correct mutation hook for deleting an IMAGE
//   const [deleteSitePictureImage] = useDeleteSitePictureImageMutation();

//   // Handle loading state for images
//   if (isLoadingImages && !isReport) {
//     return <p>Loading images...</p>;
//   }

//   // Use the fetched images data
//   const pictures = imagesData?.data || [];
//   const folderTitle =
//     folderData?.title || folderId?.replace(/-/g, " ") || "Folder";

//   const pictureUpload = () => {
//     formData.append("sitePictureFolderId", folderId);
//     formData.append("projectId", projectId as string);

//     fileList.forEach((file) => {
//       formData.append("file", file.originFileObj as Blob);
//     });

//     try {
//       // ✅ Call the new mutation
//       await createSitePictureImage(formData).unwrap();
//       message.success(`${fileList.length} image(s) uploaded successfully!`);
//       setFileList([]);
//       if (onUploadComplete) {
//         onUploadComplete();
//       }
//     } catch (err) {
//       console.error("Failed to upload images:", err);
//       message.error("Image upload failed. Please try again.");
//     }
//   };

//   const handleDeletePicture = (pictureId: string) => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this image?",
//       okText: "Yes, Delete",
//       okType: "danger",
//       onOk: async () => {
//         try {
//           // ✅ Call the new delete mutation
//           await deleteSitePictureImage(pictureId).unwrap();
//           message.success("Image deleted successfully!");
//         } catch (err) {
//           message.error("Could not delete the image.");
//         }
//       },
//     });
//   };

//   const handleCreate = () => setIsDrawerOpen(true);
//   const handleCloseDrawer = () => setIsDrawerOpen(false);

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold capitalize">
//           {isReport ? "Report" : folderTitle}
//         </h1>
//         <CustomCreateButton
//           title={isReport ? "Create Report" : "Upload Image"}
//           onClick={handleCreate}
//         />
//       </div>

//       <Drawer
//         title={isReport ? "Create Daily Report" : "Upload Image"}
//         width={640}
//         onClose={handleCloseDrawer}
//         open={isDrawerOpen}
//       >
//         {isReport ? (
//           <ReportForm />
//         ) : (
//           <ImageUploader
//             folderId={folderId as string}
//             onUploadComplete={handleCloseDrawer}
//           />
//         )}
//       </Drawer>

//       {isReport ? (
//         <div className="bg-white p-6 rounded-lg shadow">
//           {/* Your report content */}
//         </div>
//       ) : pictures.length === 0 ? (
//         <p className="text-gray-600">
//           No pictures have been uploaded to this folder yet.
//         </p>
//       ) : (
//         <ImageGallery images={pictures} onDelete={handleDeletePicture} />
//       )}
//     </div>
//   );
// };

// export default SitePicturesAndReportsViewPage;

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Drawer, message } from "antd";
// import CustomCreateButton from "./CustomCreateButton";
// import ReportForm from "./ReportForm";
// import ImageUploader from "./ImageUploader";
// import ImageGallery from "./ImageGallery";
// import type { UploadFile } from "antd/es/upload/interface";

// import { useGetSingleSitePictureFolderQuery } from "../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi";
// import {
//   useCreateSitePictureImageMutation,
//   useDeleteSitePictureImageMutation,
//   useGetAllSitePictureImagesQuery,
// } from "../Redux/features/projects/project/siteReportPictures/sitePicturesApi";
// import { showDeleteAlert } from "../utils/deleteAlert";
// import SiteReportsList from "./SiteReportsList";

// const SitePicturesAndReportsViewPage: React.FC = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const { projectId, folderId } = useParams<{
//     projectId: string;
//     folderId: string;
//   }>();
//   const isReport = folderId === "report";

//   const { data: folderData } = useGetSingleSitePictureFolderQuery(
//     folderId as string,
//     { skip: isReport }
//   );

//   const { data: imagesData, isLoading: isLoadingImages } =
//     useGetAllSitePictureImagesQuery(
//       {
//         projectId: projectId as string,
//         sitePictureFolderId: folderId as string,
//       },
//       { skip: isReport }
//     );

//   const [createSitePictureImage] = useCreateSitePictureImageMutation();
//   const [deleteSitePictureImage] = useDeleteSitePictureImageMutation();

//   if (isLoadingImages && !isReport) {
//     return <p>Loading images...</p>;
//   }

//   // ✅ Transformed `pictures` data to handle individual images
//   const pictures = (imagesData?.data || []).reduce((acc: any[], group: any) => {
//     // Ensure `group.file` is an array before mapping
//     if (Array.isArray(group.file)) {
//       const individualImages = group.file.map((fileUrl: string) => ({
//         _id: group._id, // The ID of the original upload record (for deletion)
//         file: fileUrl, // The URL of the individual image
//         uploadedAt: group.uploadedAt,
//       }));
//       acc.push(...individualImages);
//     }
//     return acc;
//   }, []);

//   const folderTitle =
//     folderData?.title || folderId?.replace(/-/g, " ") || "Folder";

//   const handleImageUpload = async (fileList: UploadFile[]) => {
//     // ... (rest of your upload logic remains the same)
//     if (!folderId || !projectId) {
//       message.error("Missing required parameters");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("sitePictureFolderId", folderId);
//     formData.append("projectId", projectId as string);
//     fileList.forEach((file) => {
//       formData.append("file", file.originFileObj as Blob);
//     });
//     try {
//       await createSitePictureImage(formData).unwrap();
//       message.success(`${fileList.length} image(s) uploaded successfully!`);
//     } catch (err) {
//       console.error("Failed to upload images:", err);
//       message.error("Image upload failed. Please try again.");
//     }
//   };

//   const handleDeletePicture = (pictureId: string) => {
//     // ... (rest of your delete logic remains the same)
//     showDeleteAlert({
//       title: "Are you sure you want to delete this image record?",
//       text: "This will delete all images uploaded in this batch. This action cannot be undone.",
//       onConfirm: async () => {
//         try {
//           await deleteSitePictureImage(pictureId).unwrap();
//           message.success("Image record deleted successfully!");
//         } catch (err) {
//           message.error("Could not delete the image record.");
//         }
//       },
//     });
//   };

//   const handleCreate = () => setIsDrawerOpen(true);
//   const handleCloseDrawer = () => setIsDrawerOpen(false);

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold capitalize">
//           {isReport ? "Report" : folderTitle}
//         </h1>
//         <CustomCreateButton
//           title={isReport ? "Create Report" : "Upload Image"}
//           onClick={handleCreate}
//         />
//       </div>

//       <Drawer
//         title={isReport ? "Create Daily Report" : "Upload Image"}
//         width={640}
//         onClose={handleCloseDrawer}
//         open={isDrawerOpen}
//       >
//         {isReport ? (
//           <ReportForm />
//         ) : (
//           <ImageUploader onUploadSuccess={handleImageUpload} />
//         )}
//       </Drawer>

//       {isReport ? (
//         <div className="bg-white p-6 rounded-lg shadow w-full">
//           {projectId ? (
//             <SiteReportsList />
//           ) : (
//             <p>Project ID missing. Cannot display reports.</p>
//           )}
//         </div>
//       ) : pictures.length === 0 ? (
//         <p>No pictures have been uploaded to this folder yet.</p>
//       ) : (
//         <ImageGallery images={pictures} onDelete={handleDeletePicture} />
//       )}
//     </div>
//   );
// };

// export default SitePicturesAndReportsViewPage;

//------------------------------------------------------------------------------------
// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Drawer, message } from "antd";
// import CustomCreateButton from "./CustomCreateButton";
// import ReportForm from "./ReportForm";
// import ImageUploader from "./ImageUploader";
// import ImageGallery from "./ImageGallery";
// import SiteReportsList from "./SiteReportsList";

// import type { UploadFile } from "antd/es/upload/interface";

// import { useGetSingleSitePictureFolderQuery } from "../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi";
// import {
//   useCreateSitePictureImageMutation,
//   useDeleteSitePictureImageMutation,
//   useGetAllSitePictureImagesQuery,
// } from "../Redux/features/projects/project/siteReportPictures/sitePicturesApi";

// import {
//   useCreateSiteReportMutation,
//   useGetSiteReportsQuery,
//   useDeleteSiteReportMutation,
// } from "../Redux/features/projects/project/siteReportPictures/reportApi";

// import { showDeleteAlert } from "../utils/deleteAlert";
// import type { ReportFormData } from "./ReportForm";

// const SitePicturesAndReportsViewPage: React.FC = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const { projectId, folderId } = useParams<{
//     projectId: string;
//     folderId: string;
//   }>();
//   const isReport = folderId === "report";

//   // Pictures
//   const { data: folderData } = useGetSingleSitePictureFolderQuery(
//     folderId as string,
//     {
//       skip: isReport,
//     }
//   );
//   const { data: imagesData } = useGetAllSitePictureImagesQuery(
//     { projectId: projectId as string, sitePictureFolderId: folderId as string },
//     { skip: isReport }
//   );

//   const [createSitePictureImage] = useCreateSitePictureImageMutation();
//   const [deleteSitePictureImage] = useDeleteSitePictureImageMutation();

//   // Reports
//   const { data: reportsData, isLoading: isLoadingReports } =
//     useGetSiteReportsQuery(projectId as string, { skip: !isReport });
//   const [createSiteReport] = useCreateSiteReportMutation();
//   const [deleteSiteReport] = useDeleteSiteReportMutation();

//   // Pictures transform
//   const pictures = (imagesData?.data || []).reduce((acc: any[], group: any) => {
//     if (Array.isArray(group.file)) {
//       const individualImages = group.file.map((fileUrl: string) => ({
//         _id: group._id,
//         file: fileUrl,
//         uploadedAt: group.uploadedAt,
//       }));
//       acc.push(...individualImages);
//     }
//     return acc;
//   }, []);

//   const folderTitle =
//     folderData?.title || folderId?.replace(/-/g, " ") || "Folder";

//   // Handlers
//   const handleImageUpload = async (fileList: UploadFile[]) => {
//     if (!folderId || !projectId) {
//       message.error("Missing required parameters");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("sitePictureFolderId", folderId);
//     formData.append("projectId", projectId as string);
//     fileList.forEach((file) => {
//       formData.append("file", file.originFileObj as Blob);
//     });
//     try {
//       await createSitePictureImage(formData).unwrap();
//       message.success(`${fileList.length} image(s) uploaded successfully!`);
//     } catch (err) {
//       console.error("Failed to upload images:", err);
//       message.error("Image upload failed. Please try again.");
//     }
//   };

//   const handleReportCreate = async (reportData: ReportFormData) => {
//     if (!projectId) {
//       message.error("Project ID is missing");
//       return;
//     }

//     try {
//       const formData = new FormData();

//       formData.append(
//         "data",
//         JSON.stringify({
//           projectId,
//           overviewText: reportData.overviewText,
//           date: reportData.date.toISOString,
//           title: reportData.title,
//         })
//       );

//       reportData.overviewFiles.forEach((file) =>
//         formData.append("overviewFile", file)
//       );
//       reportData.weatherFiles.forEach((file) =>
//         formData.append("weather", file)
//       );
//       reportData.workingDaysFiles.forEach((file) =>
//         formData.append("workingDays", file)
//       );
//       reportData.LaborTeamFiles.forEach((file) =>
//         formData.append("LaborTeam", file)
//       );
//       await createSiteReport(formData).unwrap();
//       message.success("Report created successfully!");
//     } catch (err) {
//       console.error("Failed to upload images:", err);
//     }
//   };

//   const handleDeletePicture = (pictureId: string) => {
//     showDeleteAlert({
//       title: "Are you sure you want to delete this image record?",
//       text: "This will delete all images uploaded in this batch.",
//       onConfirm: async () => {
//         try {
//           await deleteSitePictureImage(pictureId).unwrap();
//           message.success("Image record deleted successfully!");
//         } catch {
//           message.error("Could not delete the image record.");
//         }
//       },
//     });
//   };

//   const handleDeleteReport = (reportId: string) => {
//     showDeleteAlert({
//       title: "Are you sure you want to delete this report?",
//       text: "This action cannot be undone.",
//       onConfirm: async () => {
//         try {
//           await deleteSiteReport(reportId).unwrap();
//           message.success("Report deleted successfully!");
//         } catch {
//           message.error("Could not delete the report.");
//         }
//       },
//     });
//   };

//   // Drawer
//   const handleCreate = () => setIsDrawerOpen(true);
//   const handleCloseDrawer = () => setIsDrawerOpen(false);

//   // const data=reportsData.data
//   console.log(reportsData);
//   // Render
//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold capitalize">
//           {isReport ? "Report" : folderTitle}
//         </h1>
//         <CustomCreateButton
//           title={isReport ? "Create Report" : "Upload Image"}
//           onClick={handleCreate}
//         />
//       </div>

//       <Drawer
//         title={isReport ? "Create Daily Report" : "Upload Image"}
//         width={640}
//         onClose={handleCloseDrawer}
//         open={isDrawerOpen}
//       >
//         {isReport ? (
//           <ReportForm onSubmit={handleReportCreate} />
//         ) : (
//           <ImageUploader onUploadSuccess={handleImageUpload} />
//         )}
//       </Drawer>

//       {isReport ? (
//         <div className="bg-white p-6 rounded-lg shadow w-full">
//           {isLoadingReports ? (
//             <p>Loading reports...</p>
//           ) : reportsData?.length ? (
//             <SiteReportsList
//               reports={reportsData}
//               onDelete={handleDeleteReport}
//             />
//           ) : (
//             <p>No reports have been created yet.</p>
//           )}
//         </div>
//       ) : pictures.length === 0 ? (
//         <p>No pictures have been uploaded to this folder yet.</p>
//       ) : (
//         <ImageGallery images={pictures} onDelete={handleDeletePicture} />
//       )}
//     </div>
//   );
// };

// export default SitePicturesAndReportsViewPage;

// SitePicturesAndReportsViewPage.tsx

// SitePicturesAndReportsViewPage.tsx

// SitePicturesAndReportsViewPage.tsx

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Drawer, message } from "antd";
import CustomCreateButton from "./CustomCreateButton";
import ReportForm from "./ReportForm";
import ImageUploader from "./ImageUploader";
import ImageGallery from "./ImageGallery";
import SiteReportsList from "./SiteReportsList";

import type { UploadFile } from "antd/es/upload/interface";

import { useGetSingleSitePictureFolderQuery } from "../Redux/features/projects/project/siteReportPictures/sitePictureFolderApi";
import {
  useCreateSitePictureImageMutation,
  useUpdateSitePictureImageMutation,
  useGetAllSitePictureImagesQuery,
} from "../Redux/features/projects/project/siteReportPictures/sitePicturesApi";

import {
  useCreateSiteReportMutation,
  useGetSiteReportsQuery,
  useDeleteSiteReportMutation,
} from "../Redux/features/projects/project/siteReportPictures/reportApi";

import { showDeleteAlert } from "../utils/deleteAlert";
import type { ReportFormData } from "./ReportForm";

const SitePicturesAndReportsViewPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { projectId, folderId } = useParams<{
    projectId: string;
    folderId: string;
  }>();
  const isReport = folderId === "report"; // Pictures

  const { data: folderData } = useGetSingleSitePictureFolderQuery(
    folderId as string,
    {
      skip: isReport,
    }
  );
  const { data: imagesData } = useGetAllSitePictureImagesQuery(
    { projectId: projectId as string, sitePictureFolderId: folderId as string },
    { skip: isReport }
  );

  const [createSitePictureImage] = useCreateSitePictureImageMutation();
  const [updateSitePictureImage] = useUpdateSitePictureImageMutation(); // Reports

  const { data: reportsData, isLoading: isLoadingReports } =
    useGetSiteReportsQuery(projectId as string, { skip: !isReport });
  const [createSiteReport] = useCreateSiteReportMutation();
  const [deleteSiteReport] = useDeleteSiteReportMutation(); // Pictures transform

  const pictures = (imagesData?.data || []).reduce((acc: any[], group: any) => {
    if (Array.isArray(group.file)) {
      const individualImages = group.file.map((fileUrl: string) => ({
        _id: group._id,
        file: fileUrl,
        uploadedAt: group.uploadedAt,
      }));
      acc.push(...individualImages);
    }
    return acc;
  }, []);

  const folderTitle =
    folderData?.title || folderId?.replace(/-/g, " ") || "Folder"; // Handlers

  const handleImageUpload = async (fileList: UploadFile[]) => {
    if (!folderId || !projectId) {
      message.error("Missing required parameters");
      return;
    }
    const formData = new FormData();
    formData.append("sitePictureFolderId", folderId);
    formData.append("projectId", projectId as string);
    fileList.forEach((file) => {
      formData.append("file", file.originFileObj as Blob);
    });
    try {
      await createSitePictureImage(formData).unwrap();
      message.success(`${fileList.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error("Failed to upload images:", err);
      message.error("Image upload failed. Please try again.");
    }
  };

  const handleReportCreate = async (reportData: ReportFormData) => {
    if (!projectId) {
      message.error("Project ID is missing");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          projectId,
          overviewText: reportData.overviewText,
          date: reportData.date.toISOString,
          title: reportData.title,
        })
      );

      reportData.overviewFiles.forEach((file) =>
        formData.append("overviewFile", file)
      );
      reportData.weatherFiles.forEach((file) =>
        formData.append("weather", file)
      );
      reportData.workingDaysFiles.forEach((file) =>
        formData.append("workingDays", file)
      );
      reportData.LaborTeamFiles.forEach((file) =>
        formData.append("LaborTeam", file)
      );
      await createSiteReport(formData).unwrap();
      message.success("Report created successfully!");
    } catch (err) {
      console.error("Failed to upload images:", err);
    }
  };

  // const handleUpdatePicture = (recordId: string, fileUrl: string) => {
  //   console.log("Update called for recordId:", recordId, "fileUrl:", fileUrl);

  //   // Add fileUrl parameter
  //   showDeleteAlert({
  //     title: "Are you sure you want to delete this image?",
  //     text: "This will only delete the selected image, not the entire batch.",
  //     onConfirm: async () => {
  //       try {
  //         const parentRecord = imagesData?.data.find(
  //           (record: any) => record._id === recordId
  //         );

  //         console.log("Parent record found:", parentRecord);
  //         if (parentRecord) {
  //           // 1. Remove the deleted image
  //           const updatedFiles = parentRecord.file.filter(
  //             (file: string) => file !== fileUrl
  //           );

  //           if (updatedFiles.length === 0) {
  //             // Case: all images removed
  //             message.info(
  //               "Last image in the batch. Please reload to see changes."
  //             );
  //           } else {
  //             // 2. Send updated array to backend
  //             const formData = new FormData();

  //             console.log("Updated files:", updatedFiles);
  //             // Append each file individually
  //             updatedFiles.forEach((file: string) => {
  //               formData.append("file", file);
  //             });

  //             // Or if your API expects a different format, you might need to stringify
  //             // formData.append("files", JSON.stringify(updatedFiles));

  //             await updateSitePictureImage({
  //               id: recordId,
  //               data: formData,
  //             }).unwrap();

  //             message.success("Image deleted successfully!");
  //           }
  //         } else {
  //           message.error("Could not find the image record.");
  //         }
  //       } catch (err) {
  //         console.error("Failed to delete image:", err);
  //         message.error("Could not delete the image.");
  //       }
  //     },
  //   });
  // };

  const handleUpdatePicture = (recordId: string, fileUrl: string) => {
    showDeleteAlert({
      // ...
      onConfirm: async () => {
        try {
          const parentRecord = imagesData?.data.find(
            (record: any) => record._id === recordId
          );

          if (parentRecord) {
            const updatedFiles = parentRecord.file.filter(
              (file: string) => file !== fileUrl
            );

            // 1. Prepare the JSON data
            const dataToUpdate = { file: updatedFiles };

            // 2. Call the mutation with the new JSON payload
            await updateSitePictureImage({
              id: recordId,
              data: dataToUpdate,
            }).unwrap();

            message.success("Image deleted successfully!");
            // You might need to refetch data to update the UI
          } else {
            message.error("Could not find the image record.");
          }
        } catch (err) {
          console.error("Failed to delete image:", err);
          message.error("Could not delete the image.");
        }
      },
    });
  };

  const handleDeleteReport = (reportId: string) => {
    showDeleteAlert({
      title: "Are you sure you want to delete this report?",
      text: "This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteSiteReport(reportId).unwrap();
          message.success("Report deleted successfully!");
        } catch {
          message.error("Could not delete the report.");
        }
      },
    });
  }; // Drawer

  const handleCreate = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  console.log(reportsData); // Render
  return (
    <div className="max-w-6xl mx-auto p-4">
           {" "}
      <div className="flex justify-between items-center mb-4">
               {" "}
        <h1 className="text-2xl font-bold capitalize">
                    {isReport ? "Report" : folderTitle}       {" "}
        </h1>
               {" "}
        <CustomCreateButton
          title={isReport ? "Create Report" : "Upload Image"}
          onClick={handleCreate}
        />
             {" "}
      </div>
           {" "}
      <Drawer
        title={isReport ? "Create Daily Report" : "Upload Image"}
        width={640}
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
      >
               {" "}
        {isReport ? (
          <ReportForm onSubmit={handleReportCreate} />
        ) : (
          <ImageUploader onUploadSuccess={handleImageUpload} />
        )}
             {" "}
      </Drawer>
           {" "}
      {isReport ? (
        <div className="bg-white p-6 rounded-lg shadow w-full">
                   {" "}
          {isLoadingReports ? (
            <p>Loading reports...</p>
          ) : reportsData?.length ? (
            <SiteReportsList
              reports={reportsData}
              onDelete={handleDeleteReport}
            />
          ) : (
            <p>No reports have been created yet.</p>
          )}
                 {" "}
        </div>
      ) : pictures.length === 0 ? (
        <p>No pictures have been uploaded to this folder yet.</p>
      ) : (
        <ImageGallery images={pictures} onUpdate={handleUpdatePicture} />
      )}
         {" "}
    </div>
  );
};

export default SitePicturesAndReportsViewPage;
