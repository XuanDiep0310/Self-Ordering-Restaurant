import { routes } from "../../routes";
import { useRoutes } from "react-router-dom";

function AllRoute() {
  const element = useRoutes(routes);
  return <>{element}</>;
}

export default AllRoute;