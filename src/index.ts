import app from "./app";
import { slug } from "./config/slugify";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  slug();
  console.log(`Server is running on port ${PORT}`);
});
