export default function Spinner() {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-slate-500 animate-pulse">Loading data...</p>
        </div>
    );
}