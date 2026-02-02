export const MESSAGE_STYLES: Record<
    string,
    {
        bg: string;
        title: string;
        body: string;
        badge: string;
    }
> = {
    general: {
        bg: "bg-[#071633]",
        title: "text-white",
        body: "text-blue-50",
        badge: "bg-slate-600 text-white",
    },

    birthday: {
        bg: "bg-purple-700",
        title: "text-white",
        body: "text-purple-100",
        badge: "bg-pink-500 text-white",
    },

    anniversary: {
        bg: "bg-emerald-700",
        title: "text-white",
        body: "text-emerald-100",
        badge: "bg-emerald-500 text-white",
    },

    changes: {
        bg: "bg-[#f7ed20]",
        title: "text-amber-900",
        body: "text-amber-800",
        badge: "bg-amber-500 text-black",
    },

    otp: {
        bg: "bg-red-600",
        title: "text-white",
        body: "text-red-100",
        badge: "bg-red-800 text-white",
    },
};
