// src/layouts/AppLayout.jsx
const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow p-4 text-xl font-semibold">Chat App</header>
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
};

export default AppLayout;
