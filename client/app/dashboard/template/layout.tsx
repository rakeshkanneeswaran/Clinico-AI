"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4">{children}</main>
      </div>
    </div>
  );
}
