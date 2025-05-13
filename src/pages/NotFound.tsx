
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <p className="text-2xl font-semibold text-neutral-900 mb-6">Page not found</p>
      <p className="text-neutral-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or might have been moved.
      </p>
      <Button asChild className="bg-gradient-yellow text-neutral-900 hover:shadow-glow">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
