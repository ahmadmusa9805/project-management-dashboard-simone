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

import { message } from "antd";
import html2pdf, { type Html2PdfOptions } from "html2pdf.js";
import React, { useCallback, useEffect } from "react";

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

// ...existing interfaces...

const SiteReportPDFExporter: React.FC<SiteReportPDFExporterProps> = ({
  report,
  project,
  currentUser,
  onComplete,
}) => {
  const loadImage = useCallback(async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to match loaded image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        if (ctx) {
          // Draw image to canvas
          ctx.drawImage(img, 0, 0);

          // Convert to base64
          try {
            const base64 = canvas.toDataURL("image/jpeg", 1.0);
            resolve(base64);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };

      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

      // Append timestamp to bypass cache
      img.src = `${url}?t=${Date.now()}`;
    });
  }, []);

  useEffect(() => {
    const generatePDF = async () => {
      try {
        message.loading({ content: "Loading images...", key: "pdfGen" });

        // Wait for all images to load before creating PDF
        const images = {
          overview: await Promise.all(
            (report.overviewFile || []).map(loadImage)
          ),
          weather: await Promise.all((report.weather || []).map(loadImage)),
          workingDays: await Promise.all(
            (report.workingDays || []).map(loadImage)
          ),
          laborTeam: await Promise.all((report.LaborTeam || []).map(loadImage)),
        };

        const container = document.createElement("div");
        container.style.padding = "20px";
        container.innerHTML = `
          <div style="font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0;">${project.projectName}</h1>
              <h2 style="color: #666; margin: 10px 0;">${report.title}</h2>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>

            ${
              images.overview.length
                ? `
              <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Overview Images</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  ${images.overview
                    .map(
                      (base64) =>
                        `<div style="break-inside: avoid;">
                      <img src="${base64}" 
                           style="width: 100%; max-height: 300px; object-fit: contain;" />
                    </div>`
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            ${
              images.weather.length
                ? `
              <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Weather Images</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  ${images.weather
                    .map(
                      (base64) =>
                        `<div style="break-inside: avoid;">
                      <img src="${base64}" 
                           style="width: 100%; max-height: 300px; object-fit: contain;" />
                    </div>`
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            ${
              images.workingDays.length
                ? `
              <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Working Days Images</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  ${images.workingDays
                    .map(
                      (base64) =>
                        `<div style="break-inside: avoid;">
                      <img src="${base64}" 
                           style="width: 100%; max-height: 300px; object-fit: contain;" />
                    </div>`
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            ${
              images.laborTeam.length
                ? `
              <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Labor Team Images</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  ${images.laborTeam
                    .map(
                      (base64) =>
                        `<div style="break-inside: avoid;">
                      <img src="${base64}" 
                           style="width: 100%; max-height: 300px; object-fit: contain;" />
                    </div>`
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        `;

        // Configure PDF options
        const options = {
          margin: [10, 10, 10, 10],
          filename: `${report.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_report.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            imageTimeout: 0,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait" as const,
          },
        };

        message.loading({ content: "Generating PDF...", key: "pdfGen" });

        // Generate PDF
        await html2pdf().set(options).from(container).save();

        message.success({
          content: "PDF generated successfully!",
          key: "pdfGen",
        });
        onComplete?.();
      } catch (error) {
        console.error("Error generating PDF:", error);
        message.error({ content: "Failed to generate PDF", key: "pdfGen" });
        onComplete?.();
      }
    };

    generatePDF();
  }, [report, project, currentUser, onComplete, loadImage]);

  return null;
};

export default SiteReportPDFExporter;
