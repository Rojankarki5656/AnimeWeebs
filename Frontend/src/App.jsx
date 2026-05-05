import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./utils/ScrollToTop";
import useSidebarStore from "./store/sidebarStore";

// Lazy load pages (🔥 important)
const Home = lazy(() => import("./pages/Home"));
const Root = lazy(() => import("./pages/Root"));
const ListPage = lazy(() => import("./pages/ListPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const SearchResult = lazy(() => import("./pages/SearchResult"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const PeopleInfoPage = lazy(() => import("./pages/PeopleInfoPage"));
const CharacterInfoPage = lazy(() => import("./pages/CharacterInfoPage"));
const CharactersPage = lazy(() => import("./pages/CharactersPage"));
const RecentlyAddedPage = lazy(() => import("./pages/Recently-AddedPage"));

// Optional: lightweight loader
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    Loading...
  </div>
);

const App = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const togglesidebar = useSidebarStore((state) => state.toggleSidebar);
  const location = useLocation();
  const path = location.pathname === "/";

  return (
    <>
      {!path && <Sidebar />}

      <main className={`${isSidebarOpen ? "bg-active" : ""} opacityWrapper`}>
        <div
          onClick={togglesidebar}
          className={`${isSidebarOpen ? "active" : ""} opacityBg`}
        ></div>

        {!path && <Header />}
        <ScrollToTop />

        {/* 🔥 Suspense wrapper */}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/home" element={<Home />} />
            <Route path="/anime/:id" element={<DetailPage />} />
            <Route path="/animes/:category/:query?" element={<ListPage />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/watch/:slug" element={<WatchPage />} />
            <Route path="/characters/:id" element={<CharactersPage />} />
            <Route path="/people/:id" element={<PeopleInfoPage />} />
            <Route path="/list/:id" element={<RecentlyAddedPage />} />
            <Route path="/character/:id" element={<CharacterInfoPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default App;