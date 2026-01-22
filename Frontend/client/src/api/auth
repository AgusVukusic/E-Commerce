import { AUTH, postJSON, postJSONWithToken, getJSON } from "./client";

export const loginApi = ({ email, password }) => postJSON(AUTH.LOGIN, { email, password });
export const registerApi = (payload) => postJSON(AUTH.REGISTER, payload);
export const logoutApi = (token) => postJSONWithToken(AUTH.LOGOUT, {}, token);
export const getUserInfo = (token) => getJSON(AUTH.ME, token);
