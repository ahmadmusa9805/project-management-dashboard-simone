// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
// import CustomSearchInput from "../../../components/CustomSearchInput";
// import CustomCreateButton from "../../../components/CustomCreateButton";
// import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
// import { useNavigate, useParams } from "react-router-dom";

// import {
//   useGetAllQuotesQuery,
//   useCreateQuoteMutation,
//   useUpdateQuoteMutation,
//   useDeleteQuoteMutation,
//   useShareQuoteMutation,
//   useUnShareQuoteMutation,
// } from "../../../Redux/features/projects/project/quote/qouteApi";
// import { errorAlert, successAlert } from "../../../utils/alerts";
// import { showDeleteAlert } from "../../../utils/deleteAlert";
// import CustomShareSelector from "../../../components/CustomShareSelector";
// import { Modal } from "antd";

// const QuoteDetailsPage = () => {
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [quoteToShare, setQuoteToShare] = useState<any | null>(null);
//   const [shareMode, setShareMode] = useState<"share" | "unshare">("share");

//   const {
//     data: quotes = [],
//     isLoading,
//     refetch,
//   } = useGetAllQuotesQuery(projectId);

//   const [createQuote, { isLoading: creating }] = useCreateQuoteMutation();
//   const [updateQuote, { isLoading: updating }] = useUpdateQuoteMutation();
//   const [deleteQuote] = useDeleteQuoteMutation();
//   const [shareQuote] = useShareQuoteMutation();
//   const [unShareQuote] = useUnShareQuoteMutation();

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [editQuote, setEditQuote] = useState<any | null>(null);
//   const [mode, setMode] = useState<"create" | "edit">("create");

//   const handleCreateClick = () => {
//     setMode("create");
//     setEditQuote(null);
//     setIsDrawerOpen(true);
//   };

//   const handleViewClick = (quote: any) => {
//     navigate(`/projects/${projectId}/quote-documents`, {
//       state: {
//         quoteTitle: quote.title,
//         documents: [
//           {
//             id: 1,
//             title: quote.title,
//             amount: quote.value,
//             fileUrl: quote.file,
//           },
//         ],
//       },
//     });
//   };

//   const handleEditClick = (quote: any) => {
//     setMode("edit");
//     setEditQuote(quote);
//     setIsDrawerOpen(true);
//   };

//   const handleSubmit = async (data: any) => {
//     const formData = {
//       title: data.title,
//       projectId: projectId,
//       amount: Number(data.amount),
//       file: data.file,
//     };

//     try {
//       if (mode === "create") {
//         const result = await createQuote(formData).unwrap();
//         successAlert(result.message);
//         refetch();
//       } else if (mode === "edit" && editQuote) {
//         const result = await updateQuote({
//           id: editQuote._id,
//           data: formData,
//         }).unwrap();
//         successAlert(result.message);
//         refetch();
//       }
//       setIsDrawerOpen(false);
//       setEditQuote(null);
//     } catch (error: any) {
//       const errorMessage =
//         error?.data?.errorSources?.[0]?.message ||
//         error?.data?.message ||
//         "Failed to submit quote.";
//       errorAlert("Submission Error", errorMessage);
//       console.error("Error submitting quote:", error);
//     }
//   };

//   const handleShare = async (selectedUserIds: any[]) => {
//     if (!selectedUserIds.length || !quoteToShare?._id) return;
//     try {
//       if (shareMode === "share") {
//         const res = await shareQuote({
//           id: quoteToShare._id,
//           sharedWith: selectedUserIds,
//         }).unwrap();
//         successAlert(res.message || "Quote shared successfully!");
//       } else {
//         const res = await unShareQuote({
//           id: quoteToShare._id,
//           unShareWith: selectedUserIds.map((u) => u.userId),
//         }).unwrap();
//         successAlert(res.message || "Quote unshared successfully!");
//       }
//       setShareModalOpen(false);
//       setQuoteToShare(null);
//       refetch();
//     } catch (err: any) {
//       errorAlert(
//         "Sharing Error",
//         err?.data?.message || "Failed to process share action"
//       );
//     }
//   };

