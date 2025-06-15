import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus, TUser } from "@utils-types"
import { getUser, loginUser, logoutUser, updateUser, registerUser, forgotPassword, resetPassword } from "@thunk"
import { USER_SLICE_NAME } from "@utils/constants"
import { isActionPending, isActionRejected } from "@utils/redux"
import { stat } from "fs"

interface UserState {
    user: TUser | null;
    userCheck: boolean;
    status: RequestStatus;
    forgotPasswordStatus: RequestStatus; // Состояние для forgotPassword
    resetPasswordStatus: RequestStatus; // Состояние для resetPassword
}

const initialState: UserState = {
    user: null,
    userCheck: false,
    status: RequestStatus.Idle,
    forgotPasswordStatus: RequestStatus.Idle,
    resetPasswordStatus: RequestStatus.Idle,
}

export const userSlice = createSlice({
    name: USER_SLICE_NAME,
    initialState,
    selectors:{
        selectUser: state => state.user,
        selectUserCheck: state => state.userCheck,
        selectUserStatus: state => state.status,
        selectForgotPasswordStatus: state => state.forgotPasswordStatus,
        selectResetPasswordStatus: state => state.resetPasswordStatus
    },
    reducers: {
        setUserCheck: state => {
            state.userCheck = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = RequestStatus.Success;
                state.user = action.payload.user;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = RequestStatus.Success;
                state.user = action.payload.user;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = RequestStatus.Success;
                state.user = action.payload.user;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = RequestStatus.Success;
                state.user = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.user; 
                state.status = RequestStatus.Success;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.forgotPasswordStatus = RequestStatus.Success;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetPasswordStatus = RequestStatus.Success;
            })
            .addMatcher(isActionPending(USER_SLICE_NAME), state => {
                state.status = RequestStatus.Loading;
            }
            )
            .addMatcher(isActionRejected(USER_SLICE_NAME), state => {
                state.status = RequestStatus.Failed;
            }
            )
    }
}) 

export const { selectUser, selectUserCheck, selectUserStatus, selectForgotPasswordStatus, selectResetPasswordStatus } = userSlice.selectors;
export const { setUserCheck } = userSlice.actions;
