import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="text-8xl mb-6">🌾</div>
      <h1 className="font-heading text-6xl font-bold text-forest-800 mb-4">404</h1>
      <h2 className="font-heading text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Sorry, the page you are looking for doesn't exist. Let's get you back to the right place.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home <FaArrowRight />
      </Link>
    </div>
  );
}
