/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd"; // ✅ Import Spin
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useGetAllPaymentTrackerElementsQuery } from "../../../Redux/features/projects/project/paymentTracker/paymentTrackerApi";

const PaymentTrackerPage = () => {
  const { projectId } = useParams();
  const {
    data: paymentData,
    isLoading,
    isError,
  } = useGetAllPaymentTrackerElementsQuery(
    {
      projectId: projectId!,
      status: "paid",
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const navigate = useNavigate();

  // ✅ Convert object -> array for UI mapping
  const payments = [
    paymentData?.quote && {
      id: paymentData.quote._id,
      title: paymentData.quote.title,
      value: paymentData.quote.value,
      documents: [
        {
          id: paymentData.quote._id,
          title: paymentData.quote.title,
          amount: paymentData.quote.value,
          fileUrl: paymentData.quote.file,
        },
      ],
    },
    ...(paymentData?.interims?.map((i: any) => ({
      id: i._id,
      title: i.title,
      value: i.value,
      documents: [
        {
          id: i._id,
          title: i.title,
          amount: i.value,
          fileUrl: i.file,
        },
      ],
    })) || []),
    {
      id: "outStanding",
      title: "Total Outstanding",
      value: paymentData?.outStanding,
    },
    {
      id: "profit",
      title: "Total Profit",
      value: paymentData?.profit,
    },
  ].filter(Boolean);

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      {/* Title */}
      <h1 className="text-xl font-bold mb-6 py-8">Payment Tracker Page</h1>

      {/* Loader under title */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40 my-10">
          <Spin size="large" />
        </div>
      ) : isError || !paymentData ? (
        <div className="text-red-500 mb-4">
          Error loading payment data. Please try again later.
        </div>
      ) : payments.length === 0 ? (
        <div className="text-red-500 mb-4">
          No payment data found. Try loading it first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {payments.map((item) => {
            const isSpecialTitle =
              item.title === "Total Profit" ||
              item.title === "Total Outstanding";

            return (
              <div
                key={item.id}
                className={`p-6 bg-[#f1f1f1] rounded flex flex-col justify-between ${
                  isSpecialTitle ? "" : "hover:bg-[#e6f4ea] cursor-pointer"
                }`}
                onClick={() => {
                  if (!isSpecialTitle) {
                    navigate(`/projects/${projectId}/paymentrucker-documents`, {
                      state: {
                        quoteTitle: item.title,
                        documents: item.documents,
                      },
                    });
                  }
                }}
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {!isSpecialTitle && (
                    <CustomViewMoreButton
                      items={[{ key: "view", label: "👁️ View Details" }]}
                      onClick={(key, e) => {
                        e.stopPropagation();
                        if (key === "view" && item.documents) {
                          navigate(
                            `/projects/${projectId}/paymentrucker-documents`,
                            {
                              state: {
                                quoteTitle: item.title,
                                documents: item.documents,
                              },
                            }
                          );
                        }
                      }}
                    />
                  )}
                </div>
                <p className="mt-2 text-lg text-gray-900">{item.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentTrackerPage;
