
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
 
// } from "../../../Redux/features/projects/project/quote/qouteApi"; // ✅ adjust path if needed
// import { _success } from "zod/v4/core";
// import { errorAlert, successAlert } from "../../../utils/alerts";
// import { showDeleteAlert } from "../../../utils/deleteAlert";

// const QuoteDetailsPage = () => {
//   const navigate = useNavigate();
//   const { projectId } = useParams();


//   // Fetching from API
//   const { data: quotes = [], isLoading, refetch } = useGetAllQuotesQuery();

//   const [createQuote] = useCreateQuoteMutation();
//   const [updateQuote] = useUpdateQuoteMutation();
//   const [deleteQuote] = useDeleteQuoteMutation();


//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [editQuote, setEditQuote] = useState<any | null>(null);
//   const [mode, setMode] = useState<"create" | "edit">("create");

//   const handleCreateClick = () => {
//     setMode("create");
//     setEditQuote(null);
//     setIsDrawerOpen(true);
//   };

//   console.log(quotes[0])

//   const handleViewClick = (quote: any) => {
//     navigate(`/projects/${projectId}/quote-documents`, {
//       state: {
//         quoteTitle: quote.title,
//         documents: [
//           {
//             id: 1,
//             title: quote.title,
//             amount: quote.value,
//             fileUrl: quote.file, // actual file URL from DB
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
//       projectId: projectId, // from useParams
//       amount: Number(data.amount),
//       file: data.file,
//     };

//     try {
//       if (mode === "create") {
//         const result = await createQuote(formData).unwrap();
//         console.log(result)

//         successAlert(result.message)
//         refetch()

//       } else if (mode === "edit" && editQuote) {
//         const result = await updateQuote({ id: editQuote._id, data: formData }).unwrap();

//         successAlert(result.message)
//         refetch()
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


//   return (
//     <div className="w-full px-4  gap-4 bg-white min-h-screen pt-3">
//       {/* Header */}
//       <div className="flex justify-between">
//         <h1 className="text-2xl font-semibold mb-4">Manage Quote</h1>
//         <CustomSearchInput onSearch={() => { }} />
//       </div>

//       {/* Create Button */}
//       <div className="flex justify-end mr-4 mb-4">
//         <CustomCreateButton title="Create Quote" onClick={handleCreateClick} />
//       </div>

//       {/* Reusable Form */}
//       <ResuableDocumentForm
//         mode={mode}
//         open={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         onSubmit={handleSubmit}
//         defaultValues={
//           mode === "edit" && editQuote
//             ? {
//               title: editQuote.title,
//               amount: editQuote.value,
//             }
//             : {
//               title: "",
//               amount: "",
//             }
//         }
//         fields={[
//           { name: "title", label: "Quote Title", placeholder: "Enter title" },
//           { name: "amount", label: "Amount", placeholder: "Enter amount" },
//         ]}
//       />


//       {/* Quote Cards */}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="flex flex-wrap gap-4">
//           {quotes
//             .filter(
//               (q) => q.projectId === projectId
//             ) // Optional: filter by project
//             .map((quote: any) => (
//               <div
//                 key={quote._id}
//                 className="p-4 bg-gray-100 border border-gray-300 rounded w-60 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition"
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
//                         case 'share':
                         
//                           break;
//                         case 'unshare':
                         
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

      
//     </div>
//   );
// };

// export default QuoteDetailsPage;



/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
import CustomSearchInput from "../../../components/CustomSearchInput";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetAllQuotesQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useShareQuoteMutation,
  useUnShareQuoteMutation,
} from "../../../Redux/features/projects/project/quote/qouteApi";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { showDeleteAlert } from "../../../utils/deleteAlert";
import CustomShareSelector from "../../../components/CustomShareSelector";
import { Modal } from "antd";

const QuoteDetailsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [quoteToShare, setQuoteToShare] = useState<any | null>(null);
  const [shareMode, setShareMode] = useState<'share' | 'unshare'>('share');

  const { data: quotes = [], isLoading, refetch } = useGetAllQuotesQuery();

  const [createQuote] = useCreateQuoteMutation();
  const [updateQuote] = useUpdateQuoteMutation();
  const [deleteQuote] = useDeleteQuoteMutation();
  const [shareQuote] = useShareQuoteMutation();
  const [unShareQuote] = useUnShareQuoteMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editQuote, setEditQuote] = useState<any | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleCreateClick = () => {
    setMode("create");
    setEditQuote(null);
    setIsDrawerOpen(true);
  };

  const handleViewClick = (quote: any) => {
    navigate(`/projects/${projectId}/quote-documents`, {
      state: {
        quoteTitle: quote.title,
        documents: [
          {
            id: 1,
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
        const result = await updateQuote({ id: editQuote._id, data: formData }).unwrap();
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

  const handleShare = async (selectedUserIds: string[]) => {
    if (!selectedUserIds.length || !quoteToShare?._id) return;
    try {
      if (shareMode === 'share') {
        const res = await shareQuote({ id: quoteToShare._id, sharedWith: selectedUserIds }).unwrap();
        successAlert(res.message || 'Quote shared successfully!');
      } else {
        const res = await unShareQuote({ id: quoteToShare._id, unShareWith: selectedUserIds }).unwrap();
        successAlert(res.message || 'Quote unshared successfully!');
      }
      setShareModalOpen(false);
      setQuoteToShare(null);
      refetch();
    } catch (err: any) {
      errorAlert(
        'Sharing Error',
        err?.data?.message || 'Failed to process share action'
      );
    }
  };

  return (
    <div className="w-full px-4  gap-4 bg-white min-h-screen pt-3">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">Manage Quote</h1>
        <CustomSearchInput onSearch={() => { }} />
      </div>

      <div className="flex justify-end mr-4 mb-4">
        <CustomCreateButton title="Create Quote" onClick={handleCreateClick} />
      </div>

      <ResuableDocumentForm
        mode={mode}
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
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {quotes
            .filter((q) => q.projectId === projectId)
            .map((quote: any) => (
              <div
                key={quote._id}
                className="p-4 bg-gray-100 border border-gray-300 rounded w-60 flex flex-col gap-4 cursor-pointer hover:bg-gray-200 transition"
              >
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-lg font-medium text-gray-900 w-36 truncate">
                    {quote.title}
                  </h3>
                  <CustomViewMoreButton
                    items={[
                      { key: "view quote", label: "View Quote" },
                      { key: "edit", label: "Edit Quote" },
                      { key: "share", label: "Share Quote" },
                      { key: "unshare", label: "Unshare Quote" },
                      { key: "delete", label: "Delete Quote" },
                    ]}
                    onClick={async (key) => {
                      switch (key) {
                        case "view quote":
                          handleViewClick(quote);
                          break;
                        case "edit":
                          handleEditClick(quote);
                          break;
                        case 'share':
                          setShareMode('share');
                          setQuoteToShare(quote);
                          setShareModalOpen(true);
                          break;
                        case 'unshare':
                          setShareMode('unshare');
                          setQuoteToShare(quote);
                          setShareModalOpen(true);
                          break;
                        case "delete":
                          showDeleteAlert({
                            onConfirm: async () => {
                              try {
                                await deleteQuote(quote._id).unwrap();
                                successAlert("Quote deleted successfully!");
                              } catch (err) {
                                console.error("Error deleting quote", err);
                              }
                            },
                          });
                          break;
                      }
                    }}
                  />
                </div>
                <p className="text-lg font-medium text-gray-900">
                  ${quote.value}
                </p>
              </div>
            ))}
        </div>
      )}

      <Modal
        open={shareModalOpen && !!quoteToShare}
        footer={null}
        onCancel={() => setShareModalOpen(false)}
      >
        <CustomShareSelector
          title={shareMode === 'share' ? 'Share Quote With' : 'Unshare Quote With'}
          roles={['superAdmin', 'primeAdmin', 'basicAdmin', 'client']}
          onShare={handleShare}
        />
      </Modal>
    </div>
  );
};

export default QuoteDetailsPage;
