import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { AxiosResponse } from "axios";
import { getGateway } from "./Core";

export interface AdvertisementUser {
    _id: string;
    firstName: string;
    lastName: string;
    userImage: string;
}

export interface Advertisement {
    _id: string;
    user: AdvertisementUser;
    description: string;
    image: string;
    redirectUrl: string;
    status: "pending" | "approved" | "active" | "rejected" | string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export async function approveAdvertisement({ advertId, adminId }: Record<string, string>, throwError?: boolean){
    const result = await getGateway(throwError).patch(`/admin/approveAdvertisement/${advertId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function rejectAdvertisement({ advertId, adminId }: Record<string, string>, throwError?: boolean){
    const result = await getGateway(throwError).patch(`/admin/rejectAdvertisement/${advertId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function deleteAdvertisement({ advertId, adminId }: Record<string, string>, throwError?: boolean){
    const result = await getGateway(throwError).patch(`/admin/deleteAdvertisement/${advertId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function getPendingAdvertisements(throwError?: boolean){
    const result = await getGateway(throwError).get(`/admin/getPendingAdvertisements`);
    return result as AxiosResponse<ApiResponse<Advertisement[]>, unknown>;
}

export async function getActiveAdvertisements(throwError?: boolean){
    const result = await getGateway(throwError).get(`/getActiveAdvertisements`);
    return result as AxiosResponse<ApiResponse<Advertisement[]>, unknown>;
}