//   return (
//     <div className="w-full px-4  gap-4 bg-white min-h-screen pt-3">
//       <div className="flex justify-between">
//         <h1 className="text-2xl font-semibold mb-4">Manage Quote</h1>
//         <CustomSearchInput onSearch={() => {}} />
//       </div>

//       <div className="flex justify-end mr-4 mb-4">
//         <CustomCreateButton title="Create Quote" onClick={handleCreateClick} />
//       </div>

//       <ResuableDocumentForm
//         mode={mode}
//         creating={creating}
//         updating={updating}
//         open={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         onSubmit={handleSubmit}
//         defaultValues={
//           mode === "edit" && editQuote
//             ? {
//                 title: editQuote.title,
//                 amount: editQuote.value,
//               }
//             : {
//                 title: "",
//                 amount: "",
//               }
//         }
//         fields={[
//           { name: "title", label: "Quote Title", placeholder: "Enter title" },
//           { name: "amount", label: "Amount", placeholder: "Enter amount" },
//         ]}
//       />

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="flex flex-wrap gap-4">
//           {quotes
//             .filter((q) => q.projectId === projectId)
//             .map((quote: any) => (
//               <div
//                 key={quote._id}
//                 className="p-4 bg-[#F1F1F1] border  rounded w-60 flex flex-col gap-4 cursor-pointer  transition"
//               >
//                 <div className="flex justify-between items-start w-full">
//                   <h3 className="text-lg font-medium text-gray-900 w-36 truncate">
//                     {quote.title}
//                   </h3>
//                   <CustomViewMoreButton
//                     items={[
//                       { key: "view quote", label: "View Quote" },
//                       { key: "edit", label: "Edit Quote" },
//                       { key: "share", label: "Share Quote" },
//                       { key: "unshare", label: "Unshare Quote" },
//                       { key: "delete", label: "Delete Quote" },
//                     ]}
//                     onClick={async (key) => {
//                       switch (key) {
//                         case "view quote":
//                           handleViewClick(quote);
//                           break;
//                         case "edit":
//                           handleEditClick(quote);
//                           break;
//                         case "share":
//                           setShareMode("share");
//                           setQuoteToShare(quote);
//                           setShareModalOpen(true);
//                           break;
//                         case "unshare":
//                           setShareMode("unshare");
//                           setQuoteToShare(quote);
//                           setShareModalOpen(true);
//                           break;
//                         case "delete":
//                           showDeleteAlert({
//                             onConfirm: async () => {
//                               try {
//                                 await deleteQuote(quote._id).unwrap();
//                                 successAlert("Quote deleted successfully!");
//                               } catch (err) {
//                                 console.error("Error deleting quote", err);
//                               }
//                             },
//                           });
//                           break;
//                       }
//                     }}
//                   />
//                 </div>
//                 <p className="text-lg font-medium text-gray-900">
//                   ${quote.value}
//                 </p>
//               </div>
//             ))}
//         </div>
//       )}

//       <Modal
//         open={shareModalOpen && !!quoteToShare}
//         footer={null}
//         onCancel={() => setShareModalOpen(false)}
//       >
//         <CustomShareSelector
//           title={
//             shareMode === "share" ? "Share Quote With" : "Unshare Quote With"
//           }
//           roles={["superAdmin", "primeAdmin", "basicAdmin", "client"]}
//           onShare={handleShare}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default QuoteDetailsPage;

// TODO: refactor this above code after review

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
// import CustomSearchInput from "../../../components/CustomSearchInput";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Modal, Row, Spin, Statistic } from "antd";

