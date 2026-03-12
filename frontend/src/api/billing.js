import api from "./client";

export const createInvoice = async (items) => {

    const response = await api.post("/billing", {
        items: items
    });

    return response.data;
};