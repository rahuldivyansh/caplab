import { BUCKET_NAME } from "@/src/constants/storage";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";
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
  const { group_id } = req.query;
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      const { data: uploadData, error: uploadError } =
        await supabaseClient.storage
          .from(BUCKET_NAME)
          .upload(
            `group_${group_id}/${req.file.originalname}`,
            req.file.buffer,
            {
              upsert: true,
            }
          );
      if (uploadError) {
        console.error(uploadError);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      return res.status(StatusCodes.CREATED).json(uploadData);
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Bad Request" });
  }
};
export default handler;
