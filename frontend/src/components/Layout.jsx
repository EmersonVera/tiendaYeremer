import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 w-full max-w-[800px] mx-auto pb-32 md:pb-lg">{children}</main>
      <BottomNav />
    </div>
  );
}
