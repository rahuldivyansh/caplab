import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

const handler = async (req, res) => {
  try {
    // const { data: updatedUserData, error: updatedUserError } =
    //   await supabaseClient.auth.admin.updateUserById(req.user, {
    //     password: req.body.password,
    //   });
    // if (updatedUserError) throw updatedUserError;
    // return res.status(StatusCodes.OK).json({
    //   message: "Password updated successfully",
    //   data: updatedUserData,
    // });
    const { user } = req;
    if(!user){
      throw new Error("User must login first");
    }
    const verifyResponse = await supabaseClient.rpc("verify_and_change_user_password", {
          current_plain_password: req.body.oldPassword,
          new_plain_password: req.body.newPassword,
          user_id: user
        });
        
        res.status(StatusCodes.OK).json(verifyResponse);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error, message: error.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json("Unauthenticated");
  }
};

export default withAuthApi(handler);
