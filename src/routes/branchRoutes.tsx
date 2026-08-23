import SOP from "../pages/branch/SOP/SOP";
import Order from "../pages/branch/Order/Order";
import DailyServices from "../pages/branch/DailyServices/DailyServices";
import EndOfMonth from "../pages/branch/EndOfMonth/EndOfMonth";
import CDBalanceCheck from "../pages/branch/CDBalanceCheck/CDBalanceCheck";

export const branchRoutes = [
  {
    title: "SOP",
    path: "sop",
    element: <SOP />,
  },
  {
    title: "Order",
    path: "order",
    element: <Order />,
  },
  {
    title: "Daily Services",
    path: "daily-services",
    element: <DailyServices />,
  },
  {
    title: "End Of Month",
    path: "end-of-month",
    element: <EndOfMonth />,
  },
  {
    title: "CD Balance Check",
    path: "cd-balance-check",
    element: <CDBalanceCheck />,
  },
];