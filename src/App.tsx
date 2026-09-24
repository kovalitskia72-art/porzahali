import { useRouter } from '@/hooks/useRouter';
import { useReactions } from '@/hooks/useReactions';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { PostPage } from '@/pages/PostPage';
import { SearchPage } from '@/pages/SearchPage';
import { VideosPage } from '@/pages/VideosPage';

function App() {
  const { route, navigate } = useRouter();
  const { hasReacted, toggleReaction } = useReactions();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route.name === 'home' && (
          <HomePage hasReacted={hasReacted} onReact={toggleReaction} onNavigate={navigate} />
        )}
        {route.name === 'all' && (
          <CategoryPage
            hasReacted={hasReacted}
            onReact={toggleReaction}
            onNavigate={navigate}
            showAll
          />
        )}
        {route.name === 'category' && (
          <CategoryPage
            hasReacted={hasReacted}
            onReact={toggleReaction}
            onNavigate={navigate}
            categoryId={route.id}
          />
        )}
        {route.name === 'post' && (
          <PostPage
            postId={route.id}
            hasReacted={hasReacted}
            onReact={toggleReaction}
            onNavigate={navigate}
          />
        )}
        {route.name === 'search' && (
          <SearchPage hasReacted={hasReacted} onReact={toggleReaction} />
        )}
        {route.name === 'videos' && <VideosPage />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
