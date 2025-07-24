/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ResuableDocumentForm from "../../../components/ResuableDocumentForm";
import CustomSearchInput from "../../../components/CustomSearchInput";
import CustomCreateButton from "../../../components/CustomCreateButton";
import CustomViewMoreButton from "../../../components/CustomViewMoreButton";
import { useNavigate, useParams } from "react-router-dom";

interface QuoteItem {
  id: number;
  title: string;
  amount: number;
}

const QuoteDetailsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editQuote, setEditQuote] = useState<QuoteItem | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleCreateClick = () => {
    setMode("create");
    setEditQuote(null);
    setIsDrawerOpen(true);
  };

  const handleViewClick=(quote: QuoteItem) => {

    navigate(`/projects/${projectId}/quote-documents`, {
      state: {
        quoteTitle: quote.title,
        documents: [
          {
            id: 1,
            title: "Property Document",
            amount: 5000,
            fileUrl:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            id: 2,
            title: "Quote Breakdown",
            amount: 15000,
            fileUrl:
              "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
          },
          {
            id: 3,
            title: "Signature Sheet",
            amount: 3000,
            fileUrl:
              "https://cors-anywhere.herokuapp.com/https://file-examples.com/storage/fe06201e15df7ea9dff2f74/2017/10/file-sample_150kB.pdf",
          },
        ],
      },
    });
  }

  const handleEditClick = (quote: QuoteItem) => {
    setMode("edit");
    setEditQuote(quote);
    setIsDrawerOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (mode === "create") {
      const newQuote = { ...data, id: Date.now() };
      setQuotes((prev) => [...prev, newQuote]);
    } else if (mode === "edit" && editQuote) {
      const updatedQuotes = quotes.map((q) =>
        q.id === editQuote.id ? { ...editQuote, ...data } : q
      );
      setQuotes(updatedQuotes);
    }

    setIsDrawerOpen(false);
    setEditQuote(null);
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">Manage Quote</h1>
        <CustomSearchInput onSearch={() => {}} />
      </div>

      {/* Create Button */}
      <div className="flex justify-end mr-4 mb-4">
        <CustomCreateButton title="Create Quote" onClick={handleCreateClick} />
      </div>

      {/* Reusable Form */}
      <ResuableDocumentForm
        mode={mode}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={
          editQuote ? { title: editQuote.title, amount: editQuote.amount } : {}
        }
        fields={[
          {
            name: "title",
            label: "Quote Title",
            placeholder: "Enter quote title",
          },
          {
            name: "amount",
            label: "Amount",
            placeholder: "Enter amount",
          },
        ]}
      />

      {/* Quote Cards */}

      {quotes.map((quote) => (
        <div
            //   state: {
            //     quoteTitle: quote.title,
            //     documents: [
            //       { id: 1, title: `${quote.title}`, amount: `${quote.amount}` },
            //     ],
            //   },
            // })
          
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
              ]}
              onClick={(key) => {
                switch (key) {
                  case "view quote":
                    handleViewClick(quote);
                    break;
                  case "edit":
                    handleEditClick(quote);
                    break;
                  case "share":
                    console.log("Share", quote);
                    break;
                }
              }}
            />
          </div>
          <p className="text-lg font-medium text-gray-900">${quote.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default QuoteDetailsPage;
