const Sidebar = () => {
  return (
    <aside className="w-64 bg-card text-card-foreground p-4 shadow h-screen sticky top-0">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      {/* Navigation links can be added here later or duplicated from NavBar */}
      <p className="text-sm">Quick Access:</p>
      <ul className="mt-2 space-y-2">
        <li><a href="#" className="hover:text-primary">Link 1</a></li>
        <li><a href="#" className="hover:text-primary">Link 2</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
