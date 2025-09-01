/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useGetAllPaymentTrackerElementsQuery } from "../../../Redux/features/projects/project/paymentTracker/paymentTrackerApi";

const PaymentTrackerPage = () => {
  const { projectId } = useParams();
  const { data: paymentData, isLoading } = useGetAllPaymentTrackerElementsQuery(
    { projectId: projectId!, status: "paid" }
  );
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  console.log("Payments:", paymentData);

  // ✅ Convert object -> array for UI mapping
  const payments = [
    paymentData?.quote && {
      id: paymentData.quote._id,
      title: paymentData.quote.title,
      value: paymentData.quote.value,
      documents: [paymentData.quote],
    },
    ...(paymentData?.interims?.map((i: any) => ({
      id: i._id,
      title: i.title,
      value: i.value,
      documents: [i],
    })) || []),
    {
      id: "outStanding",
      title: "Total outstanding from contract",
      value: paymentData?.outStanding,
    },
    {
      id: "profit",
      title: "Total Profit",
      value: paymentData?.profit,
    },
  ].filter(Boolean); // remove null/undefined entries

  return (
    <div className="w-full px-4 gap-4 bg-white min-h-screen pt-3">
      <h1 className="text-xl font-bold mb-6">Payment Tracker Page</h1>

      {payments.length === 0 ? (
        <div className="text-red-500 mb-4">
          No payment data found. Try loading it first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {payments.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-gray-100 rounded shadow flex flex-col justify-between"
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.title !== "Total Profit" &&
                  item.title !== "Total outstanding from contract" && (
                    <CustomViewMoreButton
                      items={[{ key: "view", label: "View Details" }]}
                      onClick={(key) => {
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
                        } else {
                          console.log(`Clicked '${key}' on ${item.title}`);
                        }
                      }}
                    />
                  )}
              </div>
              <p className="mt-2 text-lg text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentTrackerPage;
