// import z from "zod";

// const quoteSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   projectId: z.string().min(1, 'Project is required'),
//   amount: z.number().min(1, 'Amount must be greater than 0'),
//   file: z
//     .any()
//     .refine((file) => file instanceof File || file?.originFileObj, {
//       message: 'File is required',
//     }),
// });
