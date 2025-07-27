import React from "react";
import CertificateCard from "../../../components/CertificateCard";
import CustomCreateButton from "../../../components/CustomCreateButton";
// Adjust paths if needed

const mockCertificates = [
  { id: "cert1", title: "Certificate 1", size: "157KB" },
  { id: "cert2", title: "Certificate 2", size: "157KB" },
  { id: "cert3", title: "Certificate 3", size: "157KB" },
  { id: "cert4", title: "Certificate 4", size: "205KB" },
  { id: "cert5", title: "Certificate 5", size: "98KB" },
];

const CertificatesPage: React.FC = () => {
  const handleAddCertificate = () => {
    console.log("Add Certificate clicked");
    // You can open a modal or drawer here
  };

  return (
    <>
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <CustomCreateButton
          title="Add Certificate"
          onClick={handleAddCertificate}
        />
      </div>

      {/* Certificate Cards */}
      <div className="w-full p-5 flex flex-wrap gap-4 items-start justify-start">
        {mockCertificates.map((cert) => (
          <CertificateCard key={cert.id} title={cert.title} size={cert.size} />
        ))}
      </div>
    </>
  );
};

export default CertificatesPage;
