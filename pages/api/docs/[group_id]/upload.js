import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const upload = multer({
  storage: multer.memoryStorage(), // You can change this to a disk storage if needed
});

const handler = async (req, res) => {
  try {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      if (req.file) {
        const { file } = req;
        console.log(file);
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
    });
    res
      .status(200)
      .json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export default handler;
