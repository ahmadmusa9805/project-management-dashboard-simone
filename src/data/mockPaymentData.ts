// /data/mockPaymentData.ts
export const mockPaymentData = [
  {
    id: 1,
    title: "Contract value",
    value: "$100.00",
    documents: [
      {
        id: 101,
        title: "Contract PDF",
        amount: 100,
        fileUrl: "https://example.com/contract.pdf",
      },
    ],
  },
  {
    id: 2,
    title: "Interim evaluation 1",
    value: "$24,525.00",
    documents: [
      {
        id: 201,
        title: "Evaluation 1 Sheet",
        amount: 24525,
        fileUrl: "https://example.com/eval1.pdf",
      },
    ],
  },
  {
    id: 3,
    title: "Interim evaluation 2",
    value: "$24,525.00",
    documents: [
      {
        id: 301,
        title: "Evaluation 2 Sheet",
        amount: 24525,
        fileUrl: "https://example.com/eval2.pdf",
      },
    ],
  },
  {
    id: 4,
    title: "Total outstanding from contract",
    value: "$50.00",
    documents: [
      {
        id: 401,
        title: "Outstanding Invoice",
        amount: 50,
        fileUrl: "https://example.com/outstanding.pdf",
      },
    ],
  },
  {
    id: 5,
    title: "Total Profit",
    value: "$3,512.00",
    fileUrl: "https://example.com/outstanding.pdf",
  },
];
