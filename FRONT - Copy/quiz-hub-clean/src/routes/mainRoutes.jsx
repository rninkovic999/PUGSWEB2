import React from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "../components/Route/PrivateRoute";
import AdminRoute from "../components/Route/AdminRoute";

const HomePage = React.lazy(() => import("../pages/HomePage"));
const ProfilePage = React.lazy(() => import("../pages/ProfilePage"));
const UpdateAccount = React.lazy(() => import("../components/UpdateAccount/UpdateAccount"));
const GlobalLeaderboardPage = React.lazy(() =>
  import("../pages/GlobalLeaderboardPage")
);
const ResultsDetailsPage = React.lazy(() =>
  import("../pages/ResultsDetailsPage")
);
const StartQuizPage = React.lazy(() => import("../pages/StartQuizPage"));
const QuizLeaderboardPage = React.lazy(() =>
  import("../pages/QuizLeaderboardPage")
);
const AdminQuizResultsPage = React.lazy(() =>
  import("../pages/AdminQuizResultsPage")
);
const AdminQuizResultsDetailsPage = React.lazy(() =>
  import("../pages/AdminQuizResultsDetailsPage")
);
const AddQuestionPage = React.lazy(() => import("../pages/AddQuestionPage"));
const EditQuizPage = React.lazy(() => import("../pages/EditQuizPage"));
const EditQuizForm = React.lazy(() =>
  import("../components/EditQuizForm/EditQuizForm")
);
const AdminQuizPage = React.lazy(() => import("../pages/AdminQuizPage"));
const JoinLobbyPage = React.lazy(() => import("../pages/JoinLobbyPage"));
const CreateLobbyPage = React.lazy(() => import("../pages/CreateLobbyPage"));
const QuizRoomPage = React.lazy(() => import("../pages/QuizRoomPage"));

export const mainRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    
    <Route
      path="profile/:id"
      element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      }
    />
    
    {/* Nova ruta za ažuriranje profila */}
    <Route
      path="profile/update"
      element={
        <PrivateRoute>
          <UpdateAccount />
        </PrivateRoute>
      }
    />
    
    <Route
      path="global/leaderboard"
      element={
        <PrivateRoute>
          <GlobalLeaderboardPage />
        </PrivateRoute>
      }
    />
    
    <Route
      path="result/details/:id"
      element={
        <PrivateRoute>
          <ResultsDetailsPage />
        </PrivateRoute>
      }
    />
    
    <Route
      path="quiz/start/:id"
      element={
        <PrivateRoute>
          <StartQuizPage />
        </PrivateRoute>
      }
    />
    
    <Route
      path="quiz/:id/leaderboard"
      element={
        <PrivateRoute>
          <QuizLeaderboardPage />
        </PrivateRoute>
      }
    />
    
    <Route
      path="lobby/join"
      element={
        <PrivateRoute>
          <JoinLobbyPage />
        </PrivateRoute>
      }
    />
    
    <Route
      path="lobby/join/:id"
      element={
        <PrivateRoute>
          <QuizRoomPage />
        </PrivateRoute>
      }
    />
    
    <Route
      path="quiz-result/admin/:quizId"
      element={
        <AdminRoute>
          <AdminQuizResultsPage />
        </AdminRoute>
      }
    />
    
    <Route
      path="result/details/:quizResultId/admin"
      element={
        <AdminRoute>
          <AdminQuizResultsDetailsPage />
        </AdminRoute>
      }
    />
    
    <Route
      path="quiz/add-question/:quizId"
      element={
        <AdminRoute>
          <AddQuestionPage />
        </AdminRoute>
      }
    />
    
    <Route
      path="quiz/edit/:quizId"
      element={
        <AdminRoute>
          <EditQuizPage />
        </AdminRoute>
      }
    />
    
    <Route
      path="quiz/edit-form/:quizId"
      element={
        <AdminRoute>
          <EditQuizForm />
        </AdminRoute>
      }
    />
    
    <Route
      path="quiz/admin"
      element={
        <AdminRoute>
          <AdminQuizPage />
        </AdminRoute>
      }
    />
    
    <Route
      path="lobby/create"
      element={
        <AdminRoute>
          <CreateLobbyPage />
        </AdminRoute>
      }
    />
  </Route>
);