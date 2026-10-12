import {
  createBrowserRouter,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.statusText || "Something went wrong."}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>Please try again later.</p>
    </div>
  );
}