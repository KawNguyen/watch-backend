import app from "./app";

const PORT = process.env.PORT || 3000; // Change to 3001 or another port

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
