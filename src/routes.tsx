import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout.tsx";
import { Catalog } from "./components/Catalog.tsx";
import { ChallengesList } from "./components/ChallengesList.tsx";
import { ChallengeDetail } from "./components/ChallengeDetail.tsx";
import { ProfileView } from "./components/ProfileView.tsx";
import { MyExchangesView } from "./components/MyExchangesView.tsx";
import { Muro } from "./components/Muro.tsx";
import { NewsDetail } from "./components/NewsDetail.tsx";
import { ContestDetail } from "./components/ContestDetail.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import Login from "./components/Login.tsx";
import PasswordReset from "./components/PasswordReset.tsx";
import WalletView from "./components/WalletView.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import BackgroundDemo from "./components/BackgroundDemo.tsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/reset-password",
    element: <PasswordReset />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/background-demo",
    element: <BackgroundDemo />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Muro />,
      },
      {
        path: "catalogo",
        element: <Catalog />,
      },
      {
        path: "muro/:id",
        element: <NewsDetail />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "concurso/:id",
        element: <ContestDetail />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "desafios",
        element: <ChallengesList />,
      },
      {
        path: "desafios/:id",
        element: <ChallengeDetail />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "perfil",
        element: <ProfileView userPoints={15000} />,
      },
      {
        path: "mis-canjes",
        element: (
          <MyExchangesView
            userPoints={15000}
            onBack={() => window.history.back()}
            onProfileClick={() => {}}
          />
        ),
      },
      {
        path: "billetera",
        element: <WalletView />,
      },
      {
        path: "*",
        element: <ErrorBoundary />,
      },
    ],
  },
]);