import {
  useGetAllQuotesQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useShareQuoteMutation,
  useUnShareQuoteMutation,
  useGetSingleQuoteQuery,
} from "../../../Redux/features/projects/project/quote/qouteApi";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import CustomShareSelector from "../../../components/CustomShareSelector";
import CustomUnshareSelector from "../../../components/CustomUnshareSelector";
import { Unlink } from "lucide-react";

const QuoteDetailsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const { data: singleQuoteData } = useGetSingleQuoteQuery(selectedQuoteId!, {
    skip: !selectedQuoteId,
  });

  const {
    data: quotes = [],
    isLoading,
    refetch,
  } = useGetAllQuotesQuery(projectId);

  const [createQuote, { isLoading: creating }] = useCreateQuoteMutation();
  const [updateQuote, { isLoading: updating }] = useUpdateQuoteMutation();
  const [deleteQuote] = useDeleteQuoteMutation();
  const [shareQuote] = useShareQuoteMutation();
  const [unShareQuote] = useUnShareQuoteMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editQuote, setEditQuote] = useState<any | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareQuoteItem, setShareQuoteItem] = useState<any | null>(null);

  // Unshare modal state
  const [unshareModalOpen, setUnshareModalOpen] = useState(false);

  const handleCreateClick = () => {
    setMode("create");
    setEditQuote(null);
    setIsDrawerOpen(true);
  };

  const handleViewClick = (quote: any) => {
    console.log("Viewing quote:", quote);
    navigate(`/projects/${projectId}/quote-documents`, {
      state: {
        quoteTitle: quote.title,
        documents: [
          {
            id: quote._id,
            title: quote.title,
            amount: quote.value,
            fileUrl: quote.file,
          },
        ],
      },
    });
  };

  const handleEditClick = (quote: any) => {
    setMode("edit");
    setEditQuote(quote);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (data: any) => {
    const formData = {
      title: data.title,
      projectId: projectId,
      amount: Number(data.amount),
      file: data.file,
    };

    try {
      if (mode === "create") {
        const result = await createQuote(formData).unwrap();
        successAlert(result.message);
        refetch();
      } else if (mode === "edit" && editQuote) {
        const result = await updateQuote({
          id: editQuote._id,
          data: formData,
        }).unwrap();
        successAlert(result.message);
        refetch();
      }
      setIsDrawerOpen(false);
      setEditQuote(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        "Failed to submit quote.";
      errorAlert("Submission Error", errorMessage);
      console.error("Error submitting quote:", error);
    }
  };

  // ✅ Handle Share Quote
  const handleShareQuote = (quote: any) => {
    setShareQuoteItem(quote);
    setShareModalOpen(true);
  };

  // ✅ Confirm Share
  const handleConfirmShare = async (selectedUsers: any[]) => {
    console.log(selectedUsers);
    try {
      await shareQuote({
        id: shareQuoteItem._id,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert("Quote shared successfully!");
      setShareModalOpen(false);
      setShareQuoteItem(null);
      refetch();
    } catch (err: any) {
      errorAlert(
        "Sharing Error",
        err?.data?.message || "Failed to share quote"
      );
    }
  };

  // ✅ Handle Unshare Quote
  const handleUnShareQuote = (quote: any) => {
    setSelectedQuoteId(quote._id);
    setUnshareModalOpen(true);
  };

  // ✅ Confirm Unshare
  const handleConfirmUnshare = async (selectedUsers: any[]) => {
    try {
      await unShareQuote({
        id: selectedQuoteId!,
        unShareWith: selectedUsers.map((u) => u.userId),
      }).unwrap();
      successAlert("Quote unshared successfully!");
      setUnshareModalOpen(false);
      setSelectedQuoteId(null);
      refetch();
    } catch (err: any) {
      errorAlert(
        "Unsharing Error",
        err?.data?.message || "Failed to unshare quote"
      );
    }
  };

  return (
    <div className="w-full  gap-4 bg-white min-h-screen p-6">
      <div className="flex justify-between py-10">
        <h1 className="text-2xl font-semibold">Quotes</h1>
        {/* <CustomSearchInput onSearch={() => {}} /> */}
        <CustomCreateButton title="Create Quote" onClick={handleCreateClick} />
      </div>

      {/* <div className="flex justify-end mr-4 mb-4">
        <CustomCreateButton title="Create Quote" onClick={handleCreateClick} />
      </div> */}

      <ResuableDocumentForm
        title="Quote"
        mode={mode}
        creating={creating}
        updating={updating}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={
          mode === "edit" && editQuote
            ? {
                title: editQuote.title,
                amount: editQuote.value,
              }
            : {
                title: "",
                amount: "",
              }
        }
        fields={[
          { name: "title", label: "Quote Title", placeholder: "Enter title" },
          { name: "amount", label: "Amount", placeholder: "Enter amount" },
        ]}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {quotes
            .filter((q) => q.projectId === projectId)
            .map((quote: any) => (
              <Col span={6} key={quote._id}>
                <Card
                  style={{
                    backgroundColor: "#f1f1f1",
                  }}
                  hoverable
                  bodyStyle={{
                    backgroundColor: "#f1f1f1",
                    padding: "12px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                  onClick={() => handleViewClick(quote)}
                  title={
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {quote.title}
                    </h3>
                  }
                  extra={
                    <CustomViewMoreButton
                      items={[
                        { key: "view quote", label: "👁️ View Quote" },
                        { key: "edit", label: "✏️ Edit Quote" },
                        { key: "share", label: "🔗 Share Quote" },
                        {
                          key: "unshare",
                          label: (
                            <div className="flex items-center gap-1">
                              <Unlink className="text-green-500" size={14} />
                              Unshare Quote
                            </div>
                          ),
                        },
                        {
                          key: "delete",
                          label: "🗑️ Delete Quote",
                          danger: true,
                        },
                      ]}
                      onClick={async (key) => {
                        switch (key) {
                          case "view quote":
                            handleViewClick(quote);
                            break;
                          case "edit":
                            handleEditClick(quote);
                            break;
                          case "share":
                            handleShareQuote(quote);
                            break;
                          case "unshare":
                            handleUnShareQuote(quote);
                            break;
                          case "delete":
                            showDeleteAlert({
                              onConfirm: async () => {
                                try {
                                  await deleteQuote(quote._id).unwrap();
                                  refetch();
                                } catch (err: any) {
                                  errorAlert(
                                    "Delete Error",
                                    err?.data?.message ||
                                      "Failed to delete quote"
                                  );
                                }
                              },
                            });
                            break;
                        }
                      }}
                    />
                  }
                >
                  <Statistic value={quote.value} prefix="£" />
                </Card>
              </Col>
            ))}
        </Row>
      )}

      {/* Modal for Sharing */}
      <Modal
        title="Share Quote"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          setShareQuoteItem(null);
        }}
        footer={null}
        width={500}
      >
        <CustomShareSelector
          title="Share this quote"
          roles={["primeAdmin", "basicAdmin", "client"]}
          onShare={handleConfirmShare}
        />
      </Modal>

      {/* Modal for Unsharing */}
      <Modal
        title="Unshare Quote"
        open={unshareModalOpen}
        onCancel={() => {
          setUnshareModalOpen(false);
          setSelectedQuoteId(null);
        }}
        footer={null}
        width={500}
      >
        <CustomUnshareSelector
          title="Remove access from users"
          sharedUsers={(singleQuoteData?.sharedWith || []).map((u: any) => ({
            userId: u.userId._id,
            name: u.userId.name,
            role: u.userId.role,
            email: u.userId.email || "",
            profileImg: u.userId.profileImg,
          }))}
          onUnshare={handleConfirmUnshare}
        />
      </Modal>
    </div>
  );
};

export default QuoteDetailsPage;
