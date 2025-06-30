import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

const CreateRecipe = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    image: '',
  });

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [allIngredients, setAllIngredients] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/ingredient", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setAllIngredients(data))
      .catch(err => console.error("Failed to fetch ingredients:", err));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setRecipeData({ ...recipeData, [field]: value });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipeData.title || !recipeData.description || !recipeData.category || !recipeData.prepTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const filteredIngredients = ingredients.filter(i => i.trim());
    const filteredInstructions = instructions.filter(i => i.trim());

    if (filteredIngredients.length < 1 || filteredInstructions.length < 1) {
      toast({
        title: "Missing Steps",
        description: "Please provide ingredients and instructions.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Map ingredient names to their IDs
      const ingredientIds = filteredIngredients.map(ingredientId => {
        // Verify the ID is valid (24 character hex string)
        if (!/^[0-9a-fA-F]{24}$/.test(ingredientId)) {
          throw new Error(`Invalid ingredient ID: ${ingredientId}`);
        }
        return ingredientId;
      });

      const response = await fetch('http://localhost:5001/api/recipe', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipeData.title,
          description: recipeData.description,
          instructions: filteredInstructions.join('\n'),
          prepTime: recipeData.prepTime,
          category: recipeData.category,
          ingredients: ingredientIds,
          image: recipeData.image,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Submission failed');
      }

      toast({
        title: "Recipe Created!",
        description: "Your recipe has been successfully submitted.",
      });

      // Reset form
      setRecipeData({ title: '', description: '', category: '', prepTime: '', image: '' });
      setIngredients(['']);
      setInstructions(['']);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Something went wrong.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={recipeData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)} 
                required 
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={recipeData.description} 
                onChange={(e) => handleInputChange('description', e.target.value)} 
                required 
              />
            </div>

            <div>
              <Label htmlFor="prepTime">Preparation Time</Label>
              <Input 
                id="prepTime" 
                value={recipeData.prepTime} 
                onChange={(e) => handleInputChange('prepTime', e.target.value)} 
                placeholder="e.g. 30 minutes" 
                required 
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                value={recipeData.image} 
                onChange={(e) => handleInputChange('image', e.target.value)} 
                placeholder="https://example.com/recipe.jpg" 
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={recipeData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ingredients</Label>
              {ingredients.map((ingredientId, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <select
                    value={ingredientId}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Ingredient</option>
                    {allIngredients.map((ing) => (
                      <option key={ing._id} value={ing._id}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeIngredient(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={addIngredient}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Ingredient
              </Button>
            </div>

            <div>
              <Label>Instructions</Label>
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <Textarea 
                    value={instruction} 
                    onChange={(e) => handleInstructionChange(index, e.target.value)} 
                    placeholder={`Step ${index + 1}`} 
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeInstruction(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={addInstruction}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Step
              </Button>
            </div>

            <Button 
              type="submit" 
              className="bg-sage-500 hover:bg-sage-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateRecipe;