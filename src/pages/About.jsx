import Card from "../components/common/Card";

export default function About() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About This Boilerplate
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A production-ready React boilerplate for rapid development
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ React 18+ with Hooks</li>
          <li>✅ Tailwind CSS v4 for styling</li>
          <li>✅ Vite for fast builds</li>
          <li>✅ Axios for API calls</li>
          <li>✅ React Router for navigation</li>
          <li>✅ Pre-built reusable components</li>
          <li>✅ Organized folder structure</li>
          <li>✅ Ready for any backend integration</li>
        </ul>
      </Card>
    </div>
  );
}
