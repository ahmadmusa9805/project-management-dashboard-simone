/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import html2pdf from "html2pdf.js";

// interface SharedUser {
//   userId: {
//     _id: string;
//     name: string;
//     role: string;
//   };
//   role: string;
// }

// interface SiteReportPDFExporterProps {
//   report: {
//     _id: string;
//     title: string;
//     overviewText: string;
//     overviewFile?: string[];
//     weather?: string[];
//     workingDays?: string[];
//     LaborTeam?: string[];
//     date: string;
//     sharedWith?: SharedUser[];
//   };
//   project: {
//     projectName: string;
//     clientName: string;
//     clientEmail: string;
//     reference: string;
//     status: string;
//     address: string;
//     contact: string;
//   };
//   currentUser: {
//     name: string;
//     role: string;
//   };
// }

// // Helper function: Convert URL to Base64
// const urlToBase64 = async (url: string): Promise<string> => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error("Failed to fetch image");
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch {
//     return url; // fallback to original URL if conversion fails
//   }
// };

// // Convert array of URLs to Base64
// const processImages = async (urls: string[] = []): Promise<string[]> => {
//   return Promise.all(urls.map(urlToBase64));
// };

// const SiteReportPDFExporter: React.FC<SiteReportPDFExporterProps> = ({
//   report,
//   project,
//   currentUser,
// }) => {
//   const generatePDF = async () => {
//     // Determine employee name
//     let employeeName = currentUser?.name || "Unknown Employee";
//     let employeeRole = currentUser?.role || "Employee";

//     if (!report.sharedWith || report.sharedWith.length === 0) {
//       employeeName = "Super Admin";
//       employeeRole = "super-admin";
//     } else {
//       const adminUser = report.sharedWith.find(
//         (shared) =>
//           shared.userId.role.includes("primeAdmin") ||
//           shared.userId.role.includes("basic-admin")
//       );
//       if (adminUser) {
//         employeeName = adminUser.userId.name;
//         employeeRole = adminUser.userId.role;
//       }
//     }

//     // Convert all images to Base64
//     const logoBase64 = await urlToBase64("/logo.png"); // move your logo to public/logo.png
//     const overviewImages = await processImages(report.overviewFile);
//     const weatherImages = await processImages(report.weather);
//     const workingDaysImages = await processImages(report.workingDays);
//     const laborTeamImages = await processImages(report.LaborTeam);

//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
//         <!-- Header -->
//         <div style="text-align: center; margin-bottom: 30px;">
//           <img src="${logoBase64}" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;" />
//           <h1 style="color: #333; margin: 0;">MVV Construction Company</h1>
//           <p style="color: #666; margin: 5px 0;">Professional Construction Services</p>
//         </div>

//         <!-- Report Title -->
//         <div style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
//           <h2 style="color: #333; margin: 0;">${report.title}</h2>
//         </div>

//         <!-- Project and Client Info -->
//         <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
//           <div style="flex: 1;">
//             <h3 style="color: #333; margin-bottom: 10px;">Project Details</h3>
//             <p><strong>Project Name:</strong> ${project.projectName}</p>
//             <p><strong>Reference:</strong> ${project.reference}</p>
//             <p><strong>Status:</strong> ${project.status}</p>
//             <p><strong>Address:</strong> ${project.address}</p>
//           </div>
//           <div style="flex: 1;">
//             <h3 style="color: #333; margin-bottom: 10px;">Client Information</h3>
//             <p><strong>Client Name:</strong> ${project.clientName}</p>
//             <p><strong>Email:</strong> ${project.clientEmail}</p>
//             <p><strong>Contact:</strong> ${project.contact}</p>
//           </div>
//         </div>

//         <!-- Report Content -->
//         <div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Report Overview</h3>
//           <div style="line-height: 1.6; color: #555;">${
//             report.overviewText
//           }</div>
//         </div>

//         <!-- Images Section -->
//         ${
//           overviewImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Overview Images</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${overviewImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Overview" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         ${
//           weatherImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Weather Conditions</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${weatherImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Weather" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         ${
//           workingDaysImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Working Days</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${workingDaysImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Working Days" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         ${
//           laborTeamImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Labor Team</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${laborTeamImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Labor Team" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         <!-- Signature Section -->
//         <div style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px;">
//           <div style="display: flex; justify-content: space-between; align-items: center;">
//             <div>
//               <p><strong>Prepared by:</strong> ${employeeName}</p>
//               <p><strong>Role:</strong> ${employeeRole}</p>
//               <p><strong>Date:</strong> ${new Date(
//                 report.date
//               ).toLocaleDateString()}</p>
//             </div>
//             <div style="text-align: center;">
//               <div style="border: 1px solid #333; width: 150px; height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
//                 <span style="color: #999;">Signature</span>
//               </div>
//               <p style="margin: 0; font-size: 12px;">${employeeName}</p>
//             </div>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
//           <p>MVV Construction Company - Professional Building Services</p>
//           <p>Report generated on ${new Date().toLocaleDateString()}</p>
//         </div>
//       </div>
//     `;

//     const options = {
//       margin: 1,
//       filename: `${report.title
//         .replace(/[^a-z0-9]/gi, "_")
//         .toLowerCase()}_report.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true, allowTaint: true },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };

//     const element = document.createElement("div");
//     element.innerHTML = htmlContent;
//     document.body.appendChild(element);

//     try {
//       await html2pdf().set(options).from(element).save();
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     } finally {
//       document.body.removeChild(element);
//     }
//   };

//   React.useEffect(() => {
//     generatePDF();
//   }, []);

//   return null;
// };

// export default SiteReportPDFExporter;

//TODO: Refactor this component to use react-pdf for better performance and reliability
// import React from "react";
// import html2pdf from "html2pdf.js";

// interface SharedUser {
//   userId: {
//     _id: string;
//     name: string;
//     role: string;
//   };
//   role: string;
// }

// interface SiteReportPDFExporterProps {
//   report: {
//     _id: string;
//     title: string;
//     overviewText: string;
//     overviewFile?: string[];
//     weather?: string[];
//     workingDays?: string[];
//     LaborTeam?: string[];
//     date: string;
//     sharedWith?: SharedUser[];
//   };
//   project: {
//     projectName: string;
//     clientName: string;
//     clientEmail: string;
//     reference: string;
//     status: string;
//     address: string;
//     contact: string;
//   };
//   currentUser: {
//     name: string;
//     role: string;
//   };
//   onComplete: () => void;
// }

// // Helper function: Convert URL to Base64
// const urlToBase64 = async (url: string): Promise<string> => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       console.error(`Failed to fetch image: ${url}`);
//       return "";
//     }
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error(`Error converting URL to Base64 for ${url}:`, error);
//     return "";
//   }
// };

// // Convert array of URLs to Base64
// const processImages = async (urls: string[] = []): Promise<string[]> => {
//   const base64Images = await Promise.all(urls.map(urlToBase64));
//   return base64Images.filter((img) => img !== "");
// };

// const SiteReportPDFExporter: React.FC<SiteReportPDFExporterProps> = ({
//   report,
//   project,
//   currentUser,
//   onComplete,
// }) => {
//   const generatePDF = async () => {
//     let employeeName = currentUser?.name || "Unknown Employee";
//     let employeeRole = currentUser?.role || "Employee";

//     if (!report.sharedWith || report.sharedWith.length === 0) {
//       employeeName = "Super Admin";
//       employeeRole = "super-admin";
//     } else {
//       const adminUser = report.sharedWith.find(
//         (shared) =>
//           shared.userId.role.includes("primeAdmin") ||
//           shared.userId.role.includes("basic-admin")
//       );
//       if (adminUser) {
//         employeeName = adminUser.userId.name;
//         employeeRole = adminUser.userId.role;
//       }
//     }

//     const logoBase64 = await urlToBase64("/logo.png");
//     const overviewImages = await processImages(report.overviewFile);
//     const weatherImages = await processImages(report.weather);
//     const workingDaysImages = await processImages(report.workingDays);
//     const laborTeamImages = await processImages(report.LaborTeam);

//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
//         <div style="text-align: center; margin-bottom: 30px;">
//           <img src="${logoBase64}" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;" />
//           <h1 style="color: #333; margin: 0;">MVV Construction Company</h1>
//           <p style="color: #666; margin: 5px 0;">Professional Construction Services</p>
//         </div>

//         <div style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
//           <h2 style="color: #333; margin: 0;">${report.title}</h2>
//         </div>

//         <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
//           <div style="flex: 1;">
//             <h3 style="color: #333; margin-bottom: 10px;">Project Details</h3>
//             <p><strong>Project Name:</strong> ${project.projectName}</p>
//             <p><strong>Reference:</strong> ${project.reference}</p>
//             <p><strong>Status:</strong> ${project.status}</p>
//             <p><strong>Address:</strong> ${project.address}</p>
//           </div>
//           <div style="flex: 1;">
//             <h3 style="color: #333; margin-bottom: 10px;">Client Information</h3>
//             <p><strong>Client Name:</strong> ${project.clientName}</p>
//             <p><strong>Email:</strong> ${project.clientEmail}</p>
//             <p><strong>Contact:</strong> ${project.contact}</p>
//           </div>
//         </div>

//         <div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Report Overview</h3>
//           <div style="line-height: 1.6; color: #555;">${
//             report.overviewText
//           }</div>
//         </div>

//         ${
//           overviewImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Overview Images</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${overviewImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Overview" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         ${
//           weatherImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Weather Conditions</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${weatherImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Weather" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         ${
//           workingDaysImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Working Days</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${workingDaysImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Working Days" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         ${
//           laborTeamImages.length
//             ? `<div style="margin-bottom: 30px;">
//           <h3 style="color: #333; margin-bottom: 15px;">Labor Team</h3>
//           <div style="display: flex; flex-wrap: wrap; gap: 10px;">
//             ${laborTeamImages
//               .map(
//                 (img) =>
//                   `<img src="${img}" alt="Labor Team" style="max-width: 200px; max-height: 150px; object-fit: cover;" />`
//               )
//               .join("")}
//           </div>
//         </div>`
//             : ""
//         }

//         <div style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px;">
//           <div style="display: flex; justify-content: space-between; align-items: center;">
//             <div>
//               <p><strong>Prepared by:</strong> ${employeeName}</p>
//               <p><strong>Role:</strong> ${employeeRole}</p>
//               <p><strong>Date:</strong> ${new Date(
//                 report.date
//               ).toLocaleDateString()}</p>
//             </div>
//             <div style="text-align: center;">
//               <div style="border: 1px solid #333; width: 150px; height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
//                 <span style="color: #999;">Signature</span>
//               </div>
//               <p style="margin: 0; font-size: 12px;">${employeeName}</p>
//             </div>
//           </div>
//         </div>

//         <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
//           <p>MVV Construction Company - Professional Building Services</p>
//           <p>Report generated on ${new Date().toLocaleDateString()}</p>
//         </div>
//       </div>
//     `;

//     const options = {
//       margin: 1,
//       filename: `${report.title
//         .replace(/[^a-z0-9]/gi, "_")
//         .toLowerCase()}_report.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true, allowTaint: true },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };

//     const element = document.createElement("div");
//     element.innerHTML = htmlContent;
//     document.body.appendChild(element);

//     try {
//       await html2pdf().set(options).from(element).save();
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     } finally {
//       document.body.removeChild(element);
//       onComplete();
//     }
//   };

//   React.useEffect(() => {
//     generatePDF();
//   }, [report, project, currentUser, onComplete]);

//   return null;
// };

// export default SiteReportPDFExporter;

// TODO:Test this component
// import { message } from "antd";
// import html2pdf from "html2pdf.js";
// import type React from "react";
// import { useCallback, useEffect } from "react";

// interface SiteReportPDFExporterProps {
//   report: {
//     _id: string;
//     title: string;
//     overviewText: string;
//     overviewFile?: string[];
//     weather?: string[];
//     workingDays?: string[];
//     LaborTeam?: string[];
//     date: string;
//     sharedWith?: Array<{
//       userId: {
//         _id: string;
//         name: string;
//         role: string;
//       };
//       role: string;
//     }>;
//   };
//   project: {
//     projectName: string;
//     clientName: string;
//     clientEmail: string;
//     reference: string;
//     status: string;
//     address: string;
//     contact: string;
//   };
//   currentUser: {
//     name: string;
//     role: string;
//   };
//   onComplete?: () => void;
// }

// const SiteReportPDFExporter: React.FC<SiteReportPDFExporterProps> = ({
//   report,
//   project,
//   currentUser,
//   onComplete,
// }) => {
//   const loadImage = useCallback(async (url: string): Promise<string> => {
//     return new Promise((resolve) => {
//       // If URL is empty or invalid, return placeholder
//       if (!url || url === "/placeholder.svg" || url.includes("placeholder")) {
//         resolve("/placeholder.svg?height=300&width=400");
//         return;
//       }

//       // If it's already a base64 image, return as is
//       if (url.startsWith("data:image")) {
//         resolve(url);
//         return;
//       }

//       const img = new Image();
//       img.crossOrigin = "anonymous";

//       img.onload = () => {
//         try {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           if (!ctx) {
//             console.error("Could not get canvas context");
//             resolve(url); // Fallback to original URL
//             return;
//           }

//           // Set canvas size to match loaded image
//           canvas.width = img.naturalWidth || img.width;
//           canvas.height = img.naturalHeight || img.height;

//           // Draw image to canvas
//           ctx.drawImage(img, 0, 0);

//           // Convert to base64 with high quality
//           const base64 = canvas.toDataURL("image/jpeg", 0.95);
//           console.log("Successfully converted image to base64:", url);
//           resolve(base64);
//         } catch (e) {
//           console.error("Error converting image to base64:", e);
//           resolve(url); // Fallback to original URL
//         }
//       };

//       img.onerror = (error) => {
//         console.error(`Failed to load image: ${url}`, error);
//         resolve("/placeholder.svg?height=300&width=400");
//       };

//       // Add cache busting and ensure proper URL format
//       let imageUrl = url;
//       if (!imageUrl.startsWith("data:image") && !imageUrl.startsWith("blob:")) {
//         const separator = imageUrl.includes("?") ? "&" : "?";
//         imageUrl = `${imageUrl}${separator}t=${Date.now()}`;

//         // Ensure the URL is absolute if it's relative
//         if (imageUrl.startsWith("/")) {
//           imageUrl = window.location.origin + imageUrl;
//         }
//       }

//       img.src = imageUrl;
//     });
//   }, []);

//   useEffect(() => {
//     const generatePDF = async () => {
//       try {
//         message.loading({
//           content: "Preparing images for PDF...",
//           key: "pdfGen",
//           duration: 0,
//         });

//         console.log("Report data for PDF:", {
//           title: report.title,
//           overviewFiles: report.overviewFile,
//           weatherFiles: report.weather,
//           workingDaysFiles: report.workingDays,
//           laborTeamFiles: report.LaborTeam,
//         });

//         // Load all images with better error handling
//         const loadImageCategory = async (
//           images: string[] | undefined,
//           category: string
//         ) => {
//           if (!images || images.length === 0) {
//             console.log(`No ${category} images found`);
//             return [];
//           }

//           console.log(`Loading ${category} images:`, images);

//           const loadedImages = await Promise.all(
//             images.map(async (url, index) => {
//               try {
//                 const base64 = await loadImage(url);
//                 console.log(
//                   `Successfully loaded ${category} image ${index + 1}`
//                 );
//                 return base64;
//               } catch (error) {
//                 console.error(
//                   `Failed to load ${category} image ${index + 1}:`,
//                   error
//                 );
//                 return "/placeholder.svg?height=300&width=400";
//               }
//             })
//           );

//           return loadedImages.filter(
//             (img) => img && !img.includes("undefined")
//           );
//         };

//         const [
//           overviewImages,
//           weatherImages,
//           workingDaysImages,
//           laborTeamImages,
//         ] = await Promise.all([
//           loadImageCategory(report.overviewFile, "overview"),
//           loadImageCategory(report.weather, "weather"),
//           loadImageCategory(report.workingDays, "workingDays"),
//           loadImageCategory(report.LaborTeam, "laborTeam"),
//         ]);

//         console.log("All images loaded successfully:", {
//           overview: overviewImages.length,
//           weather: weatherImages.length,
//           workingDays: workingDaysImages.length,
//           laborTeam: laborTeamImages.length,
//         });

//         message.loading({
//           content: "Generating PDF document...",
//           key: "pdfGen",
//           duration: 0,
//         });

//         // Create PDF content
//         const container = document.createElement("div");
//         container.style.padding = "20px";
//         container.style.fontFamily = "Arial, sans-serif";
//         container.style.backgroundColor = "white";
//         container.style.color = "#333";

//         const createImageGrid = (images: string[], title: string) => {
//           if (images.length === 0) {
//             return `
//               <div style="margin-bottom: 30px; page-break-inside: avoid;">
//                 <h3 style="border-bottom: 2px solid #1890ff; padding-bottom: 8px; color: #172B4D; font-size: 20px;">${title}</h3>
//                 <p style="text-align: center; color: #666; font-style: italic; padding: 20px;">No images available</p>
//               </div>
//             `;
//           }

//           return `
//             <div style="margin-bottom: 30px; page-break-inside: avoid;">
//               <h3 style="border-bottom: 2px solid #1890ff; padding-bottom: 8px; color: #172B4D; font-size: 20px;">${title}</h3>
//               <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
//                 ${images
//                   .map(
//                     (base64, index) => `
//                   <div style="page-break-inside: avoid; text-align: center; border: 1px solid #e8e8e8; border-radius: 8px; padding: 10px; background: #fafafa;">
//                     <img src="${base64}"
//                          style="width: 100%; height: auto; max-height: 250px; object-fit: contain; border-radius: 4px; margin-bottom: 8px;"
//                          onerror="this.src='/placeholder.svg?height=250&width=300'" />
//                     <p style="margin: 0; font-size: 12px; color: #666;">${title} ${
//                       index + 1
//                     }</p>
//                   </div>
//                 `
//                   )
//                   .join("")}
//               </div>
//             </div>
//           `;
//         };

//         container.innerHTML = `
//           <div style="max-width: 800px; margin: 0 auto;">
//             <!-- Header -->
//             <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1890ff;">
//               <h1 style="margin: 0; color: #172B4D; font-size: 28px; font-weight: bold;">${
//                 project.projectName || "Project"
//               }</h1>
//               <h2 style="color: #666; margin: 10px 0; font-size: 20px;">${
//                 report.title
//               }</h2>
//               <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px; font-size: 14px; color: #666; flex-wrap: wrap;">
//                 <span><strong>Report Date:</strong> ${new Date(
//                   report.date
//                 ).toLocaleDateString()}</span>
//                 <span><strong>Generated by:</strong> ${currentUser.name}</span>
//                 <span><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</span>
//               </div>
//             </div>

//             <!-- Project Details -->
//             <div style="margin-bottom: 30px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
//               <h3 style="margin: 0 0 15px 0; color: #172B4D; font-size: 18px;">Project Information</h3>
//               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
//                 <div><strong>Client:</strong> ${
//                   project.clientName || "N/A"
//                 }</div>
//                 <div><strong>Status:</strong> ${project.status || "N/A"}</div>
//                 <div><strong>Reference:</strong> ${
//                   project.reference || "N/A"
//                 }</div>
//                 <div><strong>Contact:</strong> ${project.contact || "N/A"}</div>
//                 <div style="grid-column: 1 / -1;"><strong>Address:</strong> ${
//                   project.address || "N/A"
//                 }</div>
//               </div>
//             </div>

//             <!-- Overview Section -->
//             ${
//               report.overviewText || overviewImages.length > 0
//                 ? `
//               <div style="margin-bottom: 30px; page-break-inside: avoid;">
//                 <h3 style="border-bottom: 2px solid #1890ff; padding-bottom: 8px; color: #172B4D; font-size: 20px;">Overview</h3>
//                 ${
//                   report.overviewText
//                     ? `
//                   <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #1890ff;">
//                     <p style="margin: 0; line-height: 1.6; color: #333;">${report.overviewText.replace(
//                       /<\/?[^>]+(>|$)/g,
//                       ""
//                     )}</p>
//                   </div>
//                 `
//                     : ""
//                 }
//                 ${createImageGrid(overviewImages, "Overview")}
//               </div>
//             `
//                 : ""
//             }

//             <!-- Weather Condition Section -->
//             ${
//               weatherImages.length > 0
//                 ? createImageGrid(weatherImages, "Weather Condition")
//                 : ""
//             }

//             <!-- Working Days Section -->
//             ${
//               workingDaysImages.length > 0
//                 ? createImageGrid(workingDaysImages, "Working Days")
//                 : ""
//             }

//             <!-- Labour & Team Section -->
//             ${
//               laborTeamImages.length > 0
//                 ? createImageGrid(laborTeamImages, "Labour & Team")
//                 : ""
//             }

//             <!-- Footer -->
//             <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
//               <p>Generated by Construction Management System</p>
//               <p>${project.projectName} - ${report.title}</p>
//             </div>
//           </div>
//         `;

//         // PDF options
//         const options = {
//           margin: [10, 10, 10, 10],
//           filename: `${report.title
//             .replace(/[^a-z0-9]/gi, "_")
//             .toLowerCase()}_report.pdf`,
//           image: { type: "jpeg", quality: 0.98 },
//           html2canvas: {
//             scale: 2,
//             logging: true,
//             useCORS: true,
//             allowTaint: false,
//             backgroundColor: "#ffffff",
//           },
//           jsPDF: {
//             unit: "mm",
//             format: "a4",
//             orientation: "portrait" as const,
//           },
//         };

//         console.log("Starting PDF generation with html2pdf...");

//         // Generate and save PDF
//         await html2pdf().set(options).from(container).save();

//         console.log("PDF generated successfully!");

//         message.success({
//           content: "PDF generated successfully!",
//           key: "pdfGen",
//         });

//         onComplete?.();
//       } catch (error) {
//         console.error("Error generating PDF:", error);
//         message.error({
//           content: "Failed to generate PDF. Please check console for details.",
//           key: "pdfGen",
//         });
//         onComplete?.();
//       }
//     };

//     generatePDF();
//   }, [report, project, currentUser, onComplete, loadImage]);

//   return null;
// };

// export default SiteReportPDFExporter;

//TODO: Debug

// Debug version to check image URLs
import { message } from "antd";
import html2pdf from "html2pdf.js";
import type React from "react";
import { useCallback, useEffect } from "react";

interface SiteReportPDFExporterProps {
  report: {
    _id: string;
    title: string;
    overviewText: string;
    overviewFile?: string[];
    weather?: string[];
    workingDays?: string[];
    LaborTeam?: string[];
    date: string;
    sharedWith?: Array<{
      userId: {
        _id: string;
        name: string;
        role: string;
      };
      role: string;
    }>;
  };
  project: {
    projectName: string;
    clientName: string;
    clientEmail: string;
    reference: string;
    status: string;
    address: string;
    contact: string;
  };
  currentUser: {
    name: string;
    role: string;
  };
  onComplete?: () => void;
}

const SiteReportPDFExporter: React.FC<SiteReportPDFExporterProps> = ({
  report,
  project,
  currentUser,
  onComplete,
}) => {
  // Method 1: Use fetch API to get images as blobs and convert to base64
  const loadImageAsBase64 = useCallback(
    async (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        // If it's already base64, return as is
        if (url.startsWith("data:")) {
          resolve(url);
          return;
        }

        console.log("📥 Loading image:", url);

        // Create a temporary image element to check if it loads
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function () {
          console.log("✅ Image loaded successfully via Image element:", url);
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Could not get canvas context"));
              return;
            }

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);

            // Convert to base64 with good quality
            const base64 = canvas.toDataURL("image/jpeg", 0.9);
            console.log("✅ Successfully converted to base64");
            resolve(base64);
          } catch (error) {
            console.error("❌ Canvas conversion error:", error);
            reject(error);
          }
        };

        img.onerror = function () {
          console.error("❌ Image element failed to load:", url);
          // Fallback: try with fetch
          fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.blob();
            })
            .then((blob) => {
              return new Promise<string>((resolveBlob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  console.log("✅ Image loaded via fetch fallback");
                  resolveBlob(reader.result as string);
                };
                reader.onerror = () => reject(new Error("FileReader failed"));
                reader.readAsDataURL(blob);
              });
            })
            .then(resolve)
            .catch((fetchError) => {
              console.error("❌ Fetch also failed:", fetchError);
              // Final fallback - use a placeholder
              resolve(
                "/placeholder.svg?height=200&width=300&text=Image+Not+Available"
              );
            });
        };

        // Add cache busting and try to load
        const timestamp = Date.now();
        const separator = url.includes("?") ? "&" : "?";
        const finalUrl = `${url}${separator}t=${timestamp}`;

        console.log("🔄 Attempting to load image from:", finalUrl);
        img.src = finalUrl;
      });
    },
    []
  );

  // Load all images for a category
  const loadImageCategory = useCallback(
    async (images: string[] | undefined, category: string) => {
      if (!images || images.length === 0) {
        console.log(`📭 No ${category} images to load`);
        return [];
      }

      console.log(`📁 Loading ${category} images:`, images);

      const loadedImages = await Promise.all(
        images.map(async (url, index) => {
          try {
            const base64 = await loadImageAsBase64(url);
            console.log(
              `✅ ${category} image ${index + 1} loaded successfully`
            );
            return base64;
          } catch (error) {
            console.error(`❌ ${category} image ${index + 1} failed:`, error);
            return "/placeholder.svg?height=200&width=300&text=Image+Not+Available";
          }
        })
      );

      return loadedImages;
    },
    [loadImageAsBase64]
  );

  useEffect(() => {
    const generatePDF = async () => {
      try {
        message.loading({
          content: "Preparing images for PDF export...",
          key: "pdfGen",
          duration: 0,
        });

        console.log("🔍 Starting PDF export for report:", report.title);
        console.log("📊 Image URLs to process:", {
          overview: report.overviewFile,
          weather: report.weather,
          workingDays: report.workingDays,
          laborTeam: report.LaborTeam,
        });

        // Load all images first
        const [
          overviewImages,
          weatherImages,
          workingDaysImages,
          laborTeamImages,
        ] = await Promise.all([
          loadImageCategory(report.overviewFile, "overview"),
          loadImageCategory(report.weather, "weather"),
          loadImageCategory(report.workingDays, "workingDays"),
          loadImageCategory(report.LaborTeam, "laborTeam"),
        ]);

        console.log("🎉 All images processed:", {
          overview: overviewImages.length,
          weather: weatherImages.length,
          workingDays: workingDaysImages.length,
          laborTeam: laborTeamImages.length,
        });

        message.loading({
          content: "Generating PDF document...",
          key: "pdfGen",
          duration: 0,
        });

        // Create the PDF content
        const container = document.createElement("div");
        container.style.padding = "20px";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.backgroundColor = "white";
        container.style.color = "#333";
        container.style.lineHeight = "1.4";

        // Helper function to create image sections
        const createImageSection = (images: string[], title: string) => {
          if (images.length === 0) {
            return `
              <div style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="border-bottom: 2px solid #1890ff; padding-bottom: 8px; color: #172B4D; font-size: 18px; margin-bottom: 15px;">${title}</h3>
                <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 8px;">
                  <p style="margin: 0; color: #666; font-style: italic;">No images available for this section</p>
                </div>
              </div>
            `;
          }

          return `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
              <h3 style="border-bottom: 2px solid #1890ff; padding-bottom: 8px; color: #172B4D; font-size: 18px; margin-bottom: 15px;">${title}</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                ${images
                  .map((imageData, index) => {
                    const isPlaceholder = imageData.includes("placeholder");
                    return `
                    <div style="page-break-inside: avoid; border: 1px solid #e1e5e9; border-radius: 8px; overflow: hidden; background: white;">
                      <div style="padding: 15px; background: #f8f9fa; border-bottom: 1px solid #e1e5e9;">
                        <h4 style="margin: 0; font-size: 14px; color: #495057; font-weight: 600;">${title} Image ${
                      index + 1
                    }</h4>
                      </div>
                      <div style="padding: 15px; text-align: center; min-height: 200px; display: flex; align-items: center; justify-content: center;">
                        <img src="${imageData}" 
                             style="max-width: 100%; max-height: 300px; height: auto; border-radius: 4px;"
                             alt="${title} Image ${index + 1}" />
                      </div>
                      ${
                        isPlaceholder
                          ? `
                        <div style="padding: 10px; background: #fff3cd; border-top: 1px solid #ffeaa7;">
                          <p style="margin: 0; font-size: 12px; color: #856404; text-align: center;">
                            ⚠️ Image could not be loaded
                          </p>
                        </div>
                      `
                          : ""
                      }
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
          `;
        };

        container.innerHTML = `
          <div style="max-width: 800px; margin: 0 auto;">
            <!-- Header Section -->
            <div style="text-align: center; margin-bottom: 40px; padding-bottom: 25px; border-bottom: 3px solid #1890ff;">
              <h1 style="margin: 0 0 10px 0; color: #172B4D; font-size: 32px; font-weight: bold;">${
                project.projectName || "Construction Project"
              }</h1>
              <h2 style="margin: 0 0 20px 0; color: #495057; font-size: 24px; font-weight: 600;">${
                report.title
              }</h2>
              
              <div style="display: inline-flex; flex-wrap: wrap; gap: 25px; justify-content: center; background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6c757d; font-weight: 600; margin-bottom: 4px;">REPORT DATE</div>
                  <div style="font-size: 14px; color: #495057; font-weight: 600;">${new Date(
                    report.date
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6c757d; font-weight: 600; margin-bottom: 4px;">GENERATED BY</div>
                  <div style="font-size: 14px; color: #495057; font-weight: 600;">${
                    currentUser.name
                  }</div>
                  <div style="font-size: 12px; color: #6c757d;">${
                    currentUser.role
                  }</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6c757d; font-weight: 600; margin-bottom: 4px;">GENERATED ON</div>
                  <div style="font-size: 14px; color: #495057; font-weight: 600;">${new Date().toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}</div>
                </div>
              </div>
            </div>

            <!-- Project Information -->
            <div style="margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
              <h3 style="margin: 0 0 20px 0; font-size: 22px; font-weight: bold; text-align: center;">PROJECT INFORMATION</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div>
                  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">CLIENT NAME</div>
                  <div style="font-size: 16px; font-weight: 600;">${
                    project.clientName || "Not specified"
                  }</div>
                </div>
                <div>
                  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">PROJECT STATUS</div>
                  <div style="font-size: 16px; font-weight: 600; text-transform: capitalize;">${
                    project.status || "Not specified"
                  }</div>
                </div>
                <div>
                  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">REFERENCE</div>
                  <div style="font-size: 16px; font-weight: 600;">${
                    project.reference || "Not specified"
                  }</div>
                </div>
                <div>
                  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">CONTACT</div>
                  <div style="font-size: 16px; font-weight: 600;">${
                    project.contact || "Not specified"
                  }</div>
                </div>
                <div style="grid-column: 1 / -1;">
                  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">PROJECT ADDRESS</div>
                  <div style="font-size: 16px; font-weight: 600;">${
                    project.address || "Not specified"
                  }</div>
                </div>
              </div>
            </div>

            <!-- Overview Section with Text -->
            ${
              report.overviewText
                ? `
              <div style="margin-bottom: 30px; padding: 20px; background: #e7f3ff; border-left: 4px solid #1890ff; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #172B4D; font-size: 20px;">Overview Description</h3>
                <p style="margin: 0; line-height: 1.6; color: #2d3748;">${report.overviewText.replace(
                  /<\/?[^>]+(>|$)/g,
                  ""
                )}</p>
              </div>
            `
                : ""
            }

            <!-- Image Sections -->
            ${createImageSection(overviewImages, "Site Overview")}
            ${createImageSection(weatherImages, "Weather Conditions")}
            ${createImageSection(workingDaysImages, "Working Days")}
            ${createImageSection(laborTeamImages, "Labour & Team")}

            <!-- Footer -->
            <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e9ecef; text-align: center; color: #6c757d;">
              <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Generated by Construction Management System</p>
              <p style="margin: 0; font-size: 12px;">${project.projectName} • ${
          report.title
        } • ${new Date().toLocaleDateString()}</p>
              <p style="margin: 10px 0 0 0; font-size: 10px; color: #adb5bd;">Document ID: ${
                report._id
              }</p>
            </div>
          </div>
        `;

        // PDF configuration
        const options = {
          margin: [15, 15, 15, 15],
          filename: `${report.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_site_report.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
            windowWidth: container.scrollWidth,
            windowHeight: container.scrollHeight,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait" as const,
            compress: true,
          },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };

        console.log("🚀 Generating PDF with html2pdf...");
        await html2pdf().set(options).from(container).save();

        console.log("✅ PDF generated successfully!");

        message.success({
          content: "PDF exported successfully with images!",
          key: "pdfGen",
        });

        onComplete?.();
      } catch (error) {
        console.error("💥 PDF generation failed:", error);
        message.error({
          content: "Failed to generate PDF. Please try again.",
          key: "pdfGen",
        });
        onComplete?.();
      }
    };

    generatePDF();
  }, [report, project, currentUser, onComplete, loadImageCategory]);

  return null;
};

export default SiteReportPDFExporter;
