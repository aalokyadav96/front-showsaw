import { apiFetch } from "../../api/api.js";
export const SlotAPI = {
    async add(date, time, capacity) {
        const res = await apiFetch("/api/slots", "POST",JSON.stringify({ date, time, capacity }));
        return res.ok;
    },

    async delete(date, time) {
        await apiFetch(`/api/slots/${encodeURIComponent(date)}/${encodeURIComponent(time)}`, "DELETE");
    },

    async get(date) {
        const res = await apiFetch(`/api/slots/${encodeURIComponent(date)}`);
        if (!res.ok) return [];
        return res.json(); // returns [{ time, capacity }]
    }
};

export const BookingAPI = {
    async getByDate(date) {
        const res = await apiFetch(`/api/bookings/${encodeURIComponent(date)}`);
        if (!res.ok) return [];
        return res.json(); // returns [{ time, name, seats }]
    }
};
