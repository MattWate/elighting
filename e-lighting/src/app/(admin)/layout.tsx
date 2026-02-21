export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="admin-container">
      {/* You can add an Admin Sidebar or Header here later */}
      <nav className="bg-slate-800 text-white p-4">
        <span className="font-bold">eLighting Admin</span>
      </nav>
      {children}
    </section>
  );
}
