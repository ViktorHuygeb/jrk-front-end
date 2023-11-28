import Loader from "./Loader";
import Error from "./Error";

export default function AsyncData({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error: Error | null;
  children: any;
}) {
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Error error={error} />
      {children}
    </>
  );
}
