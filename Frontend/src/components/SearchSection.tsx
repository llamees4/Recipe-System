
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a recipe name",
        description: "Try searching for 'cake' or 'lasagna'!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('🔍 Starting search for:', searchQuery.trim());
    
    try {
      const apiUrl = `/api/recipes/findByName?name=${encodeURIComponent(searchQuery.trim())}`;
      console.log('📡 Making API call to:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📬 Response status:', response.status);
      console.log('📬 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('📋 Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const recipe = await response.json();
          console.log('✅ Recipe found:', recipe);
          
          // Check if recipe has the expected structure
          if (recipe && recipe.id) {
            toast({
              title: "Recipe found!",
              description: `Found: ${recipe.name || 'Unnamed recipe'}`,
            });
            navigate(`/recipe/${recipe.id}`);
          } else {
            console.log('⚠️ Recipe object missing expected properties:', recipe);
            toast({
              title: "Recipe data incomplete",
              description: "Found a recipe but it's missing some information.",
              variant: "destructive"
            });
          }
        } else {
          const textResponse = await response.text();
          console.error('❌ Expected JSON but got:', contentType);
          console.error('📄 Response body:', textResponse.substring(0, 200) + '...');
          
          toast({
            title: "Backend configuration issue",
            description: "The server returned HTML instead of JSON. Check your backend setup.",
            variant: "destructive"
          });
        }
      } else if (response.status === 404) {
        console.log('🚫 Recipe not found for:', searchQuery);
        toast({
          title: "Recipe not found",
          description: `We couldn't find a recipe for "${searchQuery}". Try another search!`,
          variant: "destructive"
        });
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        
        toast({
          title: "Search failed",
          description: `Server error (${response.status}). Check console for details.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 Network/Fetch error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Connection failed",
          description: "Could not connect to the server. Is your backend running?",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search failed",
          description: "Something went wrong with the search. Check console for details.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
          What's cooking? 🔎
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Just type a recipe name — like 'cake' or 'lasagna' — and we'll fetch it fresh from our kitchen!
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Try 'pasta', 'cake', or 'curry'..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-sage-500 hover:bg-sage-600 text-white h-12 px-6"
              disabled={isLoading}
            >
              {isLoading ? '🔄' : '🍳'} {isLoading ? 'Searching...' : 'Find Recipe'}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-gray-500 mt-4">
          Hit enter or click the 🍳 Find Recipe button to get started!
        </p>
        
        {/* Debug info - remove in production */}
        <div className="mt-4 text-xs text-gray-400">
          Debug: API endpoint is /api/recipes/findByName?name=...
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
