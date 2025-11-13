export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Your App. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Built with React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
