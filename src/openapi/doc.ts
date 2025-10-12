import { createDocument } from "zod-openapi";

// Placeholder export để tránh lỗi import
export const openApiDoc = createDocument({
  openapi: "3.1.0",
  info: { title: "CreditGame API", version: "1.0.0" },
  servers: [{ url: "/api" }],
  paths: {
    // Placeholder - sẽ được cập nhật sau
  },
});

// import * as z from "zod"; // (Zod v4)
// import { createDocument } from "zod-openapi";
// // import { RegisterInput } from "@/modules/users/schemas";

// export const openApiDoc = createDocument({
//   openapi: "3.1.0",
//   info: { title: "CreditGame API", version: "1.0.0" },
//   servers: [{ url: "/api" }],
//   paths: {
//     "/auth/register": {
//       post: {
//         requestBody: {
//           content: { "application/json": { schema: RegisterInput } },
//           required: true,
//         },
//         responses: {
//           200: {
//             description: "OK",
//             content: { "application/json": { schema: z.any() } },
//           },
//         },
//       },
//     },
//   },
// });
