import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Watch API",
      version: "1.0.0",
      description: "API tài liệu cho Watch Backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Đường dẫn tới các file chứa swagger comment
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;