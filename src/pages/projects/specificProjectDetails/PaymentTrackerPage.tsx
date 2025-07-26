import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import type { RootState } from "../../../Redux/app/store";
import { setPaymentsForProject } from "../../../Redux/features/payments/paymentSlice";
import { mockPaymentData } from "../../../data/mockPaymentData"; // ✅ Make sure this file exists

const PaymentTrackerPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { projectId } = useParams();

  const payments = useSelector(
    (state: RootState) => state.payment.payments[projectId!] || []
  );

  // ✅ Auto load payment data when component mounts
  useEffect(() => {
    if (projectId && payments.length === 0) {
      dispatch(setPaymentsForProject({ projectId, payments: mockPaymentData }));
    }
  }, [dispatch, projectId, payments.length]);

  return (
    <div className="p-6">
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
                {item.title !== "Total Profit" && (
                  <CustomViewMoreButton
                    items={
                      item.title === "Total outstanding from contract"
                        ? [{ key: "shared", label: "Shared" }]
                        : [
                            { key: "view", label: "View Details" },
                            { key: "shared", label: "Shared" },
                            { key: "delete", label: "Delete" },
                          ]
                    }
